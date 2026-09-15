import Image from "next/image";

import logoBlack from "@/assets/images/JOMI short black.png";

/**
 * The mark on the login and create-first-user screens. Payload renders this at
 * a generous size, so the wordmark carries the ministry name underneath it.
 */
export function Logo() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <Image
        src={logoBlack}
        alt="Jide Ojo Ministry International"
        height={56}
        style={{ height: 56, width: "auto" }}
        priority
      />
      <span
        style={{
          color: "var(--theme-elevation-500)",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Content dashboard
      </span>
    </div>
  );
}

export default Logo;
