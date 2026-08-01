import { FpCatalogTemplate } from "@/components/templates/fp-catalog-template";
import {
  countFpCertificates,
  searchFpCertificates,
} from "@/services/fp/fp.service";

type FpPageProps = {
  searchParams: Promise<{
    q?: string;
    level?: string;
    bachiller?: string;
  }>;
};

export default async function FpCoursesPage({ searchParams }: FpPageProps) {
  const params = await searchParams;
  const levelNum = params.level ? Number(params.level) : undefined;
  const level =
    levelNum === 1 || levelNum === 2 || levelNum === 3 ? levelNum : undefined;

  const requiresBachiller =
    params.bachiller === "yes"
      ? true
      : params.bachiller === "no"
        ? false
        : undefined;

  const query = {
    q: params.q,
    level,
    requiresBachiller,
  };

  const [items, total] = await Promise.all([
    searchFpCertificates(query),
    countFpCertificates({}),
  ]);

  return (
    <FpCatalogTemplate
      items={items}
      total={total}
      initialQuery={{
        q: params.q,
        level: level ? String(level) : undefined,
        bachiller: params.bachiller,
      }}
    />
  );
}
