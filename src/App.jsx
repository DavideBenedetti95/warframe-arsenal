import { useMemo, useState } from "react";
import { getWeapons } from "./lib/weapon";
import "./App.css";

// Mastery Rank icon SVG
const MRIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="weapon-card__mr-icon">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--wf-gold)" />
  </svg>
);

export default function App() {
  const [mr, setMr] = useState(8);
  const [slot, setSlot] = useState("Primary");

  const weapons = useMemo(() => getWeapons(), []);

  const filtered = useMemo(() => {
    return weapons
      .filter((w) => w.slot === slot)
      .filter((w) => w.masteryReq <= mr)
      .sort((a, b) => a.masteryReq - b.masteryReq || a.name.localeCompare(b.name));
  }, [weapons, mr, slot]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header__subtitle">Arsenal Database</div>
        <h1 className="header__title">Mastery Rank</h1>
        <p className="header__description">
          Scopri le armi disponibili per il tuo livello di Mastery Rank
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

        <div className="slot-group">
          <button
            className={`slot-btn ${slot === "Primary" ? "slot-btn--active" : ""}`}
            onClick={() => setSlot("Primary")}
          >
            Primarie
          </button>
          <button
            className={`slot-btn ${slot === "Secondary" ? "slot-btn--active" : ""}`}
            onClick={() => setSlot("Secondary")}
          >
            Secondarie
          </button>
        </div>

        <div className="results-counter">
          <span className="results-counter__label">Armi trovate</span>
          <span className="results-counter__value">{filtered.length}</span>
        </div>
      </div>

      {/* Weapons Grid */}
      <div className="weapons-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">⚔</div>
            <h3 className="empty-state__title">Nessuna arma trovata</h3>
            <p className="empty-state__text">
              Aumenta il tuo Mastery Rank per sbloccare nuove armi
            </p>
          </div>
        ) : (
          filtered.map((w, index) => (
            <article
              key={`${w.slot}-${w.name}`}
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
                  <h3 className="weapon-card__name">{w.name}</h3>
                  <div className="weapon-card__meta">
                    <div className="weapon-card__mr">
                      <MRIcon />
                      <span>MR</span>
                      <span className="weapon-card__mr-value">{w.masteryReq}</span>
                    </div>
                    <span className="weapon-card__slot">
                      {w.slot === "Primary" ? "Primaria" : "Secondaria"}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
