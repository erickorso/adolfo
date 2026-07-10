import type { NavbarConfig } from "./types";

export const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
  brand: "Adolfo",
  tagline: "Module Federation shell",
  items: [
    { id: "home", label: "Home", href: "#home", icon: "⌂" },
    { id: "courses", label: "Courses", href: "#courses", icon: "◈" },
    { id: "learn", label: "Learn", href: "#learn", icon: "✦" },
    { id: "jobs", label: "Jobs", href: "#jobs", icon: "◎" },
    { id: "mfe", label: "MFE Demo", href: "#mfe", icon: "⬡" },
  ],
};
