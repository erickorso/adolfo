import { useCallback, useId, useState } from "react";
import type { AuthUser } from "@shared/types";
import "./auth-panel.css";

export type AuthPanelProps = {
  onAuthChange?: (user: AuthUser | null) => void;
};

export function AuthPanel({ onAuthChange }: AuthPanelProps) {
  const formId = useId();
  const emailId = `${formId}-email`;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState("erick@adolfo.dev");
  const [password, setPassword] = useState("");

  const handleLogin = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const nextUser: AuthUser = {
        name: email.split("@")[0] ?? "Guest",
        email: email.trim() || "guest@adolfo.dev",
      };
      setUser(nextUser);
      onAuthChange?.(nextUser);
    },
    [email, onAuthChange],
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    setPassword("");
    onAuthChange?.(null);
  }, [onAuthChange]);

  if (user) {
    return (
      <section className="auth-panel" aria-labelledby="auth-panel-heading">
        <h2 id="auth-panel-heading" className="auth-panel__title">
          Session
        </h2>
        <p className="auth-panel__user">
          Signed in as <strong>{user.name}</strong> ({user.email})
        </p>
        <button
          type="button"
          className="auth-panel__button auth-panel__button--secondary"
          onClick={handleLogout}
        >
          Sign out
        </button>
      </section>
    );
  }

  return (
    <section className="auth-panel" aria-labelledby="auth-panel-heading">
      <h2 id="auth-panel-heading" className="auth-panel__title">
        Sign in
      </h2>
      <p className="auth-panel__hint">Micro-frontend: remote-auth · mock only</p>
      <form className="auth-panel__form" onSubmit={handleLogin}>
        <label className="auth-panel__label" htmlFor={emailId}>
          Email
        </label>
        <input
          id={emailId}
          className="auth-panel__input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          required
        />
        <label className="auth-panel__label" htmlFor={`${formId}-password`}>
          Password
        </label>
        <input
          id={`${formId}-password`}
          className="auth-panel__input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="any value"
        />
        <button type="submit" className="auth-panel__button auth-panel__button--primary">
          Sign in
        </button>
      </form>
    </section>
  );
}

export default AuthPanel;
