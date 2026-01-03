import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <NavLink to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⚔</span>
          <span className="navbar__logo-text">Arsenal</span>
        </NavLink>
        
        <div className="navbar__links">
          <NavLink 
            to="/weapons" 
            className={({ isActive }) => `navbar__link ${isActive ? "navbar__link--active" : ""}`}
          >
            Weapons
          </NavLink>
          <NavLink 
            to="/warframes" 
            className={({ isActive }) => `navbar__link ${isActive ? "navbar__link--active" : ""}`}
          >
            Warframes
          </NavLink>
          <NavLink 
            to="/relics" 
            className={({ isActive }) => `navbar__link ${isActive ? "navbar__link--active" : ""}`}
          >
            Relics
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

