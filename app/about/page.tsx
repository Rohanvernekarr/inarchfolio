import type { Metadata } from "next";
import { Go } from "@/components/Go";

export const metadata: Metadata = { title: "Studio" };

export default function AboutPage() {
  return <Go href="/#services" />;
}
