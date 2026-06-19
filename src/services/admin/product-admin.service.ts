import "server-only";
import { prisma } from "@/lib/prisma";
import type { ProductAttributeInput } from "@/domain/catalog/product-attributes";

/** Producto con sus atributos, para el form de edición del admin. */
export async function getProductForEdit(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { attributes: { orderBy: { name: "asc" } } },
  });
}

/**
 * Actualiza un producto y REEMPLAZA sus atributos (delete + create) en una
 * transacción, para que el set quede exactamente como lo dejó el admin.
 */
export async function updateProduct(
  id: string,
  data: {
    name: string;
    description: string | null;
    priceCents: number;
    stock: number;
    attributes: ProductAttributeInput[];
  },
): Promise<void> {
  await prisma.$transaction([
    prisma.productAttribute.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        priceCents: data.priceCents,
        stock: data.stock,
        attributes: {
          create: data.attributes.map((a) => ({ name: a.name, value: a.value })),
        },
      },
    }),
  ]);
}
