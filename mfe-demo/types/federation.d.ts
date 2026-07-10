declare module "auth/AuthPanel" {
  import type { ComponentType } from "react";
  import type { AuthUser } from "@shared/types";

  export type AuthPanelProps = {
    onAuthChange?: (user: AuthUser | null) => void;
  };

  const AuthPanel: ComponentType<AuthPanelProps>;
  export default AuthPanel;
}

declare module "navbar/Navbar" {
  import type { ComponentType } from "react";
  import type { NavbarConfig } from "@shared/types";

  export type NavbarProps = {
    config: NavbarConfig;
    activeHref?: string;
    onNavigate?: (href: string) => void;
  };

  const Navbar: ComponentType<NavbarProps>;
  export default Navbar;
}

declare module "sidebar/Sidebar" {
  import type { ComponentType } from "react";
  import type { SidebarConfig } from "@shared/types";

  export type SidebarProps = {
    config: SidebarConfig;
    onToggle?: (collapsed: boolean) => void;
  };

  const Sidebar: ComponentType<SidebarProps>;
  export default Sidebar;
}
