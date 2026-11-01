import type { Metadata } from "next";
import { Go } from "@/components/Go";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return <Go href="/#services" />;
}
