// Relic drop location utilities
import relicData from "../data/relic-drops.json";

/**
 * Check if a relic is active (farmable) or vaulted
 * @param {string} relicName - e.g. "Lith A1" or "Axi A17"
 * @returns {boolean} - true if active, false if vaulted
 */
export function isRelicActive(relicName) {
  // Normalize the relic name (e.g., "Lith A1" from "Lith A1 Relic")
  const normalized = normalizeRelicName(relicName);
  return normalized in relicData.activeRelics;
}

/**
 * Check if a relic is vaulted
 * @param {string} relicName - e.g. "Lith A1" or "Axi A17"
 * @returns {boolean} - true if vaulted
 */
export function isRelicVaulted(relicName) {
  const normalized = normalizeRelicName(relicName);
  return relicData.vaultedRelics.includes(normalized);
}

/**
 * Get drop locations for an active relic
 * @param {string} relicName - e.g. "Lith A1"
 * @returns {Array} - Array of drop locations with mission, rotation, rarity, chance
 */
export function getRelicDropLocations(relicName) {
  const normalized = normalizeRelicName(relicName);
  return relicData.activeRelics[normalized] || [];
}

/**
 * Get the best mission to farm a relic (highest drop chance)
 * @param {string} relicName - e.g. "Lith A1"
 * @returns {Object|null} - Best drop location or null if vaulted
 */
export function getBestRelicFarm(relicName) {
  const locations = getRelicDropLocations(relicName);
  return locations.length > 0 ? locations[0] : null;
}

/**
 * Normalize relic name to standard format
 * @param {string} relicName - Various formats like "Lith A1 Relic", "Lith A1", "LITH A1"
 * @returns {string} - Normalized format "Lith A1"
 */
export function normalizeRelicName(relicName) {
  if (!relicName) return "";
  
  // Remove " Relic" suffix if present
  let name = relicName.replace(/\s+Relic$/i, "").trim();
  
  // Extract era and code
  const match = name.match(/(Lith|Meso|Neo|Axi)\s+(\w+)/i);
  if (!match) return name;
  
  const era = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
  const code = match[2].toUpperCase();
  
  return `${era} ${code}`;
}

/**
 * Get relic status with all info
 * @param {string} relicName - e.g. "Lith A1"
 * @returns {Object} - { name, isActive, isVaulted, dropLocations, bestFarm }
 */
export function getRelicInfo(relicName) {
  const normalized = normalizeRelicName(relicName);
  const isActive = isRelicActive(relicName);
  const isVaulted = isRelicVaulted(relicName);
  const dropLocations = getRelicDropLocations(relicName);
  
  return {
    name: normalized,
    isActive,
    isVaulted,
    dropLocations,
    bestFarm: dropLocations[0] || null,
  };
}

/**
 * Get last update date of relic data
 * @returns {string} - ISO date string
 */
export function getRelicDataLastUpdated() {
  return relicData.lastUpdated;
}

/**
 * Get count of active vs vaulted relics
 * @returns {Object} - { active, vaulted }
 */
export function getRelicStats() {
  return {
    active: Object.keys(relicData.activeRelics).length,
    vaulted: relicData.vaultedRelics.length,
  };
}

