/** View model del detalle de un producto (incluye sus propiedades custom). */
export type ProductDetailVM = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  available: boolean;
  attributes: { name: string; value: string }[];
};
