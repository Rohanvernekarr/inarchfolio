import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/layout/Grain";
import { Navbar } from "@/components/layout/Navbar";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "INARCH - Architecture & Construction",
    template: "%s - INARCH",
  },
  description:
    "INARCH is an architecture and construction studio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full bg-obsidian font-sans text-ivory">
        <Grain />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
