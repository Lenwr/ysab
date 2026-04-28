import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import ProductForm from "@/components/admin/product-form";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) notFound();

  async function updateProduct(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const productId = getString(formData, "id");

    const payload = {
      name: getString(formData, "name"),
      slug: getString(formData, "slug"),
      reference: getString(formData, "reference") || null,
      description: getString(formData, "description") || null,
      category: getString(formData, "category"),
      pattern: getString(formData, "pattern") || null,
      main_color: getString(formData, "main_color") || null,
      color: getString(formData, "main_color") || null,
      is_featured: formData.get("is_featured") === "on",
      is_available: formData.get("is_available") === "on",
    };

    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId);

    if (error) {
      console.error(error.message);
      throw new Error("Impossible de modifier le produit");
    }

    revalidatePath("/admin/products");
    revalidatePath("/catalogue");
    revalidatePath(`/product/${payload.slug}`);

    redirect("/admin/products");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Modifier le produit</h1>
          <p className="mt-2 text-sm text-gray-500">
            Mets à jour les informations principales.
          </p>
        </div>

        <Link
          href={`/admin/products/${product.id}/variants`}
          className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
        >
          Gérer les variantes
        </Link>
      </div>
      <ProductForm
        action={updateProduct}
        initialData={product}
        submitLabel="Mettre à jour"
      />
    </main>
  );
}