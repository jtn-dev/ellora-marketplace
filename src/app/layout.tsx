import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
          <div className="fixed top-4 right-4 z-50">
            <a 
              href="https://bolt.new/?rid=os72mi" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block transition-all duration-300 hover:shadow-2xl"
            >
              <img 
                src="https://storage.bolt.army/white_circle_360x360.png" 
                alt="Built with Bolt.new badge" 
                className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg bolt-badge bolt-badge-intro"
                onAnimationEnd={(e) => e.currentTarget.classList.add('animated')}
              />
            </a>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}