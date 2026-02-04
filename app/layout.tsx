import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basemap Tester",
  description: "Test and compare different Mapbox basemap styles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
