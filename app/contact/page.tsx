import type { Metadata } from "next";
import { Go } from "@/components/Go";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <Go href="/#contact" />;
}
