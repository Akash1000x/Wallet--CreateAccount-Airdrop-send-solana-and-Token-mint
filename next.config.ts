import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => [
    {
      source: "/",
      destination: "/create-wallet",
      permanent: false,
    },
  ],
};

export default nextConfig;
