/**
 * Sits above the login form, between the mark and the fields.
 *
 * Payload's login is otherwise an unlabelled pair of inputs; a line of welcome
 * makes it read as this ministry's dashboard rather than a generic tool.
 */
export function LoginIntro() {
  return (
    <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
      <h1
        style={{
          color: "var(--jomi-navy-900)",
          fontFamily: "var(--font-serif)",
          fontSize: "1.5rem",
          fontWeight: 600,
          letterSpacing: "-0.015em",
          margin: 0,
        }}
      >
        Welcome back
      </h1>
      <p
        style={{
          color: "var(--theme-elevation-500)",
          fontSize: "0.9rem",
          lineHeight: 1.5,
          margin: "0.5rem auto 0",
          maxWidth: "22rem",
        }}
      >
        Sign in to manage events, messages, testimonies and everything else on
        the JOMI website.
      </p>
    </div>
  );
}

export default LoginIntro;
