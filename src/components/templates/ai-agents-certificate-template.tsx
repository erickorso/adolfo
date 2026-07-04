import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CertificateClaimButton } from "@/components/molecules/certificate-claim-button";
import { AI_AGENTS_MODULE_ID } from "@/domain/learning/ai-agents/module.constants";
import {
  claimCertificate,
  getCertificateStatus,
} from "@/services/learning/lesson-progress.service";
import { getCurrentUser } from "@/services/users/user.service";

export async function AiAgentsCertificateTemplate() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/learn/ai-agents/certificate");
  }

  const [t, locale, initialStatus] = await Promise.all([
    getTranslations("aiAgents"),
    getLocale(),
    getCertificateStatus(user.id, AI_AGENTS_MODULE_ID),
  ]);

  let status = initialStatus;

  if (status.eligible && !status.earnedAt) {
    const earnedAt = await claimCertificate(user.id, AI_AGENTS_MODULE_ID);
    status = { ...status, earnedAt };
  }

  if (!status.eligible) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{t("certificateTitle")}</h1>
        <p className="text-muted-foreground">{t("certificateNotEligible")}</p>
        <p className="text-sm text-muted-foreground">
          {t("certificateProgress", {
            quizzes: status.quizzesPassed,
            total: status.quizzesRequired,
          })}
        </p>
        <Link href="/learn/ai-agents" className="text-sm font-medium underline">
          {t("backToModule")}
        </Link>
      </div>
    );
  }

  const displayName = status.userName ?? user.email;
  const earnedDate = status.earnedAt ?? new Date();
  const dateLabel = earnedDate.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="certificate-page flex flex-col gap-6">
      <Link href="/learn/ai-agents" className="text-sm text-muted-foreground underline print:hidden">
        {t("backToModule")}
      </Link>

      <article
        className="certificate-page__card flex flex-col gap-6 rounded-xl border-2 border-primary/20 bg-card p-8 shadow-sm"
        aria-labelledby="certificate-heading"
      >
        <header className="certificate-page__header flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t("certificateBadge")}
          </p>
          <h1 id="certificate-heading" className="text-2xl font-bold md:text-3xl">
            {t("certificateHeading")}
          </h1>
          <p className="text-muted-foreground">{t("certificateSubtitle")}</p>
        </header>

        <div className="certificate-page__body flex flex-col items-center gap-2 border-y border-border py-8 text-center">
          <p className="text-sm text-muted-foreground">{t("certificateAwardedTo")}</p>
          <p className="text-xl font-semibold">{displayName}</p>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">
            {t("certificateBody")}
          </p>
          <p className="mt-2 text-sm font-medium">{dateLabel}</p>
        </div>

        <footer className="certificate-page__footer flex flex-col items-center gap-1 text-center text-xs text-muted-foreground">
          <p>{t("certificateProvider")}</p>
          <p>{t("certificateAttribution")}</p>
        </footer>
      </article>

      <div className="flex flex-wrap gap-3 print:hidden">
        <CertificateClaimButton alreadyEarned={Boolean(status.earnedAt)} />
      </div>
    </div>
  );
}
