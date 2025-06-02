import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Poppins } from 'next/font/google';

// Use Poppins font globally
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: "Interior Space - Complete Interior Solutions",
  description: "Your one-stop destination for complete interior solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.className} antialiased`}>
      <body style={{ background: 'var(--color-white)', color: 'var(--color-black)' }}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
