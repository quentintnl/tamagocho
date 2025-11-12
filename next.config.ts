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
  },

  // Configuration des en-têtes CORS pour les routes API
  async headers () {
    return [
      {
        // Applique ces en-têtes à toutes les routes API
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL ?? '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
          }
        ]
      }
    ]
  }
}

export default nextConfig
