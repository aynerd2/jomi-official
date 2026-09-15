import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Uploads are delivered from Cloudinary's CDN.
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      // /resources and /media were two overlapping libraries; they are now one page.
      { source: "/resources", destination: "/media", permanent: true },
    ];
  },
};

export default withPayload(nextConfig);
