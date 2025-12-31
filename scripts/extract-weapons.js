import Items from "@wfcd/items";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load all items
const allItems = new Items();

const items = new Items({
  category: ["Primary", "Secondary"],
});

// Helper to create a URL-friendly slug
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper to detect weapon variant type
function getVariantType(name) {
  if (name.includes(" Prime")) return "Prime";
  if (name.includes("Kuva ")) return "Kuva";
  if (name.includes("Tenet ")) return "Tenet";
  if (name.includes(" Wraith")) return "Wraith";
  if (name.includes(" Vandal")) return "Vandal";
  if (name.includes(" Prisma")) return "Prisma";
  if (name.includes("Mara ")) return "Mara";
  if (name.includes("Sancti ")) return "Sancti";
  if (name.includes("Vaykor ")) return "Vaykor";
  if (name.includes("Synoid ")) return "Synoid";
  if (name.includes("Secura ")) return "Secura";
  if (name.includes("Rakta ")) return "Rakta";
  if (name.includes("Telos ")) return "Telos";
  if (name.includes(" Dex")) return "Dex";
  if (name.includes("MK1-")) return "MK1";
  return null;
}

// Helper to get base weapon name
function getBaseWeaponName(name) {
  return name
    .replace(/ Prime$/, "")
    .replace(/^Kuva /, "")
    .replace(/^Tenet /, "")
    .replace(/ Wraith$/, "")
    .replace(/ Vandal$/, "")
    .replace(/ Prisma$/, "")
    .replace(/^Mara /, "")
    .replace(/^Sancti /, "")
    .replace(/^Vaykor /, "")
    .replace(/^Synoid /, "")
    .replace(/^Secura /, "")
    .replace(/^Rakta /, "")
    .replace(/^Telos /, "")
    .replace(/ Dex$/, "")
    .replace(/^MK1-/, "");
}

// Build a map of weapon names for finding variants
const weaponNames = new Set(
  items
    .filter((i) => i?.name && (i.category === "Primary" || i.category === "Secondary"))
    .map((i) => i.name)
);

// Find variants for a weapon
function findVariants(weaponName) {
  const baseName = getBaseWeaponName(weaponName);
  const variants = [];
  
  const variantPatterns = [
    `${baseName} Prime`,
    `Kuva ${baseName}`,
    `Tenet ${baseName}`,
    `${baseName} Wraith`,
    `${baseName} Vandal`,
    `Prisma ${baseName}`,
    `${baseName} Prisma`,
    `Mara ${baseName}`,
    `Sancti ${baseName}`,
    `Vaykor ${baseName}`,
    `Synoid ${baseName}`,
    `Secura ${baseName}`,
    `Rakta ${baseName}`,
    `Telos ${baseName}`,
    `${baseName} Dex`,
    `MK1-${baseName}`,
  ];
  
  for (const pattern of variantPatterns) {
    if (weaponNames.has(pattern) && pattern !== weaponName) {
      variants.push({
        name: pattern,
        slug: createSlug(pattern),
        type: getVariantType(pattern),
      });
    }
  }
  
  // Also add the base weapon if this is a variant
  if (getVariantType(weaponName) && weaponNames.has(baseName)) {
    variants.unshift({
      name: baseName,
      slug: createSlug(baseName),
      type: "Base",
    });
  }
  
  return variants;
}

// Extract damage info
function extractDamage(item) {
  if (!item.damageTypes) return null;
  
  const damageTypes = {};
  let totalDamage = 0;
  
  for (const [type, value] of Object.entries(item.damageTypes)) {
    if (value > 0) {
      damageTypes[type] = value;
      totalDamage += value;
    }
  }
  
  return {
    total: Math.round(totalDamage * 100) / 100,
    types: damageTypes,
  };
}

// Extract attack stats
function extractAttackStats(item) {
  return {
    fireRate: item.fireRate || null,
    criticalChance: item.criticalChance || null,
    criticalMultiplier: item.criticalMultiplier || null,
    statusChance: item.procChance || item.statusChance || null,
    magazine: item.magazineSize || null,
    reload: item.reloadTime || null,
    accuracy: item.accuracy || null,
    multishot: item.multishot || null,
    punchThrough: item.punchThrough || null,
    noise: item.noise || null,
    trigger: item.trigger || null,
  };
}

