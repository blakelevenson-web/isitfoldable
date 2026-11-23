import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local preview only: lets a phone on the same Wi-Fi load the dev server
  // via this Mac's network address. Has no effect on the live site.
  // The address changes per Wi-Fi network — add new ones here if needed.
  allowedDevOrigins: ["10.90.87.176", "192.168.1.37"],
};

export default nextConfig;
