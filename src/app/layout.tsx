import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import { AppChakraProvider } from "@/components/providers/chakra-provider";

export const metadata: Metadata = {
  title: "Stayfinder",
  description: "Airbnb-inspired listings and map experience built with Next.js and Chakra UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <AppChakraProvider>{children}</AppChakraProvider>
      </body>
    </html>
  );
}
