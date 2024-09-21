import bundleAnalyzer from "@next/bundle-analyzer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const SASS_LOADER = {
  loader: "sass-loader",
  options: {
    api: "modern-compiler",
    sassOptions: {
      silenceDeprecations: ["legacy-js-api"],
      includePaths: [path.join(__dirname, "styles")],
    },
    additionalData: {},
  },
};

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "export",
  reactStrictMode: false,
  trailingSlash: true,
  transpilePackages: ["antd"],
  images: {
    disableStaticImages: false,
    unoptimized: true, //required by next output:export
  },
  experimental: {
    optimizePackageImports: [
      "antd-mobile",
      "antd-mobile-icons",
      "@ant-design/icons",
    ],
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
    turbo: {
      rules: {
        "*.svg": {
          as: "*.js",
          loaders: ["@svgr/webpack"],
        },
        "*.module.scss": {
          as: "*.module.css",
          loaders: [SASS_LOADER],
        },
        "*.scss": {
          as: "*.css",
          loaders: [SASS_LOADER],
        },
      },
    },
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
