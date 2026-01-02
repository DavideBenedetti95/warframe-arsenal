import { Link } from "react-router-dom";
import "./Privacy.css";

export default function Privacy() {
  return (
    <div className="privacy-page">
      <Link to="/" className="back-btn">
        <span className="back-btn__arrow">←</span>
        Home
      </Link>

      <header className="privacy-header">
        <h1 className="privacy-header__title">Privacy Policy</h1>
        <p className="privacy-header__updated">Last updated: {new Date().toLocaleDateString('en-US')}</p>
      </header>

      <div className="privacy-content">
        <section className="privacy-section">
          <h2>1. Introduction</h2>
          <p>
            Warframe Arsenal ("the Website", "we", "us") is a <strong>non-commercial, fan-made project</strong> 
            created for informational and entertainment purposes only. This Privacy Policy explains how we handle 
            information when you use our Website.
          </p>
          <p>
            <strong>Important:</strong> This Website is <strong>not affiliated with, endorsed by, or sponsored 
            by Digital Extremes Ltd</strong>. It is a fan-made project developed and maintained by members of 
            the Warframe community.
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. No Data Collection</h2>
          <p>
            Warframe Arsenal <strong>does not collect, store, or process any personal information</strong> from 
            visitors. This Website:
          </p>
          <ul>
            <li><strong>Does not use cookies</strong> for tracking or analytics</li>
            <li><strong>Does not require registration</strong> or account creation</li>
            <li><strong>Does not collect email addresses</strong> or contact information</li>
            <li><strong>Does not use third-party analytics</strong> or tracking services</li>
            <li><strong>Does not display advertisements</strong> (no ads, no ad networks, no monetization)</li>
            <li><strong>Does not sell or share data</strong> with third parties (because we don't collect any)</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>3. Hosting and Infrastructure</h2>
          <p>
            This Website is hosted on <strong>GitHub Pages</strong>, a static website hosting service. 
            GitHub may collect certain technical information (such as IP addresses) as part of their 
            standard hosting services. For information about GitHub's privacy practices, please refer to 
            <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" 
               target="_blank" rel="noopener noreferrer"> GitHub's Privacy Statement</a>.
          </p>
          <p>
            We do not have access to or control over any information that GitHub may collect as part of 
            their hosting services.
          </p>
        </section>

        <section className="privacy-section">
          <h2>4. External Links and Resources</h2>
          <p>
            This Website may contain links to external websites and resources, including:
          </p>
          <ul>
            <li>
              <a href="https://www.warframe.com" target="_blank" rel="noopener noreferrer">
                Official Warframe website
              </a>
            </li>
            <li>
              <a href="https://wiki.warframe.com" target="_blank" rel="noopener noreferrer">
                Warframe Wiki
              </a>
            </li>
            <li>
              <a href="https://github.com/WFCD" target="_blank" rel="noopener noreferrer">
                Warframe Community Developers (WFCD)
              </a>
            </li>
            <li>
              <a href="https://warframestat.us" target="_blank" rel="noopener noreferrer">
                warframestat.us (for game images)
              </a>
            </li>
          </ul>
          <p>
            We are not responsible for the privacy practices or content of these external websites. 
            We encourage you to review their privacy policies if you visit them.
          </p>
        </section>

        <section className="privacy-section">
          <h2>5. Game Data and Images</h2>
          <p>
            This Website displays game-related information and images sourced from:
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
              </a> - Warframe statistics and images CDN
            </li>
          </ul>
          <p>
            All game data, images, and content displayed on this Website are the intellectual property 
            of <strong>Digital Extremes Ltd</strong>. We use this content under fair use principles for 
            informational and non-commercial purposes only.
          </p>
        </section>

        <section className="privacy-section">
          <h2>6. No Monetization</h2>
          <p>
            <strong>Warframe Arsenal is completely non-monetized:</strong>
          </p>
          <ul>
            <li>No advertisements of any kind</li>
            <li>No affiliate links or sponsored content</li>
            <li>No premium features or subscriptions</li>
            <li>No donations or payment processing</li>
            <li>No data collection for commercial purposes</li>
          </ul>
          <p>
            This is a free, open-source project created by fans, for fans.
          </p>
        </section>

        <section className="privacy-section">
          <h2>7. Browser Storage</h2>
          <p>
            This Website may use your browser's local storage to remember your preferences (such as 
            Mastery Rank filter settings) for a better user experience. This information is stored 
            locally on your device and is never transmitted to us or any third party.
          </p>
          <p>
            You can clear this data at any time through your browser's settings.
          </p>
        </section>

        <section className="privacy-section">
          <h2>8. Children's Privacy</h2>
          <p>
            This Website is not directed to children under the age of 13. We do not knowingly collect 
            any information from children. Since we do not collect any information, this is not a concern, 
            but we want to be clear about our practices.
          </p>
        </section>

        <section className="privacy-section">
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page 
            with an updated "Last updated" date. Since we do not collect contact information, we cannot 
            notify you directly of changes, but we encourage you to review this policy periodically.
          </p>
        </section>

        <section className="privacy-section">
          <h2>10. Contact</h2>
          <p>
            For questions about this Privacy Policy, please visit our 
            <a href="https://github.com/DavideBenedetti95/warframe-arsenal" 
               target="_blank" rel="noopener noreferrer"> GitHub repository</a>.
          </p>
        </section>

        <section className="privacy-section privacy-section--highlight">
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

