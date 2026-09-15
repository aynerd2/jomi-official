import Link from "next/link";

/**
 * Sits under the collection list in the sidebar.
 *
 * Payload does provide sign-out, but only as an unlabelled icon at the top of
 * the nav, which is easy to miss. These are the same destinations with words on
 * them: the account page, adding a colleague, and signing out.
 */
export function AccountLinks() {
  const linkStyle: React.CSSProperties = {
    borderRadius: "var(--style-radius-m)",
    color: "var(--theme-elevation-700)",
    display: "block",
    fontSize: "0.8125rem",
    padding: "0.5rem 0.75rem",
    textDecoration: "none",
    transition: "background-color 140ms ease, color 140ms ease",
  };

  return (
    <div
      style={{
        borderTop: "1px solid var(--theme-elevation-150)",
        display: "flex",
        flexDirection: "column",
        gap: "0.125rem",
        marginTop: "1.25rem",
        paddingTop: "1rem",
      }}
    >
      <span
        style={{
          color: "var(--theme-elevation-500)",
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          padding: "0 0.75rem 0.5rem",
          textTransform: "uppercase",
        }}
      >
        Your account
      </span>

      <Link href="/admin/account" style={linkStyle}>
        Profile and password
      </Link>
      <Link href="/admin/collections/users/create" style={linkStyle}>
        Add an admin user
      </Link>
      <Link href="/admin/logout" style={{ ...linkStyle, fontWeight: 600 }}>
        Sign out
      </Link>
    </div>
  );
}

export default AccountLinks;
