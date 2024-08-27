import withPlugins from "next-compose-plugins";
import withOptimizedImages from "next-optimized-images";

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd-mobile'],
  trailingSlash: true,
  images: {
    disableStaticImages: true,
  },
};

const defaultConfig = {};

const nextConfigWithPlugins = async (phase) =>
  withPlugins([[withOptimizedImages, {}]], nextConfig)(phase, {
    defaultConfig,
  });

export default nextConfigWithPlugins;
