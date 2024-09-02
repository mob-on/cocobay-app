import withPlugins from "next-compose-plugins";
import withImages from "next-images";

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["antd-mobile"],
  trailingSlash: true,
  images: {
    disableStaticImages: true,
    unoptimized: true, //required by next output:export
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
