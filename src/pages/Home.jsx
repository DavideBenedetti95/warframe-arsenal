import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-hero__title">Warframe Arsenal</h1>
        <p className="home-hero__subtitle">
          Complete database of weapons and Warframes for Warframe. 
          Filter by Mastery Rank, discover stats, components, and how to obtain every item.
        </p>
        <div className="home-hero__actions">
          <Link to="/weapons" className="home-hero__button home-hero__button--primary">
            <span className="home-hero__button-icon">⚔</span>
            <span>Weapons</span>
          </Link>
          <Link to="/warframes" className="home-hero__button home-hero__button--secondary">
            <span className="home-hero__button-icon">🎭</span>
            <span>Warframes</span>
          </Link>
        </div>
      </div>

      <div className="home-features">
        <div className="home-features__grid">
          <div className="home-feature">
            <div className="home-feature__icon">🔫</div>
            <h3 className="home-feature__title">600+ Weapons</h3>
            <p className="home-feature__description">
              Browse Primary, Secondary, and Melee weapons with detailed stats, 
              variants, and acquisition methods.
            </p>
          </div>
          
          <div className="home-feature">
            <div className="home-feature__icon">🎭</div>
            <h3 className="home-feature__title">All Warframes</h3>
            <p className="home-feature__description">
              Explore Base, Prime, and Umbra variants with complete stats, 
              abilities, and component locations.
            </p>
          </div>
          
          <div className="home-feature">
            <div className="home-feature__icon">⭐</div>
            <h3 className="home-feature__title">Mastery Rank Filter</h3>
            <p className="home-feature__description">
              Filter items by your Mastery Rank to see only what you can unlock 
              at your current level.
            </p>
          </div>
          
          <div className="home-feature">
            <div className="home-feature__icon">💎</div>
            <h3 className="home-feature__title">Relic Tracking</h3>
            <p className="home-feature__description">
              Find which relics drop Prime parts, their locations, and whether 
              they're currently farmable or vaulted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

