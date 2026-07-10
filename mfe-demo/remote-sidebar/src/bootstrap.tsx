import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Sidebar } from "./Sidebar";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <div className="mfe-remote-preview mfe-remote-preview--sidebar">
        <p className="mfe-remote-preview__label">Sidebar remote (standalone preview)</p>
        <Sidebar
          config={{
            title: "AI Assistant",
            placeholder: "Ask Adolfo anything…",
            collapsedByDefault: false,
          }}
        />
      </div>
    </StrictMode>,
  );
}
