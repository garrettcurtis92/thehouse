import "./globals.css";
import type { Metadata } from "next";
import { Inter, Bebas_Neue, Outfit } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
// Optional secondary
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "The House",
  description: "College athletes meeting weekly to study the Bible in Redding.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} ${outfit.variable}`}>
      <body className="bg-sand text-charcoal font-sans antialiased">{children}</body>
    </html>
  );
}