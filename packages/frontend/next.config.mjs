import withPlugins from "next-compose-plugins";
import withImages from "next-images";
import bundleAnalyzer from '@next/bundle-analyzer';
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
};

const defaultConfig = {};

const nextConfigWithPlugins = async (phase) =>
  withPlugins([[withImages()]], nextConfig)(phase, {
    defaultConfig,
  });
  
// const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })
   

export default nextConfigWithPlugins;
