export const services = [
  {
    number: "01",
    title: "Architecture",
    text: "Residential and commercial planning, 2D floor plans, space planning, elevations and working drawings.",
  },
  {
    number: "02",
    title: "Structural design",
    text: "Structural layouts, foundation design, reinforcement details and coordinated technical drawings.",
  },
  {
    number: "03",
    title: "Interior design",
    text: "Living rooms, kitchens, wardrobes, bedrooms, lighting and 3D interior visualization.",
  },
  {
    number: "04",
    title: "Project support",
    text: "3D elevations, construction consultancy and project execution support, subject to agreed scope.",
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
  { label: "Instagram", href: "https://www.instagram.com/_inarch_/" },
  { label: "WhatsApp", href: "https://wa.me/919483185207" },
  { label: "Email", href: "mailto:inarchstructuresandstudio@gmail.com?subject=Project%20enquiry%20for%20InArch" },
] as const;

export const nav = [
  { href: "/#opening", label: "Home" },
  { href: "/#about", label: "About us" },
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Projects" },
  { href: "/#packages", label: "Packages" },
  { href: "/#contact", label: "Contact" },
] as const;
