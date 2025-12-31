import Items from "@wfcd/items";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const items = new Items({
  category: ["Primary", "Secondary"],
});

const weapons = items
  .filter((i) => i?.name && (i.category === "Primary" || i.category === "Secondary"))
  .map((item) => ({
    name: item.name,
    masteryReq: typeof item.masteryReq === "number" ? item.masteryReq : 0,
    slot: item.category,
    imageUrl: item.imageName
      ? `https://cdn.warframestat.us/img/${item.imageName}`
      : null,
  }));

const outPath = join(__dirname, "../src/data/weapons.json");
writeFileSync(outPath, JSON.stringify(weapons, null, 2));

console.log(`✓ Extracted ${weapons.length} weapons to src/data/weapons.json`);

