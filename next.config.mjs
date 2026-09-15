import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudinary sizes and re-encodes its own images; everything else falls
    // through to Next's optimizer. See lib/cloudinary-loader.ts.
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
    remotePatterns: [
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
