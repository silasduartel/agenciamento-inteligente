import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agenciamento Inteligente",
  description: "Protótipo frontend para transportes, logística e fretes"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
