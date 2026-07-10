import { useId, useState } from "react";
import type { SidebarConfig } from "@shared/types";
import "./sidebar.css";

export type SidebarProps = {
  config: SidebarConfig;
  onToggle?: (collapsed: boolean) => void;
};

export function Sidebar({ config, onToggle }: SidebarProps) {
  const inputId = useId();
  const [collapsed, setCollapsed] = useState(config.collapsedByDefault ?? false);
  const [draft, setDraft] = useState("");

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onToggle?.(next);
  };

  if (collapsed) {
    return (
      <aside className="mfe-sidebar mfe-sidebar--collapsed" aria-label={config.title}>
        <button
          type="button"
          className="mfe-sidebar__toggle"
          onClick={toggle}
          aria-expanded={false}
          aria-controls="mfe-sidebar-panel"
        >
          <span aria-hidden>✦</span>
          <span className="mfe-sidebar__toggle-text">Open {config.title}</span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      id="mfe-sidebar-panel"
      className="mfe-sidebar"
      aria-label={config.title}
    >
      <header className="mfe-sidebar__header">
        <h2 className="mfe-sidebar__title">{config.title}</h2>
        <button
          type="button"
          className="mfe-sidebar__collapse"
          onClick={toggle}
          aria-expanded
          aria-controls="mfe-sidebar-panel"
        >
          Collapse
        </button>
      </header>
      <div className="mfe-sidebar__body">
        <p className="mfe-sidebar__placeholder">
          Future slot for AI chatbot (streaming, context, tools).
        </p>
        <ul className="mfe-sidebar__suggestions" aria-label="Suggested prompts">
          <li>Explain Module Federation</li>
          <li>Summarize this page</li>
          <li>Translate lyrics to Spanish</li>
        </ul>
        <label className="mfe-sidebar__label" htmlFor={inputId}>
          Message
        </label>
        <textarea
          id={inputId}
          className="mfe-sidebar__input"
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={config.placeholder}
          disabled
          aria-describedby="mfe-sidebar-hint"
        />
        <p id="mfe-sidebar-hint" className="mfe-sidebar__hint">
          Input disabled — wire to Adolfo AI assistant in a later iteration.
        </p>
        <button type="button" className="mfe-sidebar__send" disabled>
          Send (coming soon)
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
