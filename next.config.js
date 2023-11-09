/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BASE_API_URL: process.env.BASE_API_URL,
    AUTH_API_URL: process.env.AUTH_API_URL,
    FILE_API_URL: process.env.FILE_API_URL
  },
  compiler: {
    styledComponents: true
  }
};

module.exports = nextConfig;
