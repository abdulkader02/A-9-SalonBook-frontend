import type { LucideIcon } from "lucide-react"
import {
  Brush,
  Flower2,
  Hand,
  Leaf,
  Palette,
  Scissors,
  Sparkles,
} from "lucide-react"

export interface ServiceCategory {
  name: string
  description: string
  icon: LucideIcon
}

export const serviceCategories: ServiceCategory[] = [
  {
    name: "Haircut & Styling",
    description: "Trendy cuts, blowouts, and styling for every occasion.",
    icon: Scissors,
  },
  {
    name: "Hair Coloring",
    description: "Root touch-ups, highlights, and bold color transformations.",
    icon: Palette,
  },
  {
    name: "Hair Treatment",
    description: "Deep conditioning, keratin, and scalp care therapies.",
    icon: Sparkles,
  },
  {
    name: "Facial & Skincare",
    description: "Cleanups, facials, and glowing-skin treatments.",
    icon: Flower2,
  },
  {
    name: "Makeup",
    description: "Everyday looks and occasion-ready glam by pros.",
    icon: Brush,
  },
  {
    name: "Manicure & Pedicure",
    description: "Nail care, art, and polish for hands and feet.",
    icon: Hand,
  },
  {
    name: "Spa & Massage",
    description: "Relaxing massages and rejuvenating body therapies.",
    icon: Leaf,
  },
]
