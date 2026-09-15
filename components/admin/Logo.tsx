import Image from "next/image";

import logoBlack from "@/assets/images/JOMI short black.png";
import logoWhite from "@/assets/images/JOMI long white.png";

/**
 * The mark on the login and create-first-user screens.
 *
 * Both variants are rendered and CSS picks one, because the panel's theme is
 * only known in the browser: the dark mark on a dark card was invisible before.
 * The visibility rules live in custom.scss under .admin-logo.
 */
export function Logo() {
  return (
    <div className="admin-logo">
      <Image
        src={logoBlack}
        alt="Jide Ojo Ministry International"
        height={56}
        className="admin-logo__mark admin-logo__mark--light"
        style={{ height: 56, width: "auto" }}
        priority
      />
      <Image
        src={logoWhite}
        alt=""
        aria-hidden="true"
        height={56}
        className="admin-logo__mark admin-logo__mark--dark"
        style={{ height: 56, width: "auto" }}
        priority
      />
      <span className="admin-logo__label">Content dashboard</span>
    </div>
  );
}

export default Logo;
