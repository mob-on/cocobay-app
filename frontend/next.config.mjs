import withPlugins from "next-compose-plugins";

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["antd-mobile"],
  trailingSlash: true,
  images: {
    disableStaticImages: true,
  },
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {},
          },
        ]
      }
    );
    return config;
  },
};

const defaultConfig = {};

const nextConfigWithPlugins = async (phase) =>
  withPlugins([[{}]], nextConfig)(phase, {
    defaultConfig,
  });

export default nextConfigWithPlugins;
