// Script to extract relic drop locations from official Warframe drop tables
// Source: https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DROP_TABLES_URL = "https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html";

async function extractRelicDrops() {
  console.log("Fetching official Warframe drop tables...\n");
  
  const response = await fetch(DROP_TABLES_URL);
  const html = await response.text();
  
  // Object to store relic drop locations
  // Format: { "Lith A1": [{ mission: "...", rotation: "...", chance: "..." }, ...] }
  const relicDrops = {};
  
  // Set to track all relics mentioned (to identify vaulted ones)
  const allRelicsMentioned = new Set();
  
  // Find all relic names mentioned anywhere in the document
  const allRelicMatches = html.matchAll(/(Lith|Meso|Neo|Axi)\s+(\w+)(?:\s+Relic)?/gi);
  for (const match of allRelicMatches) {
    const era = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    const code = match[2].toUpperCase();
    allRelicsMentioned.add(`${era} ${code}`);
  }
  
  let currentMission = null;
  let currentRotation = null;
  let currentSource = null;
  
  // Process line by line
  const lines = html.split('</tr>');
  
  for (const line of lines) {
    // Check for table headers (mission/bounty/source names)
    const headerMatch = line.match(/<th[^>]*>([^<]+)<\/th>/);
    if (headerMatch) {
      const headerText = headerMatch[1].trim();
      
      // Check if it's a rotation header
      if (headerText.startsWith('Rotation')) {
        currentRotation = headerText;
      } 
      // Check if it's a mission/source header
      else if (headerText.includes('/') || 
               headerText.includes('Bounty') || 
               headerText.includes('Tier') ||
               headerText.includes('Level') ||
               headerText.includes('Stage')) {
        currentMission = headerText;
        currentRotation = null;
      }
      // Other headers might be source categories
      else if (!headerText.includes('colspan') && headerText.length > 3) {
        currentSource = headerText;
      }
    }
    
    // Check for relic drops - more flexible matching
    const relicMatches = line.matchAll(/<td>([^<]*(?:Lith|Meso|Neo|Axi)\s+\w+[^<]*Relic[^<]*)<\/td>\s*<td>([^<]+)<\/td>/gi);
    
    for (const relicMatch of relicMatches) {
      const fullText = relicMatch[1].trim();
      const dropInfo = relicMatch[2].trim();
      
      // Extract relic name
      const relicNameMatch = fullText.match(/(Lith|Meso|Neo|Axi)\s+(\w+)/i);
      if (!relicNameMatch) continue;
      
      const era = relicNameMatch[1].charAt(0).toUpperCase() + relicNameMatch[1].slice(1).toLowerCase();
      const code = relicNameMatch[2].toUpperCase();
      const relicName = `${era} ${code}`;
      
      // Extract chance
      const chanceMatch = dropInfo.match(/\((\d+\.?\d*)%\)/);
      const chance = chanceMatch ? parseFloat(chanceMatch[1]) : null;
      const rarity = dropInfo.split('(')[0].trim();
      
      // Get the source (mission or current source)
      const source = currentMission || currentSource || 'Unknown';
      
      if (!relicDrops[relicName]) {
        relicDrops[relicName] = [];
      }
      
      // Avoid duplicates
      const existing = relicDrops[relicName].find(
        d => d.mission === source && d.rotation === currentRotation
      );
      
      if (!existing && source !== 'Unknown') {
        relicDrops[relicName].push({
          mission: source,
          rotation: currentRotation,
          rarity: rarity,
          chance: chance,
        });
      }
    }
  }
  
  // Sort drop locations by chance (highest first)
  for (const relic of Object.keys(relicDrops)) {
    relicDrops[relic].sort((a, b) => (b.chance || 0) - (a.chance || 0));
    // Limit to top 10 locations per relic
    relicDrops[relic] = relicDrops[relic].slice(0, 10);
  }
  
  // Find relics that are mentioned but have no drop locations (likely vaulted)
  const activeRelics = new Set(Object.keys(relicDrops));
  const vaultedRelics = [...allRelicsMentioned].filter(r => !activeRelics.has(r));
  
  // Stats
  const totalRelics = Object.keys(relicDrops).length;
  const totalDropLocations = Object.values(relicDrops).reduce((sum, arr) => sum + arr.length, 0);
  
  console.log(`✓ Found ${totalRelics} active (farmable) relics`);
  console.log(`✓ Found ${totalDropLocations} drop locations`);
  console.log(`✓ Found ${vaultedRelics.length} potentially vaulted relics`);
  
  // Sample output
  console.log("\n=== Sample Active Relics (first 5) ===");
  const sampleRelics = Object.entries(relicDrops).slice(0, 5);
  for (const [relic, drops] of sampleRelics) {
    console.log(`\n${relic}:`);
    drops.slice(0, 2).forEach(d => {
      console.log(`  - ${d.mission} ${d.rotation ? `(${d.rotation})` : ''} - ${d.chance}%`);
    });
  }
  
  // Save to JSON - include both active relics and vaulted list
  const output = {
    lastUpdated: new Date().toISOString(),
    sourceUrl: DROP_TABLES_URL,
    activeRelics: relicDrops,
    vaultedRelics: vaultedRelics.sort(),
  };
  
  const outPath = join(__dirname, "../src/data/relic-drops.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\n✓ Saved to src/data/relic-drops.json`);
  
  return output;
}

extractRelicDrops().catch(console.error);

