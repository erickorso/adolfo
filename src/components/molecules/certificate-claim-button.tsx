"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { claimCertificateAction } from "@/app/[locale]/learn/actions";

type CertificateClaimButtonProps = {
  alreadyEarned: boolean;
};

export function CertificateClaimButton({ alreadyEarned }: CertificateClaimButtonProps) {
  const t = useTranslations("aiAgents");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (alreadyEarned) {
    return (
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        {t("certificatePrint")}
      </button>
    );
  }

  function handleClaim() {
    startTransition(async () => {
      const result = await claimCertificateAction();
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClaim}
      disabled={pending}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
    >
      {pending ? t("certificateClaiming") : t("certificateClaim")}
    </button>
  );
}
