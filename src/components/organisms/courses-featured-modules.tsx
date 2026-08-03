"use client";

import {
  Music,
  Bot,
  Gauge,
  Boxes,
  Languages,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GravityPlayground } from "@/components/atoms/gravity-playground";
import { MotionFallIn } from "@/components/atoms/motion-fall-in";
import { cn } from "@/lib/utils";

type ModuleItem = {
  href: string;
  title: string;
  hint: string;
  body?: string;
  icon: "languages" | "boxes" | "gauge" | "bot" | "graduation" | "music";
  iconClass: string;
};

type CoursesFeaturedModulesProps = {
  sectionTitle: string;
  sectionBody: string;
  gravityTitle: string;
  gravityHint: string;
  gravityAria: string;
  modules: ModuleItem[];
  gravityChips: { id: string; label: string }[];
};

const ICONS: Record<ModuleItem["icon"], LucideIcon> = {
  languages: Languages,
  boxes: Boxes,
  gauge: Gauge,
  bot: Bot,
  graduation: GraduationCap,
  music: Music,
};

export function CoursesFeaturedModules({
  sectionTitle,
  sectionBody,
  gravityTitle,
  gravityHint,
  gravityAria,
  modules,
  gravityChips,
}: CoursesFeaturedModulesProps) {
  return (
    <div className="flex flex-col gap-8">
      <section
        aria-labelledby="featured-internal-heading"
        className="rounded-xl border border-border bg-muted/25 p-6"
      >
        <h2
          id="featured-internal-heading"
          className="text-lg font-semibold tracking-tight"
        >
          {sectionTitle}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{sectionBody}</p>
        <ul className="mt-5 flex flex-col gap-3">
          {modules.map((mod, index) => {
            const Icon = ICONS[mod.icon];
            return (
              <li key={mod.href}>
                <MotionFallIn index={index} interactive className="w-full">
                  <Link
                    href={mod.href}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border border-border bg-card p-4",
                      "shadow-sm transition-colors hover:border-foreground/15 hover:bg-muted/50",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-md",
                        mod.iconClass,
                      )}
                      aria-hidden
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-medium">{mod.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {mod.hint}
                      </span>
                      {mod.body ? (
                        <span className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                          {mod.body}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </MotionFallIn>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="courses-gravity-heading" className="flex flex-col gap-2">
        <h2
          id="courses-gravity-heading"
          className="text-lg font-semibold tracking-tight"
        >
          {gravityTitle}
        </h2>
        <p className="text-sm text-muted-foreground">{gravityHint}</p>
        <GravityPlayground
          chips={gravityChips}
          ariaLabel={gravityAria}
          className="mt-2"
        />
      </section>
    </div>
  );
}
