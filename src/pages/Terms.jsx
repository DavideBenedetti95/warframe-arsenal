import { Link } from "react-router-dom";
import "./Terms.css";

export default function Terms() {
  return (
    <div className="terms-page">
      <Link to="/" className="back-btn">
        <span className="back-btn__arrow">←</span>
        Home
      </Link>

      <header className="terms-header">
        <h1 className="terms-header__title">Terms of Service</h1>
        <p className="terms-header__updated">Last updated: {new Date().toLocaleDateString('it-IT')}</p>
      </header>

      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Warframe Arsenal ("the Website"), you accept and agree to be bound by 
            the terms and provisions of this agreement. If you do not agree to abide by these terms, 
            please do not use this Website.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Nature of the Service</h2>
          <p>
            Warframe Arsenal is a <strong>non-commercial, fan-made project</strong> created for informational 
            and entertainment purposes only. This Website is:
          </p>
          <ul>
            <li><strong>Not affiliated with, endorsed by, or sponsored by Digital Extremes Ltd.</strong></li>
            <li><strong>Completely free</strong> - no cost to use any features</li>
            <li><strong>No advertisements</strong> - this site contains zero ads, ad networks, or sponsored content</li>
            <li><strong>Not monetized</strong> - no subscriptions, paid features, donations, or revenue of any kind</li>
            <li><strong>Open-source</strong> - available on GitHub for the community</li>
            <li><strong>Fan-made</strong> - developed and maintained by fans of the Warframe game, for fans</li>
          </ul>
          <p>
            This is a passion project created to help the Warframe community, with no commercial interests whatsoever.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Intellectual Property</h2>
          <p>
            All Warframe-related content, including but not limited to:
          </p>
          <ul>
            <li>The Warframe name, logo, and trademarks</li>
            <li>Game assets, artwork, and images</li>
            <li>Character names and descriptions</li>
            <li>Weapon names, statistics, and related information</li>
            <li>Warframe names, abilities, and related information</li>
          </ul>
          <p>
            Are the intellectual property of <strong>Digital Extremes Ltd</strong>. All rights are reserved 
            by their respective owners. This Website uses such content under fair use principles for 
            informational and non-commercial purposes only.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Disclaimer of Warranties</h2>
          <p>
            THE WEBSITE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, 
            EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
          </p>
          <ul>
            <li>The information provided is accurate, complete, or up-to-date</li>
            <li>The Website will be available at all times without interruption</li>
            <li>The Website will be free of errors or defects</li>
            <li>Game data reflects the current state of Warframe</li>
          </ul>
          <p>
            Game information is sourced from community-maintained databases and may not always reflect 
            the latest game updates. For official and accurate information, please refer to the 
            <a href="https://www.warframe.com" target="_blank" rel="noopener noreferrer"> official Warframe website</a> or 
            <a href="https://wiki.warframe.com" target="_blank" rel="noopener noreferrer"> Warframe Wiki</a>.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL THE WEBSITE CREATORS, CONTRIBUTORS, OR MAINTAINERS BE LIABLE FOR ANY 
            DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF 
            OR RELATED TO YOUR USE OF THE WEBSITE, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>Errors or inaccuracies in game information</li>
            <li>Any decisions made based on information from this Website</li>
            <li>Loss of data or service interruptions</li>
            <li>Any other damages arising from use of the Website</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>6. Data Sources</h2>
          <p>
            Game data displayed on this Website is sourced from:
          </p>
          <ul>
            <li>
              <a href="https://github.com/WFCD/warframe-items" target="_blank" rel="noopener noreferrer">
                WFCD/warframe-items
              </a> - Community-maintained Warframe data repository
            </li>
            <li>
              <a href="https://warframestat.us" target="_blank" rel="noopener noreferrer">
                warframestat.us
              </a> - Warframe statistics and images API
            </li>
          </ul>
          <p>
            We are grateful to the Warframe Community Developers (WFCD) for maintaining these resources.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. User Conduct</h2>
          <p>
            By using this Website, you agree not to:
          </p>
          <ul>
            <li>Attempt to gain unauthorized access to the Website's systems</li>
            <li>Use the Website for any unlawful purpose</li>
            <li>Misrepresent the Website as an official Digital Extremes product</li>
            <li>Use automated systems to scrape or collect data in a way that impacts performance</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately 
            upon posting to the Website. Your continued use of the Website following any changes 
            constitutes acceptance of those changes.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Contact</h2>
          <p>
            For questions about these Terms of Service or the Website, please visit our 
            <a href="https://github.com/DavideBenedetti95/warframe-arsenal" target="_blank" rel="noopener noreferrer">
              {" "}GitHub repository
            </a>.
          </p>
        </section>

        <section className="terms-section terms-section--highlight">
          <h2>Digital Extremes Disclaimer</h2>
          <p>
            Digital Extremes Ltd, Warframe and the logo Warframe are registered trademarks. 
            All rights are reserved worldwide. This site has no official link with Digital Extremes Ltd 
            or Warframe. All artwork, screenshots, characters or other recognizable features of the 
            intellectual property relating to these trademarks are likewise the intellectual property 
            of Digital Extremes Ltd.
          </p>
        </section>
      </div>
    </div>
  );
}