// Parse relic name to extract era and code
function parseRelicName(relicString) {
  // "Axi A17 Relic (Radiant)" -> { era: "Axi", code: "A17", refinement: "Radiant" }
  const match = relicString.match(/^(Lith|Meso|Neo|Axi|Requiem)\s+(\w+)\s+Relic(?:\s+\((\w+)\))?/i);
  if (match) {
    return {
      era: match[1],
      code: match[2],
      refinement: match[3] || "Intact",
      fullName: `${match[1]} ${match[2]}`,
    };
  }
  return null;
}

// Extract component info with detailed drop locations
function extractComponents(item) {
  if (!item.components || item.components.length === 0) return [];
  
  return item.components.map(comp => {
    // Group drops by relic
    const relicDrops = {};
    // Track mission/location drops (non-relic)
    const missionDrops = [];
    
    if (comp.drops) {
      for (const drop of comp.drops) {
        if (drop.location && drop.location.includes("Relic")) {
          // Relic drop
          const relicInfo = parseRelicName(drop.location);
          if (relicInfo) {
            const key = relicInfo.fullName;
            if (!relicDrops[key]) {
              relicDrops[key] = {
                relic: relicInfo.fullName,
                era: relicInfo.era,
                code: relicInfo.code,
                rarity: drop.rarity,
                chances: {},
              };
            }
            // Store chance by refinement level
            relicDrops[key].chances[relicInfo.refinement] = drop.chance;
          }
        } else if (drop.location) {
          // Mission/Location drop (non-relic)
          missionDrops.push({
            location: drop.location,
            chance: drop.chance,
            rarity: drop.rarity,
            type: drop.type,
          });
        }
      }
    }
    
    return {
      name: comp.name,
      fullName: `${item.name} ${comp.name}`,
      count: comp.itemCount || 1,
      ducats: comp.ducats || comp.primeSellingPrice || null,
      tradable: comp.tradable || false,
      relics: Object.values(relicDrops),
      drops: missionDrops, // Add mission drops
    };
  }).filter(c => c.name);
}

