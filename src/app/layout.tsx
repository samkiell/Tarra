import type { Metadata } from "next";
import "./globals.css";

// Standard production-ready layout
// Meaningful comment: Root layout defines the HTML structure and global styles

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white text-stone-900 dark:text-stone-50 selection:bg-stone-100 dark:selection:bg-stone-800 transition-colors duration-300">
        <Providers>
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
