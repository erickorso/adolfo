import "server-only";
import {
  IMAGEN_SEMANA_SLUG,
  imagenSemanaVariantForDate,
  type ImagenSemanaVariant,
} from "@/domain/catalog/imagen-semana";
import { prisma } from "@/lib/prisma";

export type ImagenSemanaRotateResult = {
  slug: string;
  weekVariant: ImagenSemanaVariant;
  updated: boolean;
  previousImageUrl: string | null;
};

/** Actualiza el producto `imagen-semana` con la variante de la semana ISO. */
export async function rotateImagenSemana(
  date: Date = new Date(),
): Promise<ImagenSemanaRotateResult> {
  const weekVariant = imagenSemanaVariantForDate(date);
  const existing = await prisma.product.findUnique({
    where: { slug: IMAGEN_SEMANA_SLUG },
    select: { imageUrl: true, nameEn: true },
  });

  if (!existing) {
    await prisma.product.create({
      data: {
        slug: IMAGEN_SEMANA_SLUG,
        name: weekVariant.name,
        description: weekVariant.description,
        nameEn: weekVariant.nameEn,
        descriptionEn: weekVariant.descriptionEn,
        priceCents: 500,
        currency: "ARS",
        stock: 999,
        imageUrl: weekVariant.imageUrl,
        active: true,
      },
    });
    return {
      slug: IMAGEN_SEMANA_SLUG,
      weekVariant,
      updated: true,
      previousImageUrl: null,
    };
  }

  const unchanged = existing.imageUrl === weekVariant.imageUrl;
  if (!unchanged) {
    await prisma.product.update({
      where: { slug: IMAGEN_SEMANA_SLUG },
      data: {
        name: weekVariant.name,
        description: weekVariant.description,
        nameEn: weekVariant.nameEn,
        descriptionEn: weekVariant.descriptionEn,
        imageUrl: weekVariant.imageUrl,
        priceCents: 500,
        stock: 999,
        active: true,
      },
    });
  } else if (!existing.nameEn) {
    await prisma.product.update({
      where: { slug: IMAGEN_SEMANA_SLUG },
      data: {
        nameEn: weekVariant.nameEn,
        descriptionEn: weekVariant.descriptionEn,
      },
    });
  }

  return {
    slug: IMAGEN_SEMANA_SLUG,
    weekVariant,
    updated: !unchanged,
    previousImageUrl: existing.imageUrl,
  };
}
