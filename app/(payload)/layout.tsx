/* Payload admin root layout. This route group has its own <html>/<body>, which
   is why the public site lives under app/(frontend). */
import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import "@payloadcms/next/css";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { Fraunces, Inter } from "next/font/google";
import React from "react";

import { importMap } from "./admin/importMap";
import "./custom.scss";

// The same two typefaces as the public site.
const inter = Inter({ subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], display: "swap" });

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {/* RootLayout owns <html>, so the font families are handed to the theme
          as custom properties rather than as a className. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{--font-admin-sans:${inter.style.fontFamily};--font-admin-display:${fraunces.style.fontFamily};}`,
        }}
      />
      {children}
    </RootLayout>
  );
}
