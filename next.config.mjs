/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Avatares gerados pela DiceBear API (usados nos mockups do sistema)
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
};

export default nextConfig;
