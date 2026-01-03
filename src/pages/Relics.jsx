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

const ERAS = ["Lith", "Meso", "Neo", "Axi"];

export default function Relics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEras, setSelectedEras] = useState([]);
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

  // Toggle era filter
  const toggleEra = (era) => {
    setSelectedEras((prev) =>
      prev.includes(era) ? prev.filter((e) => e !== era) : [...prev, era]
    );
  };

  // Filter relics based on search and era filters
  const filteredRelics = useMemo(() => {
    let filtered = allActiveRelics;
    
    // Filter by era if any selected
    if (selectedEras.length > 0) {
      filtered = filtered.filter(relicName => {
        const era = relicName.split(" ")[0];
        return selectedEras.includes(era);
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(relicName => 
        relicName.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [allActiveRelics, searchQuery, selectedEras]);

  const hasActiveFilters = selectedEras.length > 0 || searchQuery.trim() !== "";
  const showInitialState = !hasActiveFilters;

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

      {/* Search and Filters */}
      <div className="relics-controls">
        <div className="relics-search">
          <input
            type="text"
            className="relics-search__input"
            placeholder="Search relic (e.g., Axi V10, Lith A1)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relics-era-filters">
          <span className="relics-era-filters__label">Filter by Era:</span>
          <div className="relics-era-filters__chips">
            {ERAS.map((era) => (
              <button
                key={era}
                className={`relics-era-chip ${selectedEras.includes(era) ? "relics-era-chip--active" : ""}`}
                style={{ "--era-color": RELIC_ERA_COLORS[era] }}
                onClick={() => toggleEra(era)}
              >
                {era}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="relics-results-counter">
            <span className="relics-results-counter__label">Found</span>
            <span className="relics-results-counter__value">{filteredRelics.length}</span>
          </div>
        )}
      </div>

      {/* Relics List */}
      <div className="relics-list">
        {showInitialState ? (
          <div className="relics-initial-state">
            <div className="relics-initial-state__icon">💎</div>
            <h3 className="relics-initial-state__title">Search for a Relic</h3>
            <p className="relics-initial-state__text">
              Enter a relic name in the search box above (e.g., "Axi V10" or "Lith A1") 
              to find where it drops, or use the era filters to browse by category.
            </p>
            <div className="relics-initial-state__examples">
              <span className="relics-initial-state__example-label">Try searching:</span>
              <div className="relics-initial-state__example-chips">
                <button 
                  className="relics-example-chip"
                  onClick={() => setSearchQuery("Axi V10")}
                >
                  Axi V10
                </button>
                <button 
                  className="relics-example-chip"
                  onClick={() => setSearchQuery("Lith A1")}
                >
                  Lith A1
                </button>
                <button 
                  className="relics-example-chip"
                  onClick={() => setSearchQuery("Neo Z1")}
                >
                  Neo Z1
                </button>
              </div>
            </div>
          </div>
        ) : filteredRelics.length === 0 ? (
          <div className="relics-empty">
            <div className="relics-empty__icon">💎</div>
            <h3 className="relics-empty__title">No relics found</h3>
            <p className="relics-empty__text">
              {searchQuery 
                ? `No active relics match "${searchQuery}". Try a different search term.`
                : "No relics match the selected filters. Try different era filters."
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
                    <div className="relic-card__drops-header">
                      <h3 className="relic-card__drops-title">Drop Locations</h3>
                      <span className="relic-card__drops-count">
                        {relicInfo.dropLocations.length} location{relicInfo.dropLocations.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="relic-card__drops-list">
                      {relicInfo.dropLocations.map((drop, index) => (
                        <div key={index} className="relic-drop-item">
                          <div className="relic-drop-item__main">
                            <div className="relic-drop-item__mission">
                              {drop.mission}
                            </div>
                            {drop.rotation && (
                              <div className="relic-drop-item__rotation">
                                {drop.rotation}
                              </div>
                            )}
                          </div>
                          <div className="relic-drop-item__meta">
                            <div className="relic-drop-item__chance">
                              {drop.chance ? `${drop.chance}%` : "—"}
                            </div>
                            {drop.rarity && (
                              <div className="relic-drop-item__rarity">
                                {drop.rarity}
                              </div>
                            )}
                          </div>
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

