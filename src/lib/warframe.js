import warframes from "../data/warframes.json";

export function getWarframes() {
  return warframes;
}

export function getWarframeBySlug(slug) {
  return warframes.find((w) => w.slug === slug) || null;
}

// Variant type colors
export const WARFRAME_VARIANT_COLORS = {
  Prime: "#f0d060",
  Umbra: "#4080d0",
  Base: "#808080",
};

// Stat display info
export const WARFRAME_STATS = [
  { key: "health", label: "Salute", color: "#d04040", icon: "❤️" },
  { key: "shield", label: "Scudo", color: "#4080d0", icon: "🛡️" },
  { key: "armor", label: "Armatura", color: "#d0a040", icon: "🔰" },
  { key: "energy", label: "Energia", color: "#40d0d0", icon: "⚡" },
  { key: "sprint", label: "Velocità", color: "#40d040", icon: "🏃" },
];

