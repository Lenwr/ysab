import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YSAB | Catalogue de pagnes",
  description: "Catalogue de pagnes en gros à Lomé - Togo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
    
        </div>
      </body>
    </html>
  );
}