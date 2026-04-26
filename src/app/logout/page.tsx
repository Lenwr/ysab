import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export default async function LogoutPage() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
}