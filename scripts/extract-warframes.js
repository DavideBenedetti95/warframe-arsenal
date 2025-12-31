import Items from "@wfcd/items";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const items = new Items();

// Helper to create a URL-friendly slug
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Get variant type
function getVariantType(name) {
  if (name.includes(" Prime")) return "Prime";
  if (name.includes(" Umbra")) return "Umbra";
  return null;
}

// Get base warframe name
function getBaseWarframeName(name) {
  return name
    .replace(/ Prime$/, "")
    .replace(/ Umbra$/, "");
}

// Build map of warframe names for finding variants
const warframeNames = new Set(
  items
    .filter(i => i.category === "Warframes" && i.type === "Warframe")
    .map(i => i.name)
);

// Find variants for a warframe
function findVariants(warframeName) {
  const baseName = getBaseWarframeName(warframeName);
  const variants = [];
  
  const variantPatterns = [
    `${baseName} Prime`,
    `${baseName} Umbra`,
  ];
  
  for (const pattern of variantPatterns) {
    if (warframeNames.has(pattern) && pattern !== warframeName) {
      variants.push({
        name: pattern,
        slug: createSlug(pattern),
        type: getVariantType(pattern),
      });
    }
  }
  
  // Also add the base warframe if this is a variant
  if (getVariantType(warframeName) && warframeNames.has(baseName)) {
    variants.unshift({
      name: baseName,
      slug: createSlug(baseName),
      type: "Base",
    });
  }
  
  return variants;
}

// Parse relic name
function parseRelicName(relicString) {
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

// Extract components with relic info
function extractComponents(warframe) {
  if (!warframe.components || warframe.components.length === 0) return [];
  
  return warframe.components
    .filter(comp => comp.name && !comp.name.includes("Orokin") && !comp.name.includes("Argon"))
    .map(comp => {
      const relicDrops = {};
      
      if (comp.drops) {
        for (const drop of comp.drops) {
          if (drop.location && drop.location.includes("Relic")) {
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
              relicDrops[key].chances[relicInfo.refinement] = drop.chance;
            }
          }
        }
      }
      
      return {
        name: comp.name,
        fullName: `${warframe.name} ${comp.name}`,
        ducats: comp.ducats || comp.primeSellingPrice || null,
        tradable: comp.tradable || false,
        relics: Object.values(relicDrops),
      };
    });
}

// Extract abilities
function extractAbilities(warframe) {
  if (!warframe.abilities) return [];
  
  return warframe.abilities.map(ability => ({
    name: ability.name,
    description: ability.description || null,
  }));
}

// Get acquisition info
function getAcquisitionInfo(warframe) {
  const acquisition = [];
  
  // Market
  if (warframe.marketCost) {
    acquisition.push({
      type: "Market",
      method: "Acquisto diretto",
      detail: `${warframe.marketCost} Platinum`,
    });
  }
  
  // Blueprint cost
  if (warframe.bpCost) {
    acquisition.push({
      type: "Blueprint",
      method: "Market Blueprint",
      detail: `${warframe.bpCost} Credits`,
    });
  }
  
  // Check drops directly on warframe
  const drops = warframe.drops || [];
  for (const drop of drops.slice(0, 5)) {
    if (drop.location) {
      acquisition.push({
        type: drop.type || "Drop",
        method: drop.location.split(",")[0],
        detail: drop.location,
        chance: drop.chance ? `${(drop.chance * 100).toFixed(2)}%` : null,
      });
    }
  }
  
  // For non-Prime warframes, also check component drops (e.g., Nokko, Oraxia bounties)
  if (!warframe.isPrime && warframe.components) {
    const componentDropLocations = new Set();
    
    for (const comp of warframe.components) {
      if (comp.drops && comp.drops.length > 0) {
        for (const drop of comp.drops) {
          // Skip if it's a relic drop
          if (drop.location && !drop.location.includes("Relic")) {
            // Create a unique key to avoid duplicates
            const locationKey = drop.location.split(",")[0];
            if (!componentDropLocations.has(locationKey)) {
              componentDropLocations.add(locationKey);
              acquisition.push({
                type: "Bounty",
                method: locationKey,
                detail: drop.location,
                chance: drop.chance ? `${(drop.chance * 100).toFixed(2)}%` : null,
              });
            }
          }
        }
      }
    }
  }
  
  // For Prime warframes
  if (warframe.isPrime) {
    if (acquisition.length === 0) {
      acquisition.push({
        type: "Void Relic",
        method: "Void Fissure",
        detail: "Ottieni i componenti dalle Void Relics",
      });
    }
  }
  
  return acquisition;
}

function normalizeWarframe(warframe) {
  return {
    name: warframe.name,
    slug: createSlug(warframe.name),
    masteryReq: typeof warframe.masteryReq === "number" ? warframe.masteryReq : 0,
    description: warframe.description || null,
    imageUrl: warframe.imageName
      ? `https://cdn.warframestat.us/img/${warframe.imageName}`
      : null,
    wikiUrl: warframe.wikiaUrl || null,
    
    // Stats
    health: warframe.health || 0,
    shield: warframe.shield || 0,
    armor: warframe.armor || 0,
    energy: warframe.power || 0,
    sprint: warframe.sprint || 1,
    
    // Abilities
    abilities: extractAbilities(warframe),
    passiveDescription: warframe.passiveDescription || null,
    
    // Variant info
    isPrime: warframe.isPrime || false,
    variantType: getVariantType(warframe.name),
    variants: findVariants(warframe.name),
    
    // Acquisition
    acquisition: getAcquisitionInfo(warframe),
    components: extractComponents(warframe),
    
    // Build info
    buildTime: warframe.buildTime || null,
    buildPrice: warframe.buildPrice || null,
    
    // Status
    vaulted: warframe.vaulted || false,
    sex: warframe.sex || null,
    introduced: warframe.introduced?.name || null,
    
    // Polarities
    polarities: warframe.polarities || [],
    aura: warframe.aura || null,
  };
}

// Get all warframes (excluding special ones like Helminth)
const warframes = items
  .filter(i => 
    i.category === "Warframes" && 
    i.type === "Warframe" &&
    !i.name.includes("Helminth") &&
    !i.name.includes("Bonewidow") && // Necramech
    !i.name.includes("Voidrig") // Necramech
  )
  .map(normalizeWarframe)
  .sort((a, b) => a.name.localeCompare(b.name));

const outPath = join(__dirname, "../src/data/warframes.json");
writeFileSync(outPath, JSON.stringify(warframes, null, 2));

// Stats
const primeCount = warframes.filter(w => w.isPrime).length;

console.log(`✓ Extracted ${warframes.length} warframes to src/data/warframes.json`);
console.log(`  - ${primeCount} Prime warframes with relic drop info`);
console.log(`  Including: stats, abilities, variants, acquisition methods`);

