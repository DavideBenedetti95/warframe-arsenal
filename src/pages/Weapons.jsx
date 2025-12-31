import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getWeapons, VARIANT_COLORS } from "../lib/weapon";
import "./Weapons.css";

// Mastery Rank icon SVG
const MRIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="weapon-card__mr-icon">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--wf-gold)" />
  </svg>
);

// Available weapon types per slot
const WEAPON_TYPES = {
  Primary: ["Rifle", "Shotgun", "Sniper", "Bow", "Launcher"],
  Secondary: ["Pistol", "Dual Pistols", "Throwing"],
};

// All variant types
const VARIANT_TYPES = [
  { id: "Base", label: "Base", color: "#808080" },
  { id: "Prime", label: "Prime", color: VARIANT_COLORS.Prime },
  { id: "Kuva", label: "Kuva", color: VARIANT_COLORS.Kuva },
  { id: "Tenet", label: "Tenet", color: VARIANT_COLORS.Tenet },
  { id: "Wraith", label: "Wraith", color: VARIANT_COLORS.Wraith },
  { id: "Vandal", label: "Vandal", color: VARIANT_COLORS.Vandal },
  { id: "Prisma", label: "Prisma", color: VARIANT_COLORS.Prisma },
  { id: "Syndicate", label: "Sindacato", color: "#8080d0" },
];

// Syndicate variant types for grouping
const SYNDICATE_VARIANTS = ["Mara", "Rakta", "Sancti", "Secura", "Synoid", "Telos", "Vaykor"];

export default function Weapons() {
  const [mr, setMr] = useState(8);
  const [slot, setSlot] = useState("Primary");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const weapons = useMemo(() => getWeapons(), []);

  const availableTypes = WEAPON_TYPES[slot] || [];

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleVariant = (variant) => {
    setSelectedVariants((prev) =>
      prev.includes(variant) ? prev.filter((v) => v !== variant) : [...prev, variant]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedVariants([]);
    setSearchQuery("");
  };

  const matchesVariant = (weapon) => {
    if (selectedVariants.length === 0) return true;
    const weaponVariant = weapon.variantType || "Base";
    if (selectedVariants.includes("Syndicate")) {
      if (SYNDICATE_VARIANTS.includes(weaponVariant)) return true;
    }
    if (selectedVariants.includes(weaponVariant)) return true;
    if (selectedVariants.includes("Base") && !weapon.variantType) return true;
    return false;
  };

  const filtered = useMemo(() => {
    return weapons
      .filter((w) => w.slot === slot)
      .filter((w) => w.masteryReq <= mr)
      .filter((w) => selectedTypes.length === 0 || selectedTypes.includes(w.type))
      .filter(matchesVariant)
      .filter((w) => 
        searchQuery === "" || 
        w.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.masteryReq - b.masteryReq || a.name.localeCompare(b.name));
  }, [weapons, mr, slot, selectedTypes, selectedVariants, searchQuery]);

  const hasActiveFilters = selectedTypes.length > 0 || selectedVariants.length > 0 || searchQuery !== "";

  return (
    <div className="weapons-page">
      {/* Header */}
      <header className="page-header">
        <div className="page-header__subtitle">Arsenal Database</div>
        <h1 className="page-header__title">Armi</h1>
        <p className="page-header__description">
          Scopri le armi disponibili per il tuo livello di Mastery Rank
        </p>
      </header>

      {/* Main Controls */}
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

        <div className="slot-group">
          <button
            className={`slot-btn ${slot === "Primary" ? "slot-btn--active" : ""}`}
            onClick={() => {
              setSlot("Primary");
              setSelectedTypes([]);
            }}
          >
            Primarie
          </button>
          <button
            className={`slot-btn ${slot === "Secondary" ? "slot-btn--active" : ""}`}
            onClick={() => {
              setSlot("Secondary");
              setSelectedTypes([]);
            }}
          >
            Secondarie
          </button>
        </div>

        <div className="search-group">
          <input
            type="text"
            className="search-input"
            placeholder="Cerca arma..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="results-counter">
          <span className="results-counter__label">Armi trovate</span>
          <span className="results-counter__value">{filtered.length}</span>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="filters">
        <div className="filter-group">
          <span className="filter-group__label">Tipo</span>
          <div className="filter-chips">
            {availableTypes.map((type) => (
              <button
                key={type}
                className={`filter-chip ${selectedTypes.includes(type) ? "filter-chip--active" : ""}`}
                onClick={() => toggleType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

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

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            ✕ Rimuovi filtri
          </button>
        )}
      </div>

      {/* Weapons Grid */}
      <div className="weapons-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">⚔</div>
            <h3 className="empty-state__title">Nessuna arma trovata</h3>
            <p className="empty-state__text">
              {hasActiveFilters 
                ? "Prova a rimuovere alcuni filtri"
                : "Aumenta il tuo Mastery Rank per sbloccare nuove armi"
              }
            </p>
          </div>
        ) : (
          filtered.map((w, index) => (
            <Link
              key={`${w.slot}-${w.name}`}
              to={`/weapon/${w.slug}`}
              className="weapon-card"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              <div className="weapon-card__inner">
                <div className="weapon-card__image-wrapper">
                  {w.imageUrl ? (
                    <img
                      src={w.imageUrl}
                      alt={w.name}
                      className="weapon-card__image"
                      loading="lazy"
                    />
                  ) : (
                    <span className="weapon-card__no-image">?</span>
                  )}
                </div>
                <div className="weapon-card__info">
                  <div className="weapon-card__name-row">
                    <h3 className="weapon-card__name">{w.name}</h3>
                    {w.variantType && (
                      <span 
                        className="weapon-card__variant"
                        style={{ backgroundColor: VARIANT_COLORS[w.variantType] || "#666" }}
                      >
                        {w.variantType}
                      </span>
                    )}
                  </div>
                  <div className="weapon-card__meta">
                    <div className="weapon-card__mr">
                      <MRIcon />
                      <span>MR</span>
                      <span className="weapon-card__mr-value">{w.masteryReq}</span>
                    </div>
                    <span className="weapon-card__slot">
                      {w.type || (w.slot === "Primary" ? "Primaria" : "Secondaria")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="weapon-card__arrow">→</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

