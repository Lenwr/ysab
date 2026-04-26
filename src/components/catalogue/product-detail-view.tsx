"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Variant = {
  id: string;
  color_name: string;
  image_url: string;
  is_default: boolean;
};

type ProductDetailViewProps = {
  product: {
    id: string;
    name: string;
    reference: string | null;
    category: string;
    pattern: string | null;
    description: string | null;
    cover_image_url: string | null;
    color?: string | null;
    main_color?: string | null;
    is_available: boolean;
    is_featured: boolean;
    product_variants?: Variant[];
  };
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const images = useMemo(() => {
    const imgs = [];

    // IMAGE PRINCIPALE
    if (product.cover_image_url) {
      imgs.push({
        id: "cover",
        label: product.main_color ?? product.color ?? "Principale",
        image_url: product.cover_image_url,
        is_default: true,
      });
    }

    // VARIANTES
    for (const v of product.product_variants ?? []) {
      imgs.push({
        id: v.id,
        label: v.color_name,
        image_url: v.image_url,
        is_default: v.is_default,
      });
    }

    return imgs;
  }, [product]);

  const defaultImage =
    images.find((img) => img.is_default) ?? images[0];

  const [selected, setSelected] = useState(defaultImage);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      
      {/* IMAGE + VARIANTES */}
      <div>
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100">
          {selected?.image_url ? (
            <Image
              src={selected.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              Pas d’image
            </div>
          )}
        </div>

        {/* MINIATURES */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelected(img)}
                className={`relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border ${
                  selected?.id === img.id
                    ? "border-black"
                    : "border-zinc-200"
                }`}
              >
                <Image
                  src={img.image_url}
                  alt={img.label}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* INFOS */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="mt-2 text-sm text-zinc-500">
          {product.category}
        </p>

        {selected?.label && (
          <p className="mt-4 text-sm">
            <span className="font-semibold">Couleur :</span>{" "}
            {selected.label}
          </p>
        )}

        {product.pattern && (
          <p className="mt-2 text-sm">
            <span className="font-semibold">Motif :</span>{" "}
            {product.pattern}
          </p>
        )}

        {product.description && (
          <p className="mt-6 text-zinc-600">
            {product.description}
          </p>
        )}

        <a
          href={`https://wa.me/22890045934?text=${encodeURIComponent(
            `Bonjour, je suis intéressé par ce pagne : ${product.name}`
          )}`}
          target="_blank"
          className="mt-8 inline-block w-full bg-green-600 text-white py-3 rounded-xl text-center font-semibold"
        >
          Contacter sur WhatsApp
        </a>
      </div>
    </div>
  );
}