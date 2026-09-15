"use client";

/**
 * next/image loader.
 *
 * Cloudinary-hosted images get their resize, format and quality applied by
 * Cloudinary itself, so the CDN returns exactly the variant the browser asked
 * for. Without this, next/image would fetch the full-size original from
 * Cloudinary and re-encode it on our own server: paying for the work twice, and
 * losing the CDN edge.
 *
 * It also matters for format. Cloudinary's f_auto only switches to WebP or AVIF
 * when the request carries a resize; on a bare URL it returns JPEG. With a width
 * in the transformation the same image drops from 211KB to 16KB.
 *
 * Anything not on Cloudinary (logos and the seed photography, imported through
 * the bundler) is returned untouched. Declaring a custom loader turns off
 * Next's own /_next/image endpoint, so handing those back a /_next/image URL
 * would 404. They are already sized and compressed in the repo, and served
 * immutable from /_next/static, so passing them through is the right answer.
 */
type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

const CLOUDINARY_HOST = "res.cloudinary.com";

export default function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  if (!src.includes(CLOUDINARY_HOST)) return src;

  const [base, rest] = src.split("/upload/");
  if (!rest) return src;

  // Drop the transformation segment the adapter stored, so ours replaces it
  // rather than chaining onto it. A version segment (v1/...) or a bare public id
  // is left alone.
  const segments = rest.split("/");
  const hasTransformation =
    segments.length > 1 && /(^|,)[a-z]{1,2}_/.test(segments[0]);
  const publicPath = hasTransformation ? segments.slice(1).join("/") : rest;

  const transformation = [
    `w_${width}`,
    // c_limit never enlarges, so a small original stays small.
    "c_limit",
    "f_auto",
    quality ? `q_${quality}` : "q_auto",
  ].join(",");

  return `${base}/upload/${transformation}/${publicPath}`;
}
