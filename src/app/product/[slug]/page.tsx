import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailView from "../../../components/catalogue/product-detail-view";
import { createClient } from "@/src/lib/supabase/server";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      reference,
      category,
      pattern,
      description,
      cover_image_url,
      color,
      main_color,
      is_available,
      is_featured,
      product_variants (
        id,
        color_name,
        image_url,
        is_default
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Link
        href="/catalogue"
        className="mb-8 inline-flex text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        ← Retour au catalogue
      </Link>

      <ProductDetailView product={product} />
    </main>
  );
}