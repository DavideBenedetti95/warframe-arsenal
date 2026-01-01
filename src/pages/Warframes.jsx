import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getWarframes, WARFRAME_VARIANT_COLORS } from "../lib/warframe";
import "./Warframes.css";

// Mastery Rank icon SVG
const MRIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="warframe-card__mr-icon">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--wf-gold)" />
  </svg>
);

// Variant types
const VARIANT_TYPES = [
  { id: "Base", label: "Base", color: "#808080" },
  { id: "Prime", label: "Prime", color: WARFRAME_VARIANT_COLORS.Prime },
  { id: "Umbra", label: "Umbra", color: WARFRAME_VARIANT_COLORS.Umbra },
];

// Vault status options
const VAULT_STATUS = [
  { id: "vaulted", label: "Vaulted", color: "#b8860b" },
  { id: "available", label: "Non Vaulted", color: "#2ecc71" },
];

export default function Warframes() {
  const [mr, setMr] = useState(8);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedVaultStatus, setSelectedVaultStatus] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const warframes = useMemo(() => getWarframes(), []);

  // Toggle variant filter
  const toggleVariant = (variant) => {
    setSelectedVariants((prev) =>
      prev.includes(variant) ? prev.filter((v) => v !== variant) : [...prev, variant]
    );
  };

  // Toggle vault status filter
  const toggleVaultStatus = (status) => {
    setSelectedVaultStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedVariants([]);
    setSelectedVaultStatus([]);
    setSearchQuery("");
  };

  // Check if warframe matches variant filter
  const matchesVariant = (warframe) => {
    if (selectedVariants.length === 0) return true;
    const wfVariant = warframe.variantType || "Base";
    return selectedVariants.includes(wfVariant);
  };

  // Check if warframe matches vault status filter
  const matchesVaultStatus = (warframe) => {
    if (selectedVaultStatus.length === 0) return true;
    const isVaulted = warframe.vaulted === true;
    if (selectedVaultStatus.includes("vaulted") && isVaulted) return true;
    if (selectedVaultStatus.includes("available") && !isVaulted) return true;
    return false;
  };

  const filtered = useMemo(() => {
    return warframes
      .filter((w) => w.masteryReq <= mr)
      .filter(matchesVariant)
      .filter(matchesVaultStatus)
      .filter((w) => 
        searchQuery === "" || 
        w.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [warframes, mr, selectedVariants, selectedVaultStatus, searchQuery]);

  const hasActiveFilters = selectedVariants.length > 0 || selectedVaultStatus.length > 0 || searchQuery !== "";

  return (
    <div className="warframes-page">
      {/* Header */}
      <header className="page-header">
        <div className="page-header__subtitle">Arsenal Database</div>
        <h1 className="page-header__title">Warframes</h1>
        <p className="page-header__description">
          Esplora tutti i Warframe disponibili e le loro varianti
        </p>
      </header>

      {/* Controls */}
      <div className="controls">
        <div className="mr-group">
          <label className="mr-label" htmlFor="mr-input">
            Mastery Rank
          </label>
          <div className="mr-input-wrapper">
            <input
              id="mr-input"
              type="number"
              className="mr-input"
              min={0}
              max={30}
              value={mr}
              onChange={(e) => setMr(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
            />
          </div>
        </div>

        <div className="search-group">
          <input
            type="text"
            className="search-input"
            placeholder="Cerca Warframe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="results-counter">
          <span className="results-counter__label">Trovati</span>
          <span className="results-counter__value">{filtered.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <span className="filter-group__label">Variante</span>
          <div className="filter-chips">
            {VARIANT_TYPES.map((variant) => (
              <button
                key={variant.id}
                className={`filter-chip ${selectedVariants.includes(variant.id) ? "filter-chip--active" : ""}`}
                style={{ "--chip-color": variant.color }}
                onClick={() => toggleVariant(variant.id)}
              >
                {variant.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-group__label">Vault Status</span>
          <div className="filter-chips">
            {VAULT_STATUS.map((status) => (
              <button
                key={status.id}
                className={`filter-chip ${selectedVaultStatus.includes(status.id) ? "filter-chip--active" : ""}`}
                style={{ "--chip-color": status.color }}
                onClick={() => toggleVaultStatus(status.id)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            ✕ Rimuovi filtri
          </button>
        )}
      </div>

      {/* Warframes Grid */}
      <div className="warframes-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🎭</div>
            <h3 className="empty-state__title">Nessun Warframe trovato</h3>
            <p className="empty-state__text">
              {hasActiveFilters 
                ? "Prova a rimuovere alcuni filtri"
                : "Aumenta il tuo Mastery Rank per sbloccare nuovi Warframe"
              }
            </p>
          </div>
        ) : (
          filtered.map((w, index) => (
            <Link
              key={w.slug}
              to={`/warframe/${w.slug}`}
              className="warframe-card"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              <div className="warframe-card__image-container">
                {w.imageUrl ? (
                  <img
                    src={w.imageUrl}
                    alt={w.name}
                    className="warframe-card__image"
                    loading="lazy"
                  />
                ) : (
                  <span className="warframe-card__no-image">?</span>
                )}
                {w.vaulted && <span className="warframe-card__vaulted">Vaulted</span>}
              </div>
              
              <div className="warframe-card__info">
                <div className="warframe-card__name-row">
                  <h3 className="warframe-card__name">{w.name}</h3>
                  {w.variantType && (
                    <span 
                      className="warframe-card__variant"
                      style={{ backgroundColor: WARFRAME_VARIANT_COLORS[w.variantType] || "#666" }}
                    >
                      {w.variantType}
                    </span>
                  )}
                </div>
                
                <div className="warframe-card__stats">
                  <span className="warframe-card__stat" title="Salute">
                    <span style={{ color: "#d04040" }}>❤️</span> {w.health}
                  </span>
                  <span className="warframe-card__stat" title="Scudo">
                    <span style={{ color: "#4080d0" }}>🛡️</span> {w.shield}
                  </span>
                  <span className="warframe-card__stat" title="Armatura">
                    <span style={{ color: "#d0a040" }}>🔰</span> {w.armor}
                  </span>
                </div>
                
                <div className="warframe-card__mr">
                  <MRIcon />
                  <span>MR {w.masteryReq}</span>
                </div>
              </div>
              
              <div className="warframe-card__arrow">→</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

