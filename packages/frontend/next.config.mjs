import withPlugins from "next-compose-plugins";
import withImages from "next-images";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["antd-mobile"],
  trailingSlash: true,
  images: {
    disableStaticImages: true,
    unoptimized: true, //required by next output:export
  },
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
  // webpack(config) {
  //   config.module.rules.push(
  //     {
  //       test: /\.svg$/,
  //       use: [
  //         {
  //           loader: '@svgr/webpack',
  //           options: {

  //           },
  //         },
  //       ]
  //     }
  //   );
  //   return config;
  // },
};

const defaultConfig = {};

const nextConfigWithPlugins = async (phase) =>
  withPlugins([[withImages()]], nextConfig)(phase, {
    defaultConfig,
  });

export default nextConfigWithPlugins;
