/** Rutas públicas de imágenes demo del catálogo (en `public/catalog/`). */
/** Fuente visual: https://sketches.lorant.one/ (template Aveiro, uso demo local). */
export const CATALOG_PLACEHOLDER_IMAGES: Record<string, string> = {
  "producto-prueba-uala": "/catalog/producto-prueba-uala.jpg",
  "remera-basica": "/catalog/remera-basica.jpg",
  "buzo-canguro": "/catalog/buzo-canguro.jpg",
  "gorra-trucker": "/catalog/gorra-trucker.jpg",
  "consultoria-1h": "/catalog/consultoria-1h.jpg",
  "setup-tienda": "/catalog/setup-tienda.jpg",
};

export const CATALOG_PLACEHOLDER_IMAGE_LIST = Object.values(
  CATALOG_PLACEHOLDER_IMAGES,
);

export function catalogPlaceholderImage(slug: string): string | undefined {
  return CATALOG_PLACEHOLDER_IMAGES[slug];
}
