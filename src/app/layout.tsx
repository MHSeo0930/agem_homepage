import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Min Ho Seo | Nanoconvergence Engineering, PKNU",
  description: "AI & Green Energy Material Lab. Associate Professor at Pukyong National University. Research on high-performance electrocatalysts and electrodes for fuel cells, water electrolysis, and metal-air batteries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}




