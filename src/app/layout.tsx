import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Tarra | The Official OAU Marketplace",
  description: "Join the exclusive waitlist for the official OAU marketplace. Connect with verified campus vendors and discover essential services in one secure platform.",
  openGraph: {
    title: "Tarra | The Official OAU Marketplace",
    description: "Join the exclusive waitlist for the official OAU marketplace.",
    url: "https://tarra.app",
    siteName: "Tarra",
    locale: "en_US",
    type: "website",
  },
};

import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased selection:bg-primary/10 transition-colors duration-500 font-sans">
        {/* Global Blueprint Texture */}
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-plus opacity-[0.4] dark:opacity-[0.2]" />
          <div className="absolute inset-0 bg-noise opacity-30 mix-blend-soft-light" />
        </div>
        
        <div className="relative z-10 min-h-screen flex flex-col">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
