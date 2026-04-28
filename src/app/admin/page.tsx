import Link from "next/link";
import ProductTable from "@/components/admin/product-table";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, slug, category, color, cover_image_url, is_featured, is_available, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p>Erreur lors du chargement des produits.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="mt-2 text-sm text-gray-500">
            Tous les pagnes enregistrés dans le catalogue.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
        >
          Ajouter un produit
        </Link>
      </div>

      <ProductTable products={products ?? []} />
    </main>
  );
}