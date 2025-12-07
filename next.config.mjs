/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Netlify ke liye required
  },
  reactCompiler: true,
  // ✅ Netlify ke liye optimize
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // ❌ output: 'export' HATA DO
  // ❌ output: 'standalone' bhi hata do
}

export default nextConfig