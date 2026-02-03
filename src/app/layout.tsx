import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Tarra | OAU Commerce Without the Chaos",
  description: "Buy, sell, and discover trusted student brands and services in OAU. Join the official Tarra waitlist and climb the referral leaderboard.",
  keywords: ["Tarra", "OAU", "Obafemi Awolowo University", "Campus Commerce", "Student Marketplace", "Buy and Sell OAU", "Campus Services", "Student Brands", "OAU Waitlist"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://tarra.ng"),
  authors: [{ name: "Tarra Team" }],
  creator: "Tarra",
  publisher: "Tarra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tarra | OAU Commerce Without the Chaos",
    description: "Buy, sell, and discover trusted student brands and services in OAU. Join the official Tarra waitlist and climb the referral leaderboard.",
    url: "https://tarra.ng",
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
    creator: "@tarra_ng",
  },
  icons: {
    icon: "/assets/favicon_nobg.png",
    apple: "/assets/favicon_nobg.png",
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
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link 
          rel="preload" 
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap" 
          as="style" 
        />
        <link 
          rel="stylesheet" 
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap" 
        />
        <link rel="preload" href="/assets/bg.jpeg" as="image" />
      </head>
      <body className="antialiased selection:bg-primary/30 transition-colors duration-200 font-sans overflow-x-hidden">
        {/* Global Brand Background Pattern */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
          aria-hidden="true"
          style={{ 
            backgroundImage: 'url("/assets/bg.jpeg")',
            backgroundSize: '400px 400px',
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'fixed',
            filter: 'blur(1px)'
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://tarra.ng/#organization",
                  "name": "Tarra",
                  "url": "https://tarra.ng",
                  "logo": "https://tarra.ng/logo.png",
                  "description": "Campus commerce platform for OAU students"
                },
                {
                  "@type": "WebSite",
                  "@id": "https://tarra.ng/#website",
                  "url": "https://tarra.ng",
                  "name": "Tarra",
                  "publisher": {
                    "@id": "https://tarra.ng/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://tarra.ng/?s={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            }),
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
