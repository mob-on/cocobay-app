import withPlugins from "next-compose-plugins";

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["antd-mobile"],
  trailingSlash: true,
  images: {
    disableStaticImages: true,
  },
};

const defaultConfig = {};

const nextConfigWithPlugins = async (phase) =>
  withPlugins([[{}]], nextConfig)(phase, {
    defaultConfig,
  });

export default nextConfigWithPlugins;
