import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { DEFAULT_NAVBAR_CONFIG } from "@shared/nav-config";
import type { AuthUser, NavbarConfig } from "@shared/types";
import "./shell.css";

const NavbarRemote = lazy(() => import("navbar/Navbar"));
const AuthRemote = lazy(() => import("auth/AuthPanel"));
const SidebarRemote = lazy(() => import("sidebar/Sidebar"));

const SIDEBAR_CONFIG = {
  title: "AI Assistant",
  placeholder: "Ask Adolfo anything…",
  collapsedByDefault: false,
} as const;

const PAGE_COPY: Record<string, { title: string; body: string }> = {
  "#home": {
    title: "Shell template",
    body: "Host orchestrates three remotes at runtime via Webpack Module Federation.",
  },
  "#courses": {
    title: "Courses",
    body: "Placeholder route — in Adolfo this maps to /courses with integrated modules.",
  },
  "#learn": {
    title: "Learn",
    body: "Placeholder for /learn (songs-english, ai-agents, etc.).",
  },
  "#jobs": {
    title: "Jobs",
    body: "Placeholder for the jobs board and ingest pipeline.",
  },
  "#mfe": {
    title: "Module Federation",
    body: "Each remote runs on its own dev server (3101–3103) and exposes a federated entry.",
  },
};

function RemoteFallback({ label }: { label: string }) {
  return (
    <div className="mfe-shell__fallback" role="status">
      Loading {label}…
    </div>
  );
}

export function App() {
  const [activeHref, setActiveHref] = useState("#home");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [navPreset, setNavPreset] = useState<"default" | "minimal">("default");

  const navbarConfig: NavbarConfig = useMemo(() => {
    if (navPreset === "minimal") {
      return {
        brand: "Adolfo",
        tagline: "Minimal nav preset",
        items: [
          { id: "home", label: "Home", href: "#home", icon: "⌂" },
          { id: "mfe", label: "MFE", href: "#mfe", icon: "⬡" },
        ],
      };
    }
    return DEFAULT_NAVBAR_CONFIG;
  }, [navPreset]);

  const handleNavigate = useCallback((href: string) => {
    setActiveHref(href);
    if (href.startsWith("#")) {
      window.history.replaceState(null, "", href);
    }
  }, []);

  const page = PAGE_COPY[activeHref] ?? PAGE_COPY["#home"];

  return (
    <div className="mfe-shell">
      <Suspense fallback={<RemoteFallback label="navbar" />}>
        <NavbarRemote
          config={navbarConfig}
          activeHref={activeHref}
          onNavigate={handleNavigate}
        />
      </Suspense>

      <div className="mfe-shell__toolbar">
        <fieldset className="mfe-shell__fieldset">
          <legend className="mfe-shell__legend">Navbar preset (host config)</legend>
          <label className="mfe-shell__radio">
            <input
              type="radio"
              name="nav-preset"
              checked={navPreset === "default"}
              onChange={() => setNavPreset("default")}
            />
            Full menu
          </label>
          <label className="mfe-shell__radio">
            <input
              type="radio"
              name="nav-preset"
              checked={navPreset === "minimal"}
              onChange={() => setNavPreset("minimal")}
            />
            Minimal
          </label>
        </fieldset>
        {user ? (
          <p className="mfe-shell__session" role="status">
            Host session: <strong>{user.name}</strong>
          </p>
        ) : null}
      </div>

      <div className="mfe-shell__layout">
        <Suspense fallback={<RemoteFallback label="sidebar" />}>
          <SidebarRemote config={SIDEBAR_CONFIG} />
        </Suspense>

        <main className="mfe-shell__main" id="main-content">
          <div className="mfe-shell__grid">
            <Suspense fallback={<RemoteFallback label="auth" />}>
              <AuthRemote onAuthChange={setUser} />
            </Suspense>

            <article className="mfe-shell__content" aria-labelledby="page-title">
              <h1 id="page-title" className="mfe-shell__page-title">
                {page.title}
              </h1>
              <p className="mfe-shell__page-body">{page.body}</p>
              <dl className="mfe-shell__meta">
                <div>
                  <dt>Active route</dt>
                  <dd>{activeHref}</dd>
                </div>
                <div>
                  <dt>Remotes</dt>
                  <dd>auth · navbar · sidebar</dd>
                </div>
                <div>
                  <dt>Ports</dt>
                  <dd>host 3100 · remotes 3101–3103</dd>
                </div>
              </dl>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
