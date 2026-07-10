import type { NavbarConfig } from "@shared/types";
import "./navbar.css";

export type NavbarProps = {
  config: NavbarConfig;
  activeHref?: string;
  onNavigate?: (href: string) => void;
};

export function Navbar({ config, activeHref = "#home", onNavigate }: NavbarProps) {
  return (
    <header className="mfe-navbar" role="banner">
      <div className="mfe-navbar__brand">
        <span className="mfe-navbar__logo" aria-hidden>
          ◆
        </span>
        <div className="mfe-navbar__titles">
          <span className="mfe-navbar__name">{config.brand}</span>
          {config.tagline ? (
            <span className="mfe-navbar__tagline">{config.tagline}</span>
          ) : null}
        </div>
      </div>
      <nav className="mfe-navbar__nav" aria-label="Main">
        <ul className="mfe-navbar__list">
          {config.items.map((item) => {
            const isActive = item.href === activeHref;
            return (
              <li key={item.id} className="mfe-navbar__item">
                <button
                  type="button"
                  className={`mfe-navbar__link${isActive ? " mfe-navbar__link--active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onNavigate?.(item.href)}
                >
                  {item.icon ? (
                    <span className="mfe-navbar__icon" aria-hidden>
                      {item.icon}
                    </span>
                  ) : null}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
