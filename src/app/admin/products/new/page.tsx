import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import ProductForm from "@/components/admin/product-form";
import { createClient } from "@/src/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function uploadImageToProductsBucket(file: File, path: string) {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("products")
    .upload(path, file, {
      upsert: false,
    });

  if (error) {
    console.error("Erreur upload:", error.message);
    throw new Error("Erreur upload image");
  }

  const { data } = supabase.storage.from("products").getPublicUrl(path);

  return data.publicUrl;
}

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const coverFile = formData.get("image") as File;
    let imageUrl: string | null = null;

    if (coverFile && coverFile.size > 0) {
      const fileExt = coverFile.name.split(".").pop();
      const fileName = `covers/${Date.now()}.${fileExt}`;

      imageUrl = await uploadImageToProductsBucket(coverFile, fileName);
    }

    const payload = {
      name: getString(formData, "name"),
      slug: getString(formData, "slug"),
      reference: getString(formData, "reference") || null,
      description: getString(formData, "description") || null,
      category: getString(formData, "category"),
      piece_length: getString(formData, "piece_length") || null,
      pattern: getString(formData, "pattern") || null,
      cover_image_url: imageUrl,
      is_featured: formData.get("is_featured") === "on",
      is_available: formData.get("is_available") === "on",
    };

    const { data: createdProduct, error } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();

    if (error || !createdProduct) {
      console.error(error?.message);
      throw new Error("Erreur création produit");
    }

    const defaultVariantIndex = getString(formData, "default_variant_index");

    const variantIndexes = formData
      .getAll("variant_indexes")
      .filter((value): value is string => typeof value === "string");

    for (const index of variantIndexes) {
      const colors = getString(formData, `variant_colors_${index}`);
      const variantFile = formData.get(`variant_image_${index}`) as File;

      if (!colors || !variantFile || variantFile.size === 0) {
        continue;
      }

      const fileExt = variantFile.name.split(".").pop();
      const fileName = `variants/${createdProduct.id}-${index}-${Date.now()}.${fileExt}`;

      const variantImageUrl = await uploadImageToProductsBucket(
        variantFile,
        fileName
      );

      const { error: variantInsertError } = await supabase
        .from("product_variants")
        .insert({
          product_id: createdProduct.id,
          color_name: colors,
          main_color: colors,
          image_url: variantImageUrl,
          is_default: defaultVariantIndex === index,
        });

      if (variantInsertError) {
        console.error("Erreur variante:", variantInsertError.message);
        throw new Error("Erreur création variante");
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/catalogue");

    redirect("/admin/products");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nouveau produit</h1>
        <p className="mt-2 text-sm text-gray-500">
          Ajoute un nouveau pagne avec ses variantes de couleurs.
        </p>
      </div>

      <ProductForm action={createProduct} submitLabel="Créer le produit" />
    </main>
  );
}