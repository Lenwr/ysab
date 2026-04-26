import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  color: string | null;
  cover_image_url?: string | null;
  is_featured: boolean;
  is_available: boolean;
  created_at: string;
};

type ProductTableProps = {
  products: Product[];
};

export default function ProductTable({ products }: ProductTableProps) {
  async function deleteProduct(formData: FormData) {
    "use server";

    const id = formData.get("id");
    if (typeof id !== "string") return;

    const supabase = await createClient();

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Erreur suppression produit:", error.message);
      throw new Error("Impossible de supprimer le produit");
    }

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/catalogue");
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Aucun produit trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr className="border-b">
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">Catégorie</th>
              <th className="px-4 py-3 font-semibold">Couleur</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Vedette</th>
              <th className="px-4 py-3 font-semibold">Créé le</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
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
                  <div className="text-xs text-gray-500">{product.slug}</div>
                </td>

                <td className="px-4 py-4">{product.category}</td>
                <td className="px-4 py-4">{product.color ?? "-"}</td>
                <td className="px-4 py-4">
                  {product.is_available ? "Disponible" : "Indisponible"}
                </td>
                <td className="px-4 py-4">
                  {product.is_featured ? "Oui" : "Non"}
                </td>
                <td className="px-4 py-4">
                  {new Date(product.created_at).toLocaleDateString("fr-FR")}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-gray-50"
                    >
                      Modifier
                    </Link>

                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}