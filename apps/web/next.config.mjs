/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Strict Mode in development to avoid double-mounting (Leaflet init error)
  reactStrictMode: process.env.NODE_ENV === "production",
};

export default nextConfig;
