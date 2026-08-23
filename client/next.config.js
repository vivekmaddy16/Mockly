const path = require('path');
const { loadEnvConfig } = require('@next/env');

// Load environment variables from project root (.env)
loadEnvConfig(path.resolve(__dirname, '..'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
}

module.exports = nextConfig
