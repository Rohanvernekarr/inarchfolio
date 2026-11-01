export const services = [
  {
    number: "01",
    title: "House design",
    text: "Plans, sections, and elevations. The court, the rooms, and where the structure sits on the plot.",
  },
  {
    number: "02",
    title: "Interiors",
    text: "Materials, joinery, lighting, and fixed furniture, drawn with the rest of the house.",
  },
  {
    number: "03",
    title: "Site build",
    text: "From the foundation to handover. We stay on site and build from those drawings.",
  },
  {
    number: "04",
    title: "Before you build",
    text: "The plot, the local rules, and a first cost, so you know the house can be built.",
  },
] as const;

export const processStages = [
  {
    id: "design",
    number: "01",
    title: "Design and planning",
    text: "A measured survey, a plan, and a line drawing that can survive contact with a budget.",
  },
  {
    id: "engineering",
    number: "02",
    title: "Engineering and execution",
    text: "Structure, services, and sequence coordinated so the site builds what the sheet shows.",
  },
  {
    id: "handover",
    number: "03",
    title: "Quality and handover",
    text: "Snagging against the drawing. Keys, manuals, and a building that matches the model.",
  },
] as const;

export const contactChannels = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "Message", href: "mailto:?subject=A%20project%20for%20INARCH" },
  { label: "Email", href: "mailto:" },
] as const;

export const nav = [
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
] as const;
