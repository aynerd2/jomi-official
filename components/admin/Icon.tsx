import Image from "next/image";

import logoBlack from "@/assets/images/JOMI short black.png";

/**
 * The small mark in the admin header, beside the breadcrumbs.
 */
export function Icon() {
  return (
    <Image
      src={logoBlack}
      alt="JOMI"
      height={24}
      style={{ height: 24, width: "auto" }}
    />
  );
}

export default Icon;
