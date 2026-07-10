import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthPanel } from "./AuthPanel";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <div className="mfe-remote-preview">
        <p className="mfe-remote-preview__label">Auth remote (standalone preview)</p>
        <AuthPanel
          onAuthChange={(user) => {
            console.log("[auth remote]", user);
          }}
        />
      </div>
    </StrictMode>,
  );
}
