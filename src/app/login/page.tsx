import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const email = getString(formData, "email");
    const password = getString(formData, "password");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      redirect("/login?error=1");
    }

    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form action={login} className="w-full rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Connexion admin</h1>

        <div className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Mot de passe"
            className="w-full rounded-xl border px-4 py-3"
          />

          <button className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white">
            Se connecter
          </button>
        </div>
      </form>
    </main>
  );
}