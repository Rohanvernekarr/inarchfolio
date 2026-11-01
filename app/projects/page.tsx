import type { Metadata } from "next";
import { Go } from "@/components/Go";

export const metadata: Metadata = { title: "Work" };

export default function ProjectsPage() {
  return <Go href="/#services" />;
}
