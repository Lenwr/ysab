export default function ContactPage() {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Contact</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Retrouvez les informations utiles de la société YSAB.
          </p>
        </div>
  
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Coordonnées</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-600">
              <p>
                <strong>YSAB</strong>
              </p>
              <p>02, Rue de la Gare, Face BIA-Togo</p>
              <p>Kokétimé - BP 2184</p>
              <p>Lomé - Togo</p>
              <p>(+228) 90 04 59 34</p>
              <p>Vente de pagnes en gros.</p>
            </div>
          </section>
  
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Horaires d’ouverture</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-600">
              <p>Lundi : 09H00 — 17H30</p>
              <p>Mardi : 09H00 — 17H30</p>
              <p>Mercredi : 09H00 — 17H30</p>
              <p>Jeudi : 09H00 — 17H30</p>
              <p>Vendredi : 09H00 — 17H30</p>
              <p>Samedi : 09H00 — 17H30</p>
              <p>Dimanche : Fermé</p>
            </div>
          </section>
        </div>
      </main>
    );
  }