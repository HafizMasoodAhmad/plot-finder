/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    //  Allow build to succeed even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    //  Allow production builds to complete even if there are TS errors
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;