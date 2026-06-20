import { Fragment } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Price } from "@/components/atoms/price";
import { AddToCartButton } from "@/components/molecules/add-to-cart-button";
import { getProductDetail } from "@/services/catalog/catalog.service";

/** Detalle público de un producto: imagen, precio, descripción y propiedades. */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Volver al catálogo
        </Link>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <Price
          cents={product.priceCents}
          currency={product.currency}
          className="text-2xl"
        />
        {product.description ? (
          <p className="text-muted-foreground">{product.description}</p>
        ) : null}

        {product.attributes.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Especificaciones</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
              {product.attributes.map((a) => (
                <Fragment key={`${a.name}:${a.value}`}>
                  <dt className="text-muted-foreground">{a.name}</dt>
                  <dd>{a.value}</dd>
                </Fragment>
              ))}
            </dl>
          </section>
        ) : null}

        <div className="mt-2">
          <AddToCartButton
            item={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              currency: product.currency,
              imageUrl: product.imageUrl,
            }}
            disabled={!product.available}
          />
        </div>
      </div>
    </main>
  );
}
