export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon?: string;
};

export type NavbarConfig = {
  brand: string;
  tagline?: string;
  items: NavItem[];
};

export type AuthUser = {
  name: string;
  email: string;
};

export type AuthState = {
  user: AuthUser | null;
};

export type SidebarConfig = {
  title: string;
  placeholder: string;
  collapsedByDefault?: boolean;
};

export type ShellRemoteProps = {
  onNavigate?: (href: string) => void;
};
