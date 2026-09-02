import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

type LearnModuleShellProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  wide?: boolean;
  children: ReactNode;
};

export function LearnModuleShell({
  title,
  subtitle,
  badge = "AI Agents Path",
  wide = false,
  children,
}: LearnModuleShellProps) {
  return (
    <div
      className={`learn-path mx-auto flex flex-col gap-8 px-4 py-10 ${wide ? "max-w-7xl" : "max-w-3xl"}`}
    >
      <header className="learn-path__hero flex flex-col gap-3">
        <span className="learn-path__hero-badge">
          <Sparkles className="size-3.5" aria-hidden />
          {badge}
        </span>
        <h1 className="learn-path__card-title text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="learn-path__card-muted max-w-2xl text-base">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </div>
  );
}
