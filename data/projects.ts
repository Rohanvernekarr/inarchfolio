export type Project = {
  slug: string;
  number: string;
  name: string;
  location: string;
  type: string;
  year: string;
  area: string;
  summary: string;
  role: string;
  paragraphs: string[];
  facts: { label: string; value: string }[];
  silhouette: number[];
};

export const projects: Project[] = [];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0 || projects.length === 0) return undefined;
  return projects[(index + 1) % projects.length];
}
