import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tarra | OAU Commerce Without the Chaos",
  description: "Buy, sell, and discover trusted student brands and services in OAU. Join the official Tarra waitlist and climb the referral leaderboard.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://tarra.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tarra | OAU Commerce Without the Chaos",
    description: "Buy, sell, and discover trusted student brands and services in OAU. Join the official Tarra waitlist and climb the referral leaderboard.",
    url: "/",
    siteName: "Tarra",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tarra - OAU Commerce Without the Chaos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarra | OAU Commerce Without the Chaos",
    description: "Buy, sell, and discover trusted student brands and services in OAU. Join the official Tarra waitlist and climb the referral leaderboard.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/assets/favicon_nobg.png",
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className="antialiased selection:bg-primary/30 transition-colors duration-200 font-sans">
        {/* Global Brand Background Pattern */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.1] dark:opacity-[0.08]" 
          aria-hidden="true"
          style={{ 
            backgroundImage: 'url("/assets/bg.jpeg")',
            backgroundSize: '300px 300px',
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        
        <div className="relative z-10 min-h-screen flex flex-col">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
