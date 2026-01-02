import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getWarframeBySlug, WARFRAME_VARIANT_COLORS, WARFRAME_STATS } from "../lib/warframe";
import { getRelicInfo } from "../lib/relic";
import "./WarframeDetail.css";

// Relic Era Colors
const RELIC_ERA_COLORS = {
  Lith: "#9c7a4a",
  Meso: "#7a9c7a",
  Neo: "#4a7a9c",
  Axi: "#9c4a7a",
};

// Rarity Colors
const RARITY_COLORS = {
  Common: "#c2a36e",
  Uncommon: "#b0b0b0",
  Rare: "#e8c252",
};

// MR Icon
const MRIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--wf-gold)" />
  </svg>
);

export default function WarframeDetail() {
  const { slug } = useParams();
  const warframe = getWarframeBySlug(slug);
  const [showOnlyFarmable, setShowOnlyFarmable] = useState(false);

  if (!warframe) {
    return (
      <div className="warframe-detail">
        <div className="warframe-detail__not-found">
          <h1>Warframe non trovato</h1>
          <p>Il Warframe richiesto non esiste nel database.</p>
          <Link to="/warframes" className="back-btn">← Torna ai Warframes</Link>
        </div>
      </div>
    );
  }

  const { abilities, variants, acquisition, components } = warframe;

  return (
    <div className="warframe-detail">
      {/* Back Navigation */}
      <Link to="/warframes" className="back-btn">
        <span className="back-btn__arrow">←</span>
        <span>Warframes</span>
      </Link>

      {/* Header Section */}
      <header className="warframe-header">
        <div className="warframe-header__image-container">
          {warframe.imageUrl ? (
            <img src={warframe.imageUrl} alt={warframe.name} className="warframe-header__image" />
          ) : (
            <div className="warframe-header__no-image">?</div>
          )}
        </div>
        
        <div className="warframe-header__info">
          <div className="warframe-header__meta">
            {warframe.variantType && (
              <span 
                className="warframe-header__variant-badge"
                style={{ backgroundColor: WARFRAME_VARIANT_COLORS[warframe.variantType] || "#666" }}
              >
                {warframe.variantType}
              </span>
            )}
            {warframe.sex && <span className="warframe-header__sex">{warframe.sex}</span>}
            {warframe.vaulted && <span className="warframe-header__vaulted">Vaulted</span>}
          </div>
          
          <h1 className="warframe-header__name">{warframe.name}</h1>
          
          <div className="warframe-header__mr">
            <MRIcon />
            <span>Mastery Rank {warframe.masteryReq}</span>
          </div>
          
          {warframe.description && (
            <p className="warframe-header__description">{warframe.description}</p>
          )}
          
          {warframe.wikiUrl && (
            <a href={warframe.wikiUrl} target="_blank" rel="noopener noreferrer" className="wiki-link">
              Leggi su Wiki →
            </a>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Base Stats */}
        <section className="stat-card">
          <h2 className="stat-card__title">Base Statistics</h2>
          <div className="base-stats">
            {WARFRAME_STATS.map((stat) => (
              <div key={stat.key} className="base-stat">
                <div className="base-stat__header">
                  <span className="base-stat__icon">{stat.icon}</span>
                  <span className="base-stat__label">{stat.label}</span>
                </div>
                <div className="base-stat__bar-container">
                  <div 
                    className="base-stat__bar"
                    style={{ 
                      width: `${Math.min((warframe[stat.key] / (stat.key === 'sprint' ? 1.5 : 600)) * 100, 100)}%`,
                      backgroundColor: stat.color
                    }}
                  />
                </div>
                <span className="base-stat__value" style={{ color: stat.color }}>
                  {stat.key === 'sprint' ? warframe[stat.key].toFixed(2) : warframe[stat.key]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Passive */}
        {warframe.passiveDescription && (
          <section className="stat-card">
            <h2 className="stat-card__title">Passiva</h2>
            <p className="passive-text">{warframe.passiveDescription}</p>
          </section>
        )}

        {/* Abilities */}
        {abilities.length > 0 && (
          <section className="stat-card stat-card--wide">
            <h2 className="stat-card__title">Abilities</h2>
            <div className="abilities-grid">
              {abilities.map((ability, i) => (
                <div key={i} className="ability-card">
                  <div className="ability-card__number">{i + 1}</div>
                  <div className="ability-card__content">
                    <h3 className="ability-card__name">{ability.name}</h3>
                    {ability.description && (
                      <p className="ability-card__description">{ability.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Acquisition */}
        {acquisition.length > 0 && (
          <section className="stat-card">
            <h2 className="stat-card__title">How to Obtain</h2>
            <div className="acquisition-list">
              {acquisition.map((acq, i) => (
                <div key={i} className="acquisition-item">
                  <span className="acquisition-item__type">{acq.type}</span>
                  <div className="acquisition-item__info">
                    <span className="acquisition-item__method">{acq.method}</span>
                    {acq.detail !== acq.method && (
                      <span className="acquisition-item__detail">{acq.detail}</span>
                    )}
                  </div>
                  {acq.chance && <span className="acquisition-item__chance">{acq.chance}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Prime Components with Relic Info */}
        {warframe.isPrime && components.length > 0 && (
          <section className="stat-card stat-card--full">
            <h2 className="stat-card__title">Components & Relics</h2>
            <div className="relic-controls">
              <span className="relic-status-legend">
                <span className="relic-status-active">● Farmable</span>
                <span className="relic-status-vaulted">● Vaulted</span>
              </span>
              <label className="relic-filter-toggle">
                <input 
                  type="checkbox" 
                  checked={showOnlyFarmable}
                  onChange={(e) => setShowOnlyFarmable(e.target.checked)}
                />
                <span className="relic-filter-toggle__slider"></span>
                <span className="relic-filter-toggle__label">Farmable only</span>
              </label>
            </div>
            <div className="components-grid">
              {components.map((comp, i) => {
                // Filter relics based on toggle
                const filteredRelics = showOnlyFarmable 
                  ? comp.relics.filter(r => getRelicInfo(`${r.era} ${r.code}`).isActive)
                  : comp.relics;
                
                return (
                <div key={i} className="component-card">
                  <div className="component-card__header">
                    <span className="component-card__name">{comp.fullName}</span>
                    {comp.ducats && (
                      <span className="component-card__ducats">{comp.ducats} Ducats</span>
                    )}
                  </div>
                  
                  {filteredRelics.length > 0 ? (
                    <div className="relics-list">
                      {filteredRelics.map((relic, j) => {
                        const relicInfo = getRelicInfo(`${relic.era} ${relic.code}`);
                        const isVaulted = !relicInfo.isActive;
                        
                        return (
                          <div 
                            key={j} 
                            className={`relic-item ${isVaulted ? 'relic-item--vaulted' : 'relic-item--active'}`}
                            style={{ borderLeftColor: isVaulted ? '#666' : RELIC_ERA_COLORS[relic.era] || "#666" }}
                          >
                            <div className="relic-item__main">
                              <span 
                                className="relic-item__era"
                                style={{ backgroundColor: RELIC_ERA_COLORS[relic.era] || "#666" }}
                              >
                                {relic.era}
                              </span>
                              <span className="relic-item__name">{relic.code}</span>
                              <span 
                                className="relic-item__rarity"
                                style={{ color: RARITY_COLORS[relic.rarity] }}
                              >
                                {relic.rarity}
                              </span>
                              {isVaulted ? (
                                <span className="relic-item__vaulted-badge">Vaulted</span>
                              ) : (
                                <span className="relic-item__active-badge">Farmable</span>
                              )}
                              <a 
                                href={`https://wiki.warframe.com/w/${relic.era}_${relic.code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relic-item__wiki-link"
                                title="Apri su Wiki"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Wiki ↗
                              </a>
                            </div>
                            
                            {/* Show drop locations for active relics */}
                            {!isVaulted && relicInfo.dropLocations.length > 0 && (
                              <div className="relic-item__farms">
                                <span className="relic-item__farms-label">Dove farmare:</span>
                                {relicInfo.dropLocations.slice(0, 3).map((loc, k) => (
                                  <div key={k} className="relic-farm-location">
                                    <span className="relic-farm-location__mission">{loc.mission}</span>
                                    {loc.rotation && (
                                      <span className="relic-farm-location__rotation">{loc.rotation}</span>
                                    )}
                                    {loc.chance && (
                                      <span className="relic-farm-location__chance">{loc.chance}%</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Show relic drop chances */}
                            {relic.chances && Object.keys(relic.chances).length > 0 && (
                              <div className="relic-item__chances">
                                <span className="relic-item__chances-label">Drop da reliquia:</span>
                                {Object.entries(relic.chances).map(([refinement, chance]) => (
                                  <span key={refinement} className="relic-chance">
                                    {refinement}: {(chance * 100).toFixed(1)}%
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="component-card__no-relics">
                      {showOnlyFarmable ? "No farmable relics" : "No relics available"}
                    </p>
                  )}
                </div>
              );
              })}
            </div>
          </section>
        )}

        {/* Variants */}
        {variants.length > 0 && (
          <section className="stat-card">
            <h2 className="stat-card__title">Varianti</h2>
            <div className="variants-list">
              {variants.map((variant) => (
                <Link 
                  key={variant.slug} 
                  to={`/warframe/${variant.slug}`}
                  className="variant-link"
                  style={{ borderColor: WARFRAME_VARIANT_COLORS[variant.type] || "#666" }}
                >
                  <span 
                    className="variant-link__badge"
                    style={{ backgroundColor: WARFRAME_VARIANT_COLORS[variant.type] || "#666" }}
                  >
                    {variant.type}
                  </span>
                  <span className="variant-link__name">{variant.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Polarities */}
        {warframe.polarities && warframe.polarities.length > 0 && (
          <section className="stat-card">
            <h2 className="stat-card__title">Polarità</h2>
            <div className="polarities-list">
              {warframe.polarities.map((polarity, i) => (
                <span key={i} className="polarity-badge">
                  {polarity}
                </span>
              ))}
            </div>
            {warframe.aura && (
              <div className="aura-info">
                <span className="aura-info__label">Aura:</span>
                <span className="aura-info__value">{warframe.aura}</span>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

