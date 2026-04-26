import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export default async function ProductVariantsPage({ params }: PageProps) {
  const { id: productId } = await params;
  const supabase = await createClient();

  // 🔹 récupérer produit + variantes
  const { data: product } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      product_variants (
        id,
        color_name,
        image_url,
        is_default
      )
    `)
    .eq("id", productId)
    .single();

  if (!product) {
    return <div>Produit introuvable</div>;
  }

  // 🔹 upload image
  async function uploadImage(file: File, path: string) {
    "use server";

    const supabase = await createClient();

    const { error } = await supabase.storage
      .from("products")
      .upload(path, file);

    if (error) {
      console.error(error.message);
      throw new Error("Erreur upload image");
    }

    const { data } = supabase.storage.from("products").getPublicUrl(path);

    return data.publicUrl;
  }

  // 🔹 ajouter variante
  async function addVariant(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const color = getString(formData, "color");
    const file = formData.get("image") as File;

    if (!color || !file || file.size === 0) {
      throw new Error("Champs invalides");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `variants/${productId}-${Date.now()}.${fileExt}`;

    const imageUrl = await uploadImage(file, fileName);

    const { error } = await supabase.from("product_variants").insert({
      product_id: productId,
      color_name: color,
      image_url: imageUrl,
      is_default: false,
    });

    if (error) {
      console.error(error.message);
      throw new Error("Erreur création variante");
    }

    revalidatePath(`/admin/products/${productId}/variants`);
    revalidatePath("/catalogue");

    // ✅ FIX TS
    if (product?.slug) {
      revalidatePath(`/product/${product.slug}`);
    }

    redirect(`/admin/products/${productId}/variants`);
  }

  // 🔹 supprimer variante
  async function deleteVariant(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const id = formData.get("id");

    if (typeof id !== "string") return;

    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error.message);
      throw new Error("Erreur suppression variante");
    }

    revalidatePath(`/admin/products/${productId}/variants`);
    revalidatePath("/catalogue");

    if (product?.slug) {
      revalidatePath(`/product/${product.slug}`);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Variantes de : {product.name}
      </h1>

      {/* FORMULAIRE AJOUT */}
      <form action={addVariant} className="space-y-4 mb-10">
        <input
          name="color"
          placeholder="Couleur"
          className="w-full rounded border px-4 py-3"
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          required
        />

        <button className="rounded-xl bg-black px-5 py-3 text-white font-semibold">
          Ajouter variante
        </button>
      </form>

      {/* LISTE VARIANTES */}
      <div className="space-y-4">
        {product.product_variants?.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={variant.image_url}
                className="h-16 w-16 rounded-lg object-cover"
                alt={variant.color_name}
              />

              <span className="font-medium">{variant.color_name}</span>
            </div>

            <form action={deleteVariant}>
              <input type="hidden" name="id" value={variant.id} />
              <button className="rounded-lg bg-red-600 px-4 py-2 text-white">
                Supprimer
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}