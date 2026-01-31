import type { Metadata } from "next";
import "./globals.css";

// Standard production-ready layout
// Meaningful comment: Root layout defines the HTML structure and global styles

export const metadata: Metadata = {
  title: "Tarra - Next.js Application",
  description: "Minimal production-ready Next.js application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
