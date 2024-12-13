import withPlugins from "next-compose-plugins";
import withImages from "next-images";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["antd"],
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

export default nextConfigWithPlugins;
