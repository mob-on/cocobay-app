import { Config } from "aws-cdk-config";
import * as cdk from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import { Certificate, ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as patterns from "aws-cdk-lib/aws-route53-patterns";
import * as alias from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";

export class Website extends cdk.Stack {
  private readonly config: Config;
  private readonly bucket: s3.Bucket;
  private readonly zone: route53.IHostedZone;
  private readonly wildcardCertificate: ICertificate;

  constructor(
    scope: cdk.App,
    id: string,
    config: Config,
    props?: cdk.StackProps,
  ) {
    super(scope, id, config.getStackProps(props));

    this.config = config;

    this.zone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: this.getDomainProperties().domainName,
    });

    this.wildcardCertificate = Certificate.fromCertificateArn(
      this,
      "Certificate",
      this.config.getEnvParam("wildcardCertificateArn"),
    );

    this.bucket = this.createS3Bucket();
    this.createCloudfrontDistribution();
    this.deployWebsite();

    if (this.config.env === "prod") {
      this.createWWWRedirect();
    }
  }

  private createS3Bucket() {
    return new s3.Bucket(this, "MainWebsiteBucket", {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: this.config.getEnvParam("mainWebsiteBucketName"),
      versioned: false,
      websiteErrorDocument: "404.html",
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });
  }

  private deployWebsite() {
    new s3deploy.BucketDeployment(this, "MainWebsite", {
      sources: [s3deploy.Source.asset("../out")],
      destinationBucket: this.bucket,
      cacheControl: [
        s3deploy.CacheControl.maxAge(Duration.minutes(5)),
        s3deploy.CacheControl.setPublic(),
      ],
      prune: false,
    });
  }

  private createCloudfrontDistribution() {
    const origin = new origins.S3Origin(this.bucket);

    const { domainName } = this.getDomainProperties();

    const mainWebsiteCachePolicy = new cloudfront.CachePolicy(
      this,
      "MainWebsiteCachePolicy",
      {
        cachePolicyName: "MainWebsiteCachePolicy",
        comment: "Default policy for the Main Website",
        defaultTtl: Duration.minutes(5),
        minTtl: Duration.seconds(30), //Even for static pages like the index, we create a 30-second cache in cloudfront to prevent spam-refreshing
        maxTtl: Duration.days(365),
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
        headerBehavior: cloudfront.CacheHeaderBehavior.none(),
        enableAcceptEncodingGzip: true,
        enableAcceptEncodingBrotli: true,
      },
    );

    const distribution = new cloudfront.Distribution(
      this,
      "MainWebsiteDistribution",
      {
        defaultBehavior: {
          origin: origin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: mainWebsiteCachePolicy,
        },
        domainNames: [domainName],
        certificate: this.wildcardCertificate,
      },
    );

    new route53.ARecord(this, "MainWebsiteCloudfrontDNS", {
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new alias.CloudFrontTarget(distribution),
      ),
      zone: this.zone,
    });
  }

  private getDomainProperties() {
    const domainName = this.config.getEnvParam("baseDomain");
    return { domainName };
  }

  private createWWWRedirect() {
    const { domainName } = this.getDomainProperties();

    new patterns.HttpsRedirect(this, "MainWebsiteWWWRedirect", {
      recordNames: [`www.${domainName}`],
      targetDomain: domainName,
      zone: this.zone,
      certificate: this.wildcardCertificate,
    });
  }
}
