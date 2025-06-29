import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BoltBadge from "@/components/ui/BoltBadge";
import { WalletProvider } from "@/hooks/usePeraWallet";

// Import Pacifico font from Google Fonts
import { Pacifico } from 'next/font/google';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
});

export const metadata: Metadata = {
  title: "Ellora - Decentralized Freelance Marketplace",
  description: "The future of freelancing on Algorand. Secure, instant, and decentralized.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-matrix-black text-white min-h-screen flex flex-col font-sans ${pacifico.variable}`}>
        <WalletProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          
          {/* Bolt.new Hackathon Badge */}
          <BoltBadge />
        </WalletProvider>
      </body>
    </html>
  );
}