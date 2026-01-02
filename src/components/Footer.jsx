import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__disclaimer">
          <h3 className="footer__title">Disclaimer</h3>
          <p className="footer__text">
            <strong>Warframe Arsenal is a non-commercial, fan-made project.</strong> This site is 
            <strong> not affiliated with, endorsed by, or sponsored by Digital Extremes Ltd</strong>. 
            This project is <strong>completely free, contains no advertisements, and is not monetized</strong> in any way.
          </p>
          <p className="footer__text">
            Digital Extremes Ltd, Warframe and the logo Warframe are registered trademarks. 
            All rights are reserved worldwide. All artwork, screenshots, characters or other recognizable 
            features of the intellectual property relating to these trademarks are the intellectual property 
            of Digital Extremes Ltd.
          </p>
        </div>
        
        <div className="footer__links">
          <Link to="/terms" className="footer__link">Terms of Service</Link>
          <span className="footer__separator">•</span>
          <Link to="/privacy" className="footer__link">Privacy Policy</Link>
          <span className="footer__separator">•</span>
          <a 
            href="https://www.warframe.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__link"
          >
            Warframe Official
          </a>
          <span className="footer__separator">•</span>
          <a 
            href="https://github.com/DavideBenedetti95/warframe-arsenal" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
        </div>
        
        <div className="footer__copyright">
          <p>© {new Date().getFullYear()} Warframe Arsenal - Fan Project</p>
          <p className="footer__note">Not affiliated with Digital Extremes Ltd.</p>
        </div>
      </div>
    </footer>
  );
}

