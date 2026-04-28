import Image from "next/image";
import Link from "next/link";

const heroImages = ["/images/hero1.jpg", "/images/hero2.jpg"];

const categories = [
  {
    name: "Wax Hollandais",
    image: "/images/waxhollandais.jpg",
  },
  {
    name: "Super Wax",
    image: "/images/superwax.jpg",
  },
  {
    name: "Nouveautés",
    image: "/images/grandwaxhollandais.jpg",
  },
];

export default function Home() {
  return (
    <main className="bg-white text-black">
      <section className="relative overflow-hidden bg-[#f7f2ea] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
              YSAB • Lomé - Togo
            </p>

            <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
              Catalogue de pagnes en gros.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
              Découvrez nos modèles, motifs et couleurs disponibles. Chaque
              pagne peut avoir plusieurs variantes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalogue"
                className="rounded-full bg-black px-7 py-4 text-sm font-bold text-white transition hover:bg-zinc-800"
              >
                Voir le catalogue
              </Link>

              <a
                href="https://wa.me/22890045934"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-black/20 bg-white px-7 py-4 text-sm font-bold text-black transition hover:bg-zinc-100"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {heroImages.map((image, index) => (
              <div
                key={image}
                className={`relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-zinc-100 shadow-lg ${
                  index === 1 ? "sm:mt-14" : ""
                }`}
              >
                <Image
                  src={image}
                  alt="Pagne YSAB"
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
              Collections
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Explorer les catégories
            </h2>
          </div>

          <Link href="/catalogue" className="text-sm font-bold underline">
            Tout voir
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((item) => (
            <Link
              key={item.name}
              href="/catalogue"
              className="group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Voir les modèles disponibles
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