// Map ClanTech path to lab name
function getDojoLab(uniqueName) {
  if (!uniqueName || !uniqueName.includes("ClanTech")) return null;
  
  const labMatch = uniqueName.match(/ClanTech\/(\w+)\//);
  if (!labMatch) return null;
  
  const labMap = {
    "Bio": "Bio Lab",
    "Chemical": "Chem Lab", 
    "Energy": "Energy Lab",
    "Orokin": "Orokin Lab",
    "Tenno": "Tenno Lab",
  };
  
  return labMap[labMatch[1]] || `${labMatch[1]} Lab`;
}

// Get acquisition method based on weapon type
function getAcquisitionInfo(item) {
  const acquisition = [];
  
  // Check if it's a Clan Dojo weapon first
  const dojoLab = getDojoLab(item.uniqueName);
  
  // Market purchase
  if (item.marketCost) {
    acquisition.push({
      type: "Market",
      method: "Acquisto diretto",
      detail: `${item.marketCost} Platinum`,
    });
  }
  
  // Blueprint - check if it's from Dojo or Market
  if (item.bpCost) {
    if (dojoLab) {
      // Clan Dojo weapon - blueprint comes from research
      acquisition.push({
        type: "Clan Research",
        method: `Dojo - ${dojoLab}`,
        detail: `Replica: ${item.bpCost} Credits`,
      });
    } else {
      // Regular market blueprint
      acquisition.push({
        type: "Blueprint",
        method: "Market Blueprint",
        detail: `${item.bpCost} Credits`,
      });
    }
  }
  
  // Check for clan research in drops (for items without uniqueName indicator)
  const drops = item.drops || [];
  const clanDrop = drops.find(d => d.location && d.location.includes("Clan"));
  if (clanDrop && !dojoLab) {
    acquisition.push({
      type: "Research",
      method: "Clan Dojo",
      detail: clanDrop.location,
    });
  }
  
  // Check for quest rewards
  const questDrop = drops.find(d => d.location && (d.location.includes("Quest") || d.type === "Quest"));
  if (questDrop) {
    acquisition.push({
      type: "Quest",
      method: "Quest Reward",
      detail: questDrop.location,
    });
  }
  
  // Check for special sources
  const specialSources = drops.filter(d => 
    d.location && 
    !d.location.includes("Relic") && 
    !d.location.includes("Clan") &&
    !d.location.includes("Quest")
  ).slice(0, 5); // Limit to avoid huge lists
  
  for (const source of specialSources) {
    if (source.location) {
      acquisition.push({
        type: source.type || "Drop",
        method: source.location.split(",")[0], // Mission/enemy name
        detail: source.location,
        chance: source.chance ? `${(source.chance * 100).toFixed(2)}%` : null,
      });
    }
  }
  
  // Check for component drops from missions (like Higasa from Shrine Defense)
  if (item.components) {
    const componentDropLocations = new Set();
    for (const comp of item.components) {
      if (comp.drops) {
        for (const drop of comp.drops) {
          if (drop.location && !drop.location.includes("Relic")) {
            componentDropLocations.add(drop.location);
          }
        }
      }
    }
    // Add unique drop locations as acquisition methods
    for (const location of componentDropLocations) {
      // Don't add if we already have this location
      const alreadyHas = acquisition.some(a => a.detail && a.detail.includes(location));
      if (!alreadyHas) {
        acquisition.push({
          type: "Mission Drop",
          method: location.split("/").pop().split(" (")[0] || location,
          detail: location,
        });
      }
    }
  }
  
  // For Prime weapons without explicit acquisition, they come from relics (components)
  if (acquisition.length === 0 && item.isPrime) {
    acquisition.push({
      type: "Void Relic",
      method: "Void Fissure",
      detail: "Ottieni i componenti dalle Void Relics",
    });
  }
  
  // For Kuva weapons
  if (item.name?.startsWith("Kuva ")) {
    acquisition.push({
      type: "Kuva Lich",
      method: "Kuva Lich",
      detail: "Sconfiggi un Kuva Lich che brandisce quest'arma",
    });
  }
  
  // For Tenet weapons
  if (item.name?.startsWith("Tenet ")) {
    acquisition.push({
      type: "Sister of Parvos",
      method: "Sister of Parvos",
      detail: "Sconfiggi una Sister of Parvos o acquista da Ergo Glast",
    });
  }
  
  return acquisition;
}

function normalizeWeapon(item) {
  return {
    name: item.name,
    slug: createSlug(item.name),
    masteryReq: typeof item.masteryReq === "number" ? item.masteryReq : 0,
    slot: item.category,
    type: item.type || null,
    description: item.description || null,
    imageUrl: item.imageName
      ? `https://cdn.warframestat.us/img/${item.imageName}`
      : null,
    wikiUrl: item.wikiaUrl || null,
    damage: extractDamage(item),
    attackStats: extractAttackStats(item),
    polarities: item.polarities || [],
    variantType: getVariantType(item.name),
    variants: findVariants(item.name),
    isPrime: item.isPrime || false,
    acquisition: getAcquisitionInfo(item),
    components: extractComponents(item),
    buildTime: item.buildTime || null,
    buildPrice: item.buildPrice || null,
    skipBuildTimePrice: item.skipBuildTimePrice || null,
    vaulted: item.vaulted || false,
    tradable: item.tradable || false,
    introduced: item.introduced?.name || null,
    disposition: item.disposition || null,
  };
}

const weapons = items
  .filter((i) => i?.name && (i.category === "Primary" || i.category === "Secondary"))
  .map(normalizeWeapon);

const outPath = join(__dirname, "../src/data/weapons.json");
writeFileSync(outPath, JSON.stringify(weapons, null, 2));

// Calculate some stats
const primeCount = weapons.filter(w => w.isPrime).length;
const withComponents = weapons.filter(w => w.components.length > 0).length;

console.log(`✓ Extracted ${weapons.length} weapons to src/data/weapons.json`);
console.log(`  - ${primeCount} Prime weapons with relic drop info`);
console.log(`  - ${withComponents} weapons with crafting components`);
console.log(`  Including: damage, stats, variants, relics, acquisition methods`);
