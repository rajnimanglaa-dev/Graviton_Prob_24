/**
 * 3-Color Waste Categorization Visual System
 * 
 * GREEN (#16A36A)  - Recyclable Waste (Plastic, Paper, Cardboard, Metal)
 * BLUE (#3987F5)   - Wet / Organic Waste (Food, Vegetable, Peels, Garden)
 * YELLOW (#F4C542) - Mixed / Other Waste (Mixed garbage, Construction, Non-recyclable)
 */

export function getWasteVisualCategory(categoryKey = "") {
  const cat = String(categoryKey).toLowerCase().trim();

  if (
    cat.includes("plastic") ||
    cat.includes("paper") ||
    cat.includes("cardboard") ||
    cat.includes("metal") ||
    cat.includes("recycl")
  ) {
    return {
      group: "recyclable",
      name: "Recyclable Waste",
      color: "#16A36A", // Green
      mint: "#8BE0B0",
      glowRgba: "rgba(22, 163, 106, 0.45)",
      bgClass: "bg-[#16A36A]/15 text-[#8BE0B0] border-[#16A36A]/40",
      badgeBg: "bg-[#16A36A] text-white",
      borderClass: "border-[#16A36A]",
      glowClass: "glow-green",
      description: "Plastic bottles, cardboard packaging, paper & scrap metal",
      badgeLabel: "Recyclable",
      sampleItems: ["Plastic Bottles", "Cardboard", "Metal Cans", "Polythene"]
    };
  }

  if (
    cat.includes("organic") ||
    cat.includes("food") ||
    cat.includes("wet") ||
    cat.includes("vegetable") ||
    cat.includes("fruit") ||
    cat.includes("garden") ||
    cat.includes("kitchen")
  ) {
    return {
      group: "organic",
      name: "Wet / Organic Waste",
      color: "#3987F5", // Blue
      mint: "#90c2ff",
      glowRgba: "rgba(57, 135, 245, 0.45)",
      bgClass: "bg-[#3987F5]/15 text-[#90c2ff] border-[#3987F5]/40",
      badgeBg: "bg-[#3987F5] text-white",
      borderClass: "border-[#3987F5]",
      glowClass: "glow-blue",
      description: "Food leftovers, vegetable waste, fruit peels & organic compostables",
      badgeLabel: "Wet / Organic",
      sampleItems: ["Food Leftovers", "Vegetable Waste", "Fruit Peels", "Garden Trim"]
    };
  }

  // Mixed / Construction / Debris / Unknown
  return {
    group: "mixed",
    name: "Mixed / Other Waste",
    color: "#F4C542", // Yellow
    mint: "#fce58d",
    glowRgba: "rgba(244, 197, 66, 0.45)",
    bgClass: "bg-[#F4C542]/15 text-[#fce58d] border-[#F4C542]/40",
    badgeBg: "bg-[#F4C542] text-[#101A17]",
    borderClass: "border-[#F4C542]",
    glowClass: "glow-yellow",
    description: "Mixed garbage, construction debris, inert waste & unsegregated piles",
    badgeLabel: "Mixed / Other",
    sampleItems: ["Mixed Garbage", "Construction Debris", "Inert Rubble", "Non-recyclables"]
  };
}

export const WASTE_COLOR_CATEGORIES = [
  {
    id: "green",
    key: "recyclable",
    name: "Recyclable Waste",
    color: "#16A36A",
    mint: "#8BE0B0",
    badge: "GREEN",
    examples: "Plastic bottles, paper, cardboard, metal cans",
    icon: "Recycle"
  },
  {
    id: "blue",
    key: "organic",
    name: "Wet / Organic Waste",
    color: "#3987F5",
    mint: "#90c2ff",
    badge: "BLUE",
    examples: "Food leftovers, vegetable waste, fruit peels, garden trim",
    icon: "Apple"
  },
  {
    id: "yellow",
    key: "mixed",
    name: "Mixed / Other Waste",
    color: "#F4C542",
    mint: "#fce58d",
    badge: "YELLOW",
    examples: "Mixed municipal trash, non-recyclables, construction rubble",
    icon: "Trash2"
  }
];
