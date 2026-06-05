import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Puthankada Admin",
  description: "Admin control center for managing hardware items, categories, and products",
  icons: {
    icon: [
      { url: '/puthankada-logo.png', type: 'image/png' },
    ],
    apple: { url: '/puthankada-logo.png' },
    shortcut: '/puthankada-logo.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
