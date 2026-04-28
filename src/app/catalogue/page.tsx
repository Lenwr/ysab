import Image from "next/image";
import Link from "next/link";
import ProductCard from "../../components/catalogue/product-card";
import { createClient } from "@/lib/supabase/server";

const categories = [
  {
    name: "Wax Hollandais",
    image:"/images/waxhollandais.jpg"},
  {
    name: "Super-Wax",
    image:"/images/waxhollandais.jpg"  },
  {
    name: "Satin Royal",
    image:"/images/waxhollandais.jpg" },
  {
    name: "Grand Super-Wax",
    image:"/images/waxhollandais.jpg" },
];

export default async function CataloguePage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      category,
      pattern,
      color,
      main_color,
      cover_image_url,
      is_featured,
      is_available,
      product_variants (
        id,
        color_name,
        image_url,
        is_default
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p>Erreur lors du chargement des produits.</p>
      </main>
    );
  }

  return (
    <main className="bg-[#f7f2ea] text-zinc-950">
      <section className="relative min-h-[78vh] overflow-hidden bg-black text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        >
          <source src="/videos/videoaccueil.webm" type="video/webm" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-300">
              YSAB • Lomé - Togo
            </p>

            <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl">
              Catalogue de pagnes en gros.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-200">
              Découvrez nos modèles, motifs et couleurs disponibles. Chaque
              pagne peut avoir plusieurs variantes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/22890045934"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-7 py-4 text-sm font-bold text-black"
              >
                WhatsApp
              </a>

              <Link
                href="/contact"
                className="rounded-full border border-white/40 px-7 py-4 text-sm font-bold text-white hover:bg-white hover:text-black"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-12">
       
        <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
          
            <h2 className="mt-6 text-3xl font-bold">Catalogue YSAB</h2>
          </div>

          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            {products?.length ?? 0} dessins
          </p>
        </div>

        {!products || products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center">
            Aucun produit pour le moment.
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}