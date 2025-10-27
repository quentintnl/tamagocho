import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Ignore Docusaurus documentation folder during Next.js build
  webpack (config) {
    config.module.rules.push({
      test: /\.tsx?$/,
      include: /documentation/,
      use: 'null-loader'
    })
    return config
  }
}

export default nextConfig
