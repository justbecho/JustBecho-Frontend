/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.jsdelivr.net'],
    unoptimized: true, // ✅ MOST IMPORTANT for Netlify
  },
  reactCompiler: true,
  // Static export for Netlify
  output: 'export',
  trailingSlash: true,
}

export default nextConfig