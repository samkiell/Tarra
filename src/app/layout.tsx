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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white text-stone-900 selection:bg-stone-100">
        {children}
      </body>
    </html>
  );
}
