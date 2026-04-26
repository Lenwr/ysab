"use client";

import { useState } from "react";

type ProductFormValues = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  reference?: string | null;
  category?: string | null;
  pattern?: string | null;
  main_color?: string | null;
  color?: string | null;
  description?: string | null;
  cover_image_url?: string | null;
  is_featured?: boolean | null;
  is_available?: boolean | null;
};

type ColorVariant = {
  id: number;
  colors: string;
  preview: string | null;
  hasFile: boolean;
};

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  initialData?: ProductFormValues;
  submitLabel?: string;
};

export default function ProductForm({
  action,
  initialData,
  submitLabel = "Enregistrer",
}: ProductFormProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.cover_image_url ?? null
  );

  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([
    { id: Date.now(), colors: "", preview: null, hasFile: false },
  ]);

  function handleCoverChange(file?: File) {
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
  }

  function addColor() {
    const lastVariant = colorVariants[colorVariants.length - 1];

    if (!lastVariant.colors.trim() || !lastVariant.hasFile) {
      alert(
        "Ajoute d’abord la couleur et l’image avant de créer une nouvelle couleur."
      );
      return;
    }

    setColorVariants((current) => [
      ...current,
      { id: Date.now(), colors: "", preview: null, hasFile: false },
    ]);
  }

  function removeColor(id: number) {
    setColorVariants((current) =>
      current.filter((variant) => variant.id !== id)
    );
  }

  function handleColorChange(index: number, value: string) {
    setColorVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, colors: value } : variant
      )
    );
  }

  function handleColorImageChange(index: number, file?: File) {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setColorVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, preview: previewUrl, hasFile: true }
          : variant
      )
    );
  }

  return (
    <form action={action} className="grid gap-6 md:grid-cols-2">
      {initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Nom du pagne</label>
        <input
          name="name"
          required
          defaultValue={initialData?.name ?? ""}
          placeholder="Ex: Pagne floral premium"
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Slug</label>
        <input
          name="slug"
          required
          defaultValue={initialData?.slug ?? ""}
          placeholder="ex: pagne-floral-premium"
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Référence</label>
        <input
          name="reference"
          defaultValue={initialData?.reference ?? ""}
          placeholder="Ex: YSAB-001"
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Catégorie</label>
        <select
          name="category"
          required
          defaultValue={initialData?.category ?? ""}
          className="w-full rounded-xl border px-4 py-3"
        >
          <option value="">Sélectionner</option>
          <option>Grand Super-Wax</option>
          <option>Satin Royal</option>
          <option>Super-Wax</option>
          <option>Wax GlitterGlam</option>
          <option>Wax Hollandais</option>
        </select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">Motif</label>
        <input
          name="pattern"
          defaultValue={initialData?.pattern ?? ""}
          placeholder="Ex: Floral, Géométrique, Botanique..."
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">Image principale</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(event) => handleCoverChange(event.target.files?.[0])}
          className="w-full rounded-xl border px-4 py-3"
        />

        {coverPreview && (
          <div className="mt-4 h-40 w-40 overflow-hidden rounded-xl border bg-zinc-100">
            <img
              src={coverPreview}
              alt="Aperçu image principale"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">Couleur principale</label>
        <input
          name="main_color"
          defaultValue={initialData?.main_color ?? initialData?.color ?? ""}
          placeholder="Ex: Bleu, Rouge, Vert..."
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialData?.description ?? ""}
          placeholder="Décris le pagne, son motif, sa qualité, son usage..."
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="flex flex-wrap gap-6 md:col-span-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={Boolean(initialData?.is_featured)}
          />
          Vedette
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="is_available"
            defaultChecked={initialData?.is_available ?? true}
          />
          Disponible
        </label>
      </div>

      {!initialData && (
        <div className="space-y-6 rounded-2xl border bg-zinc-50 p-6 md:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Couleurs disponibles</h3>
              <p className="mt-1 text-sm text-zinc-500">
                Ajoute chaque couleur du même pagne avec son image.
              </p>
            </div>

            <button
              type="button"
              onClick={addColor}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              + Ajouter une couleur
            </button>
          </div>

          {colorVariants.map((variant, index) => (
            <div
              key={variant.id}
              className="grid gap-4 rounded-xl border bg-white p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <input type="hidden" name="variant_indexes" value={index} />

              <div>
                <label className="text-sm font-medium">Couleur(s)</label>
                <input
                  name={`variant_colors_${index}`}
                  value={variant.colors}
                  onChange={(event) =>
                    handleColorChange(index, event.target.value)
                  }
                  placeholder="Ex: Gris, Rouge ou Bleu, Vert"
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Image de cette couleur
                </label>
                <input
                  type="file"
                  name={`variant_image_${index}`}
                  accept="image/*"
                  onChange={(event) =>
                    handleColorImageChange(index, event.target.files?.[0])
                  }
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="flex flex-col justify-end gap-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="radio"
                    name="default_variant_index"
                    value={index}
                    defaultChecked={index === 0}
                  />
                  Par défaut
                </label>

                {colorVariants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColor(variant.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                )}
              </div>

              {variant.preview && (
                <div className="md:col-span-3">
                  <div className="h-32 w-32 overflow-hidden rounded-xl border bg-zinc-100">
                    <img
                      src={variant.preview}
                      alt={`Aperçu couleur ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full rounded-xl bg-black px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}