/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // static export → deployable on Cloudflare Pages
  images: { unoptimized: true },
};

export default nextConfig;
