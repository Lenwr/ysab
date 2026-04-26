import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select(
      "id, name, slug, category, color, price_label, cover_image_url, is_available"
    )
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: latestProducts } = await supabase
    .from("products")
    .select(
      "id, name, slug, category, color, price_label, cover_image_url, is_available"
    )
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <main className="bg-[#f7f2ea] text-zinc-950">
      <section className="relative min-h-[82vh] overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%),linear-gradient(120deg,rgba(0,0,0,0.95),rgba(0,0,0,0.45))]" />

        <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-300">
              YSAB • Lomé - Togo
            </p>

            <h1 className="mt-6 max-w-xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Pagnes en gros, sélectionnés avec style.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-zinc-200">
              Découvrez le catalogue YSAB : modèles disponibles, catégories,
              couleurs et informations utiles pour vos achats en gros.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/catalogue"
                className="rounded-full bg-white px-7 py-4 text-sm font-bold text-black transition hover:bg-zinc-200"
              >
                Voir le catalogue
              </Link>

              <a
                href="https://wa.me/22890045934"
                target="_blank"
                className="rounded-full border border-white/40 px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-black"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="aspect-[3/4] rounded-[2rem] bg-white/10 p-3 backdrop-blur">
              <div className="h-full rounded-[1.5rem] bg-gradient-to-br from-orange-200 via-yellow-500 to-red-900" />
            </div>
            <div className="aspect-[3/4] rounded-[2rem] bg-white/10 p-3 backdrop-blur sm:mt-16">
              <div className="h-full rounded-[1.5rem] bg-gradient-to-br from-blue-900 via-cyan-500 to-amber-300" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
              Collections
            </p>
            <h2 className="mt-3 text-3xl font-bold">Explorer par catégorie</h2>
          </div>
          <Link href="/catalogue" className="text-sm font-bold underline">
            Tout voir
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {["Wax", "Super Wax", "Nouveautés"].map((item) => (
            <Link
              key={item}
              href="/catalogue"
              className="group rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-6 aspect-square rounded-[1.5rem] bg-zinc-100 transition group-hover:bg-zinc-200" />
              <h3 className="text-xl font-bold">{item}</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Voir les modèles disponibles
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Sélection
              </p>
              <h2 className="mt-3 text-3xl font-bold">Produits mis en avant</h2>
            </div>
            <Link href="/catalogue" className="text-sm font-bold underline">
              Catalogue complet
            </Link>
          </div>

          {!featuredProducts || featuredProducts.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed p-10 text-center text-sm text-zinc-500">
              Aucun produit vedette pour le moment.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group overflow-hidden rounded-[2rem] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/5] bg-zinc-100">
                    {product.cover_image_url ? (
                      <Image
                        src={product.cover_image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                        Pas d’image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      {product.category}
                    </p>
                    <h3 className="mt-2 text-xl font-bold">{product.name}</h3>
                    {product.color && (
                      <p className="mt-2 text-sm text-zinc-600">
                        Couleur : {product.color}
                      </p>
                    )}
                    {product.price_label && (
                      <p className="mt-3 font-semibold">
                        {product.price_label}
                      </p>
                    )}
                    <p className="mt-5 text-sm font-bold">Voir le détail →</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Nouveautés
          </p>
          <h2 className="mt-3 text-4xl font-bold">
            Les derniers modèles ajoutés au catalogue.
          </h2>
          <p className="mt-5 max-w-lg leading-8 text-zinc-600">
            Consultez régulièrement le catalogue pour découvrir les nouvelles
            références disponibles chez YSAB.
          </p>
          <Link
            href="/catalogue"
            className="mt-8 inline-flex rounded-full bg-black px-7 py-4 text-sm font-bold text-white"
          >
            Découvrir les nouveautés
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(latestProducts ?? []).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm"
            >
              <div className="relative aspect-square bg-zinc-100">
                {product.cover_image_url ? (
                  <Image
                    src={product.cover_image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {product.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-zinc-950 px-6 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
              Boutique
            </p>
            <h2 className="mt-3 text-3xl font-bold">YSAB</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              Vente de pagnes en gros à Lomé, au Togo.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Coordonnées</h3>
            <p className="mt-4 leading-7 text-zinc-300">
              02, Rue de la Gare, Face BIA-Togo
              <br />
              Kokétimé - BP 2184
              <br />
              Lomé - Togo
              <br />
              (+228) 90 04 59 34
            </p>
          </div>

          <div>
            <h3 className="font-bold">Horaires</h3>
            <p className="mt-4 leading-7 text-zinc-300">
              Lundi - Samedi : 09H00 — 17H30
              <br />
              Dimanche : Fermé
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-black"
            >
              Voir le contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}