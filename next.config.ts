import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "repmkt.s3.ca-central-1.amazonaws.com",
        pathname: "/repmkt-images/**",
      },
    ],
  },
};

export default nextConfig;
