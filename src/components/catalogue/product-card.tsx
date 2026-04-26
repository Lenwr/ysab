"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Variant = {
  id: string;
  color_name: string;
  image_url: string;
  is_default: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  pattern: string | null;
  color: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  is_available: boolean;
  product_variants?: Variant[];
};

type ProductImage = {
  id: string;
  label: string;
  image_url: string;
  is_default?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const images = useMemo<ProductImage[]>(() => {
    const allImages: ProductImage[] = [];

    if (product.cover_image_url) {
      allImages.push({
        id: "cover",
        label: product.color ?? "Image principale",
        image_url: product.cover_image_url,
        is_default: true,
      });
    }

    for (const variant of product.product_variants ?? []) {
      if (!variant.image_url) continue;

      allImages.push({
        id: variant.id,
        label: variant.color_name,
        image_url: variant.image_url,
        is_default: variant.is_default,
      });
    }

    return allImages;
  }, [product.cover_image_url, product.color, product.product_variants]);

  const defaultImage =
    images.find((image) => image.is_default) ?? images[0];

  const [selectedImage, setSelectedImage] = useState<ProductImage | undefined>(
    defaultImage
  );

  const currentImage = selectedImage ?? defaultImage;

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          {currentImage?.image_url ? (
            <Image
              src={currentImage.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Pas d’image
            </div>
          )}
        </Link>

        {product.is_featured && (
          <span className="absolute left-4 top-4 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-800 shadow-sm">
            Nouveauté
          </span>
        )}

        {!product.is_available && (
          <span className="absolute right-4 top-4 bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
            Indisponible
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image) => {
            const isSelected = currentImage?.id === image.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSelectedImage(image);
                }}
                title={image.label}
                className={`relative h-11 w-11 shrink-0 overflow-hidden  bg-zinc-100 transition ${
                  isSelected
                    ? "border-black ring-1 ring-black"
                    : "border-zinc-200 hover:border-zinc-500"
                }`}
              >
                <Image
                  src={image.image_url}
                  alt={image.label}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-3">
        <Link
          href={`/product/${product.slug}`}
          className="font-medium text-zinc-900 hover:underline"
        >
          {product.category}
        </Link>

        <p className="mt-1 text-sm text-zinc-500">{product.name}</p>

        {currentImage?.label && (
          <p className="mt-1 text-sm text-zinc-400">{currentImage.label}</p>
        )}

        {product.pattern && (
          <p className="mt-1 text-sm text-zinc-400">
            Motif : {product.pattern}
          </p>
        )}
      </div>
    </article>
  );
}