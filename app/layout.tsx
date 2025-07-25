import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KlinikKu - Manajemen Notifikasi",
  description: "Sistem manajemen notifikasi untuk KlinikKu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}