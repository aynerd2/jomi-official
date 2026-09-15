/**
 * Sits above the login form, between the mark and the fields.
 *
 * Colours come from the theme tokens, not brand literals: a navy heading was
 * invisible on the dark card when the panel followed a dark colour scheme.
 */
export function LoginIntro() {
  return (
    <div className="login-intro">
      <h1 className="login-intro__title">Welcome back</h1>
      <p className="login-intro__body">
        Sign in to manage events, messages, testimonies and everything else on
        the JOMI website.
      </p>
    </div>
  );
}

export default LoginIntro;
