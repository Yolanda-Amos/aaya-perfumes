import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Official Naseem product photography (see lib/product-images.ts).
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" }],
  },
};

export default nextConfig;
