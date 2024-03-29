/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    config.externals = [...config.externals, "canvas", "jsdom"];

    return config;
  },
  output: "standalone",
};

module.exports = nextConfig;
