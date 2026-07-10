import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DEFAULT_NAVBAR_CONFIG } from "@shared/nav-config";
import { Navbar } from "./Navbar";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <div className="mfe-remote-preview">
        <p className="mfe-remote-preview__label">Navbar remote (standalone preview)</p>
        <Navbar config={DEFAULT_NAVBAR_CONFIG} activeHref="#courses" />
      </div>
    </StrictMode>,
  );
}
