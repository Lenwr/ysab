import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/src/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      category,
      color,
      main_color,
      cover_image_url,
      is_available,
      is_featured,
      created_at
    `)
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Liste de tous les produits du catalogue.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
        >
          Ajouter un produit
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Aucun produit trouvé.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-semibold">Image</th>
                  <th className="px-4 py-3 text-left font-semibold">Nom</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Couleur principale
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Disponible
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Vedette
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Créé le
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="px-4 py-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-zinc-100">
                        {product.cover_image_url ? (
                          <Image
                            src={product.cover_image_url}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                            N/A
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-zinc-500">
                        {product.slug}
                      </div>
                    </td>

                    <td className="px-4 py-4">{product.category}</td>

                    <td className="px-4 py-4">
                      {product.main_color ?? product.color ?? "-"}
                    </td>

                    <td className="px-4 py-4">
                      {product.is_available ? "Oui" : "Non"}
                    </td>

                    <td className="px-4 py-4">
                      {product.is_featured ? "Oui" : "Non"}
                    </td>

                    <td className="px-4 py-4">
                      {new Date(product.created_at).toLocaleDateString("fr-FR")}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-zinc-50"
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}