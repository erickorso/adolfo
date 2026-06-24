import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { trackJobPostingAction } from "@/app/[locale]/account/applications/actions";

type TrackJobPostingFormProps = {
  jobPostingId: string;
  source: string;
};

/** Formulario para agregar una vacante ingestada al pipeline del usuario. */
export async function TrackJobPostingForm({
  jobPostingId,
  source,
}: TrackJobPostingFormProps) {
  const t = await getTranslations("applications");

  return (
    <form action={trackJobPostingAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="jobPostingId" value={jobPostingId} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="status" value="SAVED" />
      <Button type="submit" variant="secondary" size="sm">
        {t("trackJob")}
      </Button>
    </form>
  );
}
