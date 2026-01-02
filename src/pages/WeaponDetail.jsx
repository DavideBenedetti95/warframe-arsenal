import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getWeaponBySlug, DAMAGE_COLORS, DAMAGE_LABELS, VARIANT_COLORS } from "../lib/weapon";
import { getRelicInfo } from "../lib/relic";
import "./WeaponDetail.css";

// Stat formatting helpers
const formatPercent = (value) => value ? `${(value * 100).toFixed(1)}%` : "—";
const formatNumber = (value, decimals = 1) => value ? value.toFixed(decimals) : "—";

// MR Icon
const MRIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--wf-gold)" />
  </svg>
);

// Relic Era Colors
const RELIC_ERA_COLORS = {
  Lith: "#9c7a4a",
  Meso: "#7a9c7a",
  Neo: "#4a7a9c",
  Axi: "#9c4a7a",
  Requiem: "#9c4a4a",
};

// Rarity Colors
const RARITY_COLORS = {
  Common: "#c2a36e",
  Uncommon: "#b0b0b0",
  Rare: "#e8c252",
};

export default function WeaponDetail() {
  const { slug } = useParams();
  const weapon = getWeaponBySlug(slug);
  const [showOnlyFarmable, setShowOnlyFarmable] = useState(false);

  if (!weapon) {
    return (
      <div className="weapon-detail">
        <div className="weapon-detail__not-found">
          <h1>Arma non trovata</h1>
          <p>L'arma richiesta non esiste nel database.</p>
          <Link to="/" className="back-btn">← Torna all'Arsenal</Link>
        </div>
      </div>
    );
  }

  const { damage, attackStats, variants, acquisition, components } = weapon;

  return (
    <div className="weapon-detail">
      {/* Back Navigation */}
      <Link to="/" className="back-btn">
        <span className="back-btn__arrow">←</span>
        <span>Arsenal</span>
      </Link>

      {/* Header Section */}
      <header className="weapon-header">
        <div className="weapon-header__image-container">
          {weapon.imageUrl ? (
            <img src={weapon.imageUrl} alt={weapon.name} className="weapon-header__image" />
          ) : (
            <div className="weapon-header__no-image">?</div>
          )}
        </div>
        
        <div className="weapon-header__info">
          <div className="weapon-header__meta">
            {weapon.variantType && (
              <span 
                className="weapon-header__variant-badge"
                style={{ backgroundColor: VARIANT_COLORS[weapon.variantType] || "#666" }}
              >
                {weapon.variantType}
              </span>
            )}
            <span className="weapon-header__type">{weapon.type || weapon.slot}</span>
            {weapon.vaulted && <span className="weapon-header__vaulted">Vaulted</span>}
          </div>
          
          <h1 className="weapon-header__name">{weapon.name}</h1>
          
          <div className="weapon-header__mr">
            <MRIcon />
            <span>Mastery Rank {weapon.masteryReq}</span>
          </div>
          
          {weapon.description && (
            <p className="weapon-header__description">{weapon.description}</p>
          )}
          
          {weapon.wikiUrl && (
            <a href={weapon.wikiUrl} target="_blank" rel="noopener noreferrer" className="wiki-link">
              Leggi su Wiki →
            </a>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Damage Section */}
        {damage && damage.total > 0 && (
          <section className="stat-card">
            <h2 className="stat-card__title">Damage</h2>
            <div className="damage-total">
              <span className="damage-total__value">{damage.total}</span>
              <span className="damage-total__label">Total Damage</span>
            </div>
            <div className="damage-types">
              {Object.entries(damage.types).map(([type, value]) => (
                <div key={type} className="damage-type">
                  <div className="damage-type__bar-container">
                    <div 
                      className="damage-type__bar"
                      style={{ 
                        width: `${(value / damage.total) * 100}%`,
                        backgroundColor: DAMAGE_COLORS[type] || "#888"
                      }}
                    />
                  </div>
                  <span className="damage-type__name" style={{ color: DAMAGE_COLORS[type] }}>
                    {DAMAGE_LABELS[type] || type}
                  </span>
                  <span className="damage-type__value">{value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Attack Stats */}
        {attackStats && (
          <section className="stat-card">
            <h2 className="stat-card__title">Statistics</h2>
            <div className="stats-list">
              {/* Common Stats */}
              {attackStats.criticalChance && (
                <div className="stat-row">
                  <span className="stat-row__label">Critical Chance</span>
                  <span className="stat-row__value stat-row__value--crit">
                    {formatPercent(attackStats.criticalChance)}
                  </span>
                </div>
              )}
              {attackStats.criticalMultiplier && (
                <div className="stat-row">
                  <span className="stat-row__label">Critical Multiplier</span>
                  <span className="stat-row__value stat-row__value--crit">
                    {formatNumber(attackStats.criticalMultiplier, 1)}x
                  </span>
                </div>
              )}
              {attackStats.statusChance && (
                <div className="stat-row">
                  <span className="stat-row__label">Status Chance</span>
                  <span className="stat-row__value stat-row__value--status">
                    {formatPercent(attackStats.statusChance)}
                  </span>
                </div>
              )}
              
              {/* Melee-specific Stats */}
              {weapon.isMelee && (
                <>
                  {attackStats.attackSpeed && (
                    <div className="stat-row">
                      <span className="stat-row__label">Attack Speed</span>
                      <span className="stat-row__value">{formatNumber(attackStats.attackSpeed, 2)}</span>
                    </div>
                  )}
                  {attackStats.range && (
                    <div className="stat-row">
                      <span className="stat-row__label">Range</span>
                      <span className="stat-row__value">{formatNumber(attackStats.range, 2)}m</span>
                    </div>
                  )}
                  {attackStats.comboDuration && (
                    <div className="stat-row">
                      <span className="stat-row__label">Combo Duration</span>
                      <span className="stat-row__value">{formatNumber(attackStats.comboDuration, 0)}s</span>
                    </div>
                  )}
                  {attackStats.followThrough && (
                    <div className="stat-row">
                      <span className="stat-row__label">Follow Through</span>
                      <span className="stat-row__value">{formatNumber(attackStats.followThrough, 1)}</span>
                    </div>
                  )}
                  {attackStats.slamAttack && (
                    <div className="stat-row">
                      <span className="stat-row__label">Slam Attack</span>
                      <span className="stat-row__value">{formatNumber(attackStats.slamAttack, 0)}</span>
                    </div>
                  )}
                  {attackStats.slamRadius && (
                    <div className="stat-row">
                      <span className="stat-row__label">Slam Radius</span>
                      <span className="stat-row__value">{formatNumber(attackStats.slamRadius, 1)}m</span>
                    </div>
                  )}
                  {attackStats.heavyAttack && (
                    <div className="stat-row">
                      <span className="stat-row__label">Heavy Attack</span>
                      <span className="stat-row__value">{formatNumber(attackStats.heavyAttack, 0)}</span>
                    </div>
                  )}
                  {attackStats.windUp && (
                    <div className="stat-row">
                      <span className="stat-row__label">Heavy Wind Up</span>
                      <span className="stat-row__value">{formatNumber(attackStats.windUp, 2)}s</span>
                    </div>
                  )}
                  {attackStats.blockAngle && (
                    <div className="stat-row">
                      <span className="stat-row__label">Block Angle</span>
                      <span className="stat-row__value">{attackStats.blockAngle}°</span>
                    </div>
                  )}
                  {attackStats.stancePolarity && (
                    <div className="stat-row">
                      <span className="stat-row__label">Stance Polarity</span>
                      <span className="stat-row__value stat-row__value--polarity">{attackStats.stancePolarity}</span>
                    </div>
                  )}
                </>
              )}
              
              {/* Ranged-specific Stats */}
              {!weapon.isMelee && (
                <>
                  {attackStats.fireRate && (
                    <div className="stat-row">
                      <span className="stat-row__label">Fire Rate</span>
                      <span className="stat-row__value">{formatNumber(attackStats.fireRate, 2)}/s</span>
                    </div>
                  )}
                  {attackStats.magazine && (
                    <div className="stat-row">
                      <span className="stat-row__label">Magazine</span>
                      <span className="stat-row__value">{attackStats.magazine}</span>
                    </div>
                  )}
                  {attackStats.reload && (
                    <div className="stat-row">
                      <span className="stat-row__label">Reload</span>
                      <span className="stat-row__value">{formatNumber(attackStats.reload, 1)}s</span>
                    </div>
                  )}
                  {attackStats.accuracy && (
                    <div className="stat-row">
                      <span className="stat-row__label">Accuracy</span>
                      <span className="stat-row__value">{formatNumber(attackStats.accuracy, 1)}</span>
                    </div>
                  )}
                  {attackStats.multishot && attackStats.multishot > 1 && (
                    <div className="stat-row">
                      <span className="stat-row__label">Multishot</span>
                      <span className="stat-row__value">{formatNumber(attackStats.multishot, 1)}</span>
                    </div>
                  )}
                  {attackStats.trigger && (
                    <div className="stat-row">
                      <span className="stat-row__label">Trigger</span>
                      <span className="stat-row__value">{attackStats.trigger}</span>
                    </div>
                  )}
                  {attackStats.noise && (
                    <div className="stat-row">
                      <span className="stat-row__label">Noise</span>
                      <span className="stat-row__value">{attackStats.noise}</span>
                    </div>
                  )}
                </>
              )}
              
              {weapon.disposition && (
                <div className="stat-row">
                  <span className="stat-row__label">Riven Disposition</span>
                  <span className="stat-row__value">{"●".repeat(weapon.disposition)}{"○".repeat(5 - weapon.disposition)}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Acquisition Methods */}
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
        {weapon.isPrime && components.length > 0 && (
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

        {/* Non-Prime Crafting Components */}
        {!weapon.isPrime && components.length > 0 && (
          <section className="stat-card stat-card--full">
            <h2 className="stat-card__title">Crafting Components</h2>
            {components.some(c => c.drops && c.drops.length > 0) && (
              <p className="stat-card__hint">Components can be obtained from the indicated missions</p>
            )}
            <div className="components-grid">
              {components.map((comp, i) => (
                <div key={i} className="component-card">
                  <div className="component-card__header">
                    <span className="component-card__name">{comp.name}</span>
                    <span className="component-card__count">{comp.count}x</span>
                  </div>
                  
                  {comp.drops && comp.drops.length > 0 ? (
                    <div className="drops-list">
                      {comp.drops.map((drop, j) => (
                        <div key={j} className="drop-item">
                          <div className="drop-item__location">{drop.location}</div>
                          <div className="drop-item__meta">
                            {drop.rarity && (
                              <span 
                                className="drop-item__rarity"
                                style={{ color: RARITY_COLORS[drop.rarity] }}
                              >
                                {drop.rarity}
                              </span>
                            )}
                            {drop.chance && (
                              <span className="drop-item__chance">
                                {(drop.chance * 100).toFixed(2)}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="component-card__no-relics">Risorsa standard</p>
                  )}
                </div>
              ))}
            </div>
            {weapon.buildTime && (
              <div className="build-info">
                <span>Tempo di costruzione: {Math.floor(weapon.buildTime / 3600)}h</span>
                {weapon.buildPrice && <span>Costo: {weapon.buildPrice} Credits</span>}
              </div>
            )}
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
                  to={`/weapon/${variant.slug}`}
                  className="variant-link"
                  style={{ borderColor: VARIANT_COLORS[variant.type] || "#666" }}
                >
                  <span 
                    className="variant-link__badge"
                    style={{ backgroundColor: VARIANT_COLORS[variant.type] || "#666" }}
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
        {weapon.polarities && weapon.polarities.length > 0 && (
          <section className="stat-card">
            <h2 className="stat-card__title">Polarità</h2>
            <div className="polarities-list">
              {weapon.polarities.map((polarity, i) => (
                <span key={i} className="polarity-badge">
                  {polarity}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
