import { useState, useMemo } from "react";
import { getRelicInfo, getRelicStats } from "../lib/relic";
import relicData from "../data/relic-drops.json";
import "./Relics.css";

// Relic Era Colors
const RELIC_ERA_COLORS = {
  Lith: "#9c7a4a",
  Meso: "#7a9c7a",
  Neo: "#4a7a9c",
  Axi: "#9c4a7a",
};

export default function Relics() {
  const [searchQuery, setSearchQuery] = useState("");
  const stats = useMemo(() => getRelicStats(), []);

  // Get all active relic names
  const allActiveRelics = useMemo(() => {
    return Object.keys(relicData.activeRelics).sort((a, b) => {
      // Sort by era first (Lith, Meso, Neo, Axi), then by code
      const eraOrder = { Lith: 1, Meso: 2, Neo: 3, Axi: 4 };
      const aEra = a.split(" ")[0];
      const bEra = b.split(" ")[0];
      if (eraOrder[aEra] !== eraOrder[bEra]) {
        return eraOrder[aEra] - eraOrder[bEra];
      }
      return a.localeCompare(b);
    });
  }, []);

  // Filter relics based on search
  const filteredRelics = useMemo(() => {
    if (!searchQuery.trim()) {
      return allActiveRelics;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return allActiveRelics.filter(relicName => 
      relicName.toLowerCase().includes(query)
    );
  }, [allActiveRelics, searchQuery]);

  return (
    <div className="relics-page">
      {/* Header */}
      <header className="page-header">
        <div className="page-header__subtitle">Relic Database</div>
        <h1 className="page-header__title">Relics</h1>
        <p className="page-header__description">
          Search for specific relics and find where to farm them. Only active (farmable) relics are shown.
        </p>
      </header>

      {/* Stats */}
      <div className="relics-stats">
        <div className="relics-stat">
          <span className="relics-stat__value">{stats.active}</span>
          <span className="relics-stat__label">Active Relics</span>
        </div>
        <div className="relics-stat">
          <span className="relics-stat__value">{stats.vaulted}</span>
          <span className="relics-stat__label">Vaulted Relics</span>
        </div>
      </div>

      {/* Search */}
      <div className="relics-search">
        <input
          type="text"
          className="relics-search__input"
          placeholder="Search relic (e.g., Axi V10, Lith A1)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Results Counter */}
      <div className="relics-results-counter">
        <span className="relics-results-counter__label">Found</span>
        <span className="relics-results-counter__value">{filteredRelics.length}</span>
      </div>

      {/* Relics List */}
      <div className="relics-list">
        {filteredRelics.length === 0 ? (
          <div className="relics-empty">
            <div className="relics-empty__icon">💎</div>
            <h3 className="relics-empty__title">No relics found</h3>
            <p className="relics-empty__text">
              {searchQuery 
                ? `No active relics match "${searchQuery}". Try a different search term.`
                : "No active relics available."
              }
            </p>
          </div>
        ) : (
          filteredRelics.map((relicName) => {
            const relicInfo = getRelicInfo(relicName);
            const era = relicName.split(" ")[0];
            const code = relicName.split(" ")[1];
            
            return (
              <div key={relicName} className="relic-card">
                <div className="relic-card__header">
                  <div 
                    className="relic-card__era-badge"
                    style={{ backgroundColor: RELIC_ERA_COLORS[era] || "#666" }}
                  >
                    {era}
                  </div>
                  <h2 className="relic-card__name">
                    {relicName}
                  </h2>
                  <span className="relic-card__status-badge relic-card__status-badge--active">
                    Farmable
                  </span>
                </div>

                {relicInfo.dropLocations.length > 0 ? (
                  <div className="relic-card__drops">
                    <h3 className="relic-card__drops-title">Drop Locations</h3>
                    <div className="relic-card__drops-list">
                      {relicInfo.dropLocations.map((drop, index) => (
                        <div key={index} className="relic-drop-item">
                          <div className="relic-drop-item__mission">
                            {drop.mission}
                          </div>
                          {drop.rotation && (
                            <div className="relic-drop-item__rotation">
                              {drop.rotation}
                            </div>
                          )}
                          <div className="relic-drop-item__chance">
                            {drop.chance ? `${drop.chance}%` : "—"}
                          </div>
                          {drop.rarity && (
                            <div className="relic-drop-item__rarity">
                              {drop.rarity}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="relic-card__no-drops">
                    No drop locations available
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

