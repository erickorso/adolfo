import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Award } from "lucide-react";
import type { CertificateStatusWithAuth } from "@/services/learning/lesson-progress.service";

type AiAgentsCertificateBannerProps = {
  status: CertificateStatusWithAuth;
};

export async function AiAgentsCertificateBanner({
  status,
}: AiAgentsCertificateBannerProps) {
  if (!status.isLoggedIn) {
    return null;
  }

  const t = await getTranslations("aiAgents");

  if (status.earnedAt) {
    return (
      <section className="rounded-lg border border-primary/30 bg-primary/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="size-8 text-primary" aria-hidden />
            <div>
              <h2 className="text-lg font-semibold">{t("certificateEarnedTitle")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("certificateEarnedHint")}
              </p>
            </div>
          </div>
          <Link
            href="/learn/ai-agents/certificate"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("certificateView")}
          </Link>
        </div>
      </section>
    );
  }

  if (status.eligible) {
    return (
      <section className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{t("certificateReadyTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("certificateReadyHint")}</p>
          </div>
          <Link
            href="/learn/ai-agents/certificate"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
          >
            {t("certificateClaim")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">
        {t("certificateProgress", {
          quizzes: status.quizzesPassed,
          total: status.quizzesRequired,
        })}
      </p>
    </section>
  );
}
