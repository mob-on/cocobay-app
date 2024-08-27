#!/usr/bin/env node
import { Config } from "aws-cdk-config";
import { App } from "aws-cdk-lib";
import { Website } from "../lib/website";

const app = new App();
const config = new Config(app);

new Website(app, "WebsiteStack", config);
