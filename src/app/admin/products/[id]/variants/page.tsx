import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function uploadImageToProductsBucket(file: File, path: string) {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("products")
    .upload(path, file, { upsert: false });

  if (error) {
    console.error("Erreur upload:", error.message);
    throw new Error("Erreur upload image");
  }

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return data.publicUrl;
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductVariantsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      category,
      cover_image_url,
      color,
      main_color,
      product_variants (
        id,
        color_name,
        image_url,
        is_default,
        created_at
      )
    `)
    .eq("id", id)
    .single();

  if (error || !product) notFound();

  async function addVariant(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const productId = getString(formData, "product_id");
    const colors = getString(formData, "colors");
    const file = formData.get("image") as File;

    if (!productId || !colors || !file || file.size === 0) {
      throw new Error("Couleur et image obligatoires");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `variants/${productId}-${Date.now()}.${fileExt}`;
    const imageUrl = await uploadImageToProductsBucket(file, fileName);

    const { error } = await supabase.from("product_variants").insert({
      product_id: productId,
      color_name: colors,
      main_color: colors,
      image_url: imageUrl,
      is_default: false,
    });

    if (error) {
      console.error(error.message);
      throw new Error("Impossible d’ajouter la couleur");
    }

    revalidatePath(`/admin/products/${productId}/variants`);
    revalidatePath("/catalogue");
    revalidatePath(`/product/${product.slug}`);

    redirect(`/admin/products/${productId}/variants`);
  }

  async function updateVariant(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const productId = getString(formData, "product_id");
    const variantId = getString(formData, "variant_id");
    const colors = getString(formData, "colors");
    const file = formData.get("image") as File;

    if (!productId || !variantId || !colors) {
      throw new Error("Couleur obligatoire");
    }

    const payload: {
      color_name: string;
      main_color: string;
      image_url?: string;
    } = {
      color_name: colors,
      main_color: colors,
    };

    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop();
      const fileName = `variants/${productId}-${variantId}-${Date.now()}.${fileExt}`;
      const imageUrl = await uploadImageToProductsBucket(file, fileName);
      payload.image_url = imageUrl;
    }

    const { error } = await supabase
      .from("product_variants")
      .update(payload)
      .eq("id", variantId);

    if (error) {
      console.error(error.message);
      throw new Error("Impossible de modifier la couleur");
    }

    revalidatePath(`/admin/products/${productId}/variants`);
    revalidatePath("/catalogue");
    revalidatePath(`/product/${product.slug}`);

    redirect(`/admin/products/${productId}/variants`);
  }

  async function deleteVariant(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const productId = getString(formData, "product_id");
    const variantId = getString(formData, "variant_id");

    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", variantId);

    if (error) {
      console.error(error.message);
      throw new Error("Impossible de supprimer la couleur");
    }

    revalidatePath(`/admin/products/${productId}/variants`);
    revalidatePath("/catalogue");
    revalidatePath(`/product/${product.slug}`);

    redirect(`/admin/products/${productId}/variants`);
  }

  async function setDefaultVariant(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const productId = getString(formData, "product_id");
    const variantId = getString(formData, "variant_id");

    await supabase
      .from("product_variants")
      .update({ is_default: false })
      .eq("product_id", productId);

    const { error } = await supabase
      .from("product_variants")
      .update({ is_default: true })
      .eq("id", variantId);

    if (error) {
      console.error(error.message);
      throw new Error("Impossible de définir par défaut");
    }

    revalidatePath(`/admin/products/${productId}/variants`);
    revalidatePath("/catalogue");
    revalidatePath(`/product/${product.slug}`);

    redirect(`/admin/products/${productId}/variants`);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href={`/admin/products/${product.id}/edit`}
        className="mb-8 inline-flex text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        ← Retour modification produit
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Couleurs du produit</h1>
        <p className="mt-2 text-sm text-zinc-500">{product.name}</p>
      </div>

      <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Ajouter une couleur</h2>

        <form action={addVariant} className="mt-5 grid gap-4 md:grid-cols-3">
          <input type="hidden" name="product_id" value={product.id} />

          <div>
            <label className="text-sm font-medium">Couleur(s)</label>
            <input
              name="colors"
              required
              placeholder="Ex: Bleu, Vert, Gris"
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Image</label>
            <input
              type="file"
              name="image"
              required
              accept="image/*"
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
            >
              Ajouter
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Modifier les couleurs</h2>

        <div className="mt-6 grid gap-6">
          {product.cover_image_url && (
            <div className="rounded-2xl border p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                  <Image
                    src={product.cover_image_url}
                    alt="Image principale"
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-semibold">
                    {product.main_color ?? product.color ?? "Image principale"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Image principale du produit. Elle se modifie dans la page
                    “Modifier le produit”.
                  </p>
                </div>
              </div>
            </div>
          )}

          {(product.product_variants ?? []).map((variant) => (
            <div key={variant.id} className="rounded-2xl border p-4">
              <div className="grid gap-5 md:grid-cols-[140px_1fr]">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
                    <Image
                      src={variant.image_url}
                      alt={variant.color_name}
                      fill
                      sizes="140px"
                      className="object-cover"
                    />
                  </div>

                  {variant.is_default && (
                    <p className="mt-2 rounded-full bg-green-100 px-3 py-1 text-center text-xs font-medium text-green-700">
                      Par défaut
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <form action={updateVariant} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="product_id" value={product.id} />
                    <input type="hidden" name="variant_id" value={variant.id} />

                    <div>
                      <label className="text-sm font-medium">Couleur(s)</label>
                      <input
                        name="colors"
                        required
                        defaultValue={variant.color_name}
                        className="mt-2 w-full rounded-xl border px-4 py-3"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Remplacer l’image
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="mt-2 w-full rounded-xl border px-4 py-3"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
                      >
                        Enregistrer les modifications
                      </button>
                    </div>
                  </form>

                  <div className="flex flex-wrap gap-2">
                    <form action={setDefaultVariant}>
                      <input type="hidden" name="product_id" value={product.id} />
                      <input type="hidden" name="variant_id" value={variant.id} />
                      <button
                        type="submit"
                        className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-zinc-50"
                      >
                        Définir par défaut
                      </button>
                    </form>

                    <form action={deleteVariant}>
                      <input type="hidden" name="product_id" value={product.id} />
                      <input type="hidden" name="variant_id" value={variant.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!product.product_variants ||
            product.product_variants.length === 0) && (
            <p className="text-sm text-zinc-500">
              Aucune couleur supplémentaire pour le moment.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}