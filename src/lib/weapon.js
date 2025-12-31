import weapons from "../data/weapons.json";

export function getWeapons() {
  return weapons;
}

export function getWeaponBySlug(slug) {
  return weapons.find((w) => w.slug === slug) || null;
}

export function getWeaponsByNames(names) {
  return weapons.filter((w) => names.includes(w.name));
}

// Damage type colors for UI
export const DAMAGE_COLORS = {
  impact: "#8ec3e8",
  puncture: "#d4a85a",
  slash: "#d46a6a",
  cold: "#72c8e8",
  electricity: "#b8a8e8",
  heat: "#e8a872",
  toxin: "#7ad47a",
  blast: "#e8d872",
  corrosive: "#a8d872",
  gas: "#c8e872",
  magnetic: "#7272e8",
  radiation: "#d8d872",
  viral: "#72e8a8",
  void: "#e8e8e8",
};

// Damage type icons/labels
export const DAMAGE_LABELS = {
  impact: "Impact",
  puncture: "Puncture",
  slash: "Slash",
  cold: "Cold",
  electricity: "Electricity",
  heat: "Heat",
  toxin: "Toxin",
  blast: "Blast",
  corrosive: "Corrosive",
  gas: "Gas",
  magnetic: "Magnetic",
  radiation: "Radiation",
  viral: "Viral",
  void: "Void",
};

// Variant type colors
export const VARIANT_COLORS = {
  Prime: "#f0d060",
  Kuva: "#d04040",
  Tenet: "#40a0d0",
  Wraith: "#606060",
  Vandal: "#6080d0",
  Prisma: "#d060d0",
  Base: "#808080",
  MK1: "#606060",
  Mara: "#6060d0",
  Sancti: "#d0d060",
  Vaykor: "#d08040",
  Synoid: "#40d0d0",
  Secura: "#d0d0d0",
  Rakta: "#d04060",
  Telos: "#60d060",
  Dex: "#d060a0",
};
