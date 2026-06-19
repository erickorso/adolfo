import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/organisms/site-header";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentRate } from "@/services/rates/rate.service";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catálogo — Productos y Servicios",
  description: "Catálogo de productos y servicios con checkout.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cotización actual (read-through cache) para la conversión de moneda.
  const rate = await getCurrentRate();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers rate={rate}>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
