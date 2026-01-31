import { useState, useEffect, useCallback } from "react";
import "./EndoBounty.css";

const API_URL = "https://oracle.browse.wf/bounty-cycle";

// Mapping dei challenge names a nomi leggibili
const CHALLENGE_NAMES = {
  // Cavia (EntratiLab)
  "EntratiLabKillVoidRigEasyChallenge": "Exterminate",
  "EntratiLabKillVoidRigHardChallenge": "Exterminate",
  "EntratiLabDefeatDoppelgangerChallenge": "Assassination",
  "EntratiLabDestroyDecorationChallenge": "Mirror Defense",
  "EntratiLabAlchemyGrenadeToxinChallenge": "Alchemy",
  "EntratiLabActivateLohkSurgeHardChallenge": "Assassination",
  "EntratiLabActivateLohkSurgeEasyChallenge": "Assassination",
  // Holdfast (Zariman)
  "ZarimanMobDefProtectShieldsChallenge": "Mobile Defense",
  "ZarimanKillCorpusEasyChallenge": "Exterminate",
  "ZarimanKillGrineerEasyChallenge": "Exterminate",
  "ZarimanFloodCompleteWavesChallenge": "Void Flood",
  "ZarimanUseVoidRiftsHardChallenge": "Void Armageddon",
  "ZarimanUseVoidRiftsEasyChallenge": "Void Armageddon",
  "ZarimanFindMelicaCacheChallenge": "Exterminate",
  "ZarimanCascadeKillEasyChallenge": "Void Cascade",
  "ZarimanCascadeKillHardChallenge": "Void Cascade",
  // The Hex (Vania)
  "VaniaDestroyBackpacksEasy": "Sabotage",
  "VaniaDestroyBackpacksHard": "Sabotage",
  "VaniaAbilityKillEasy": "Exterminate",
  "VaniaAbilityKillHard": "Exterminate",
  "VaniaSafeCracker": "Spy",
  "VaniaCaptureTargetsEasy": "Capture",
  "VaniaCaptureTargetsHard": "Capture",
  "VaniaDestroyPropsEasy": "Sabotage",
  "VaniaDestroyPropsHard": "Sabotage",
  "VaniaDestroyPropsVeryHard": "Sabotage",
  "VaniaDestroyVehiclesEasy": "Sabotage",
  "VaniaDestroyVehiclesHard": "Sabotage",
  "VaniaDestroyVehiclesVeryHard": "Sabotage",
  "VaniaKillTargetEasy": "Assassination",
  "VaniaKillTargetHard": "Assassination",
};

// Configurazione bounty con Endo per ogni faction
// La 4° bounty (indice 3) ha sempre 3000/4000 Endo
const ENDO_BOUNTY_CONFIG = {
  EntratiLabSyndicate: {
    name: "Cavia",
    location: "Sanctum Anatomica",
    endoIndex: 3, // 4° bounty = 3000/4000 Endo
    endoRewards: { common: 3000, uncommon: 4000 },
  },
  ZarimanSyndicate: {
    name: "The Holdfast",
    location: "Zariman",
    endoIndex: 3, // 4° bounty = 3000/4000 Endo
    endoRewards: { common: 3000, uncommon: 4000 },
  },
  HexSyndicate: {
    name: "The Hex",
    location: "Hollvania (1999)",
    endoIndex: 3, // 4° bounty = 3000/4000 Endo
    endoRewards: { common: 3000, uncommon: 4000 },
  },
};

function getChallengeName(challengePath) {
  if (!challengePath) return "Unknown";
  const parts = challengePath.split("/");
  const challengeKey = parts[parts.length - 1];
  return CHALLENGE_NAMES[challengeKey] || challengeKey.replace(/Challenge$/, "").replace(/Easy|Hard|VeryHard/g, "");
}

// Estrae il numero dal nodo (es: "SolNode233" → 233)
function getNodeNumber(node) {
  if (!node) return 0;
  const match = node.match(/SolNode(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Ordina le bounty per numero di nodo (crescente = dal più facile al più difficile)
function sortBountiesByDifficulty(bounties) {
  return [...bounties].sort((a, b) => getNodeNumber(a.node) - getNodeNumber(b.node));
}

function formatTimeRemaining(expiry) {
  const now = Date.now();
  const diff = expiry - now;
  
  if (diff <= 0) return { text: "Expired", expired: true };
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return { text: `${hours}h ${minutes}m ${seconds}s`, expired: false };
  } else if (minutes > 0) {
    return { text: `${minutes}m ${seconds}s`, expired: false };
  }
  return { text: `${seconds}s`, expired: false };
}

export default function EndoBounty() {
  const [bountyData, setBountyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({ text: "", expired: false });

  const fetchBounties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch bounty data");
      const data = await response.json();
      setBountyData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBounties();
  }, [fetchBounties]);

  // Timer countdown
  useEffect(() => {
    if (!bountyData?.expiry) return;

    const updateTimer = () => {
      const remaining = formatTimeRemaining(bountyData.expiry);
      setTimeRemaining(remaining);
      
      // Auto-refresh quando scade
      if (remaining.expired) {
        setTimeout(fetchBounties, 5000);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [bountyData?.expiry, fetchBounties]);

  const analyzeBounties = () => {
    if (!bountyData?.bounties) return [];

    const results = [];
    
    for (const [syndicateKey, config] of Object.entries(ENDO_BOUNTY_CONFIG)) {
      const rawBounties = bountyData.bounties[syndicateKey];
      if (!rawBounties) continue;

      // Ordina le bounty per difficoltà (numero nodo crescente)
      const sortedBounties = sortBountiesByDifficulty(rawBounties);
      
      // Prendi la bounty all'indice corretto (4° = indice 3)
      const endoBounty = sortedBounties[config.endoIndex];
      const missionType = endoBounty ? getChallengeName(endoBounty.challenge) : "N/A";
      const isExterminate = missionType.toLowerCase().includes("exterminate");
      
      results.push({
        faction: config.name,
        location: config.location,
        missionType,
        isExterminate,
        endoRewards: config.endoRewards,
        hasEndoBounty: !!endoBounty,
        bountyPosition: config.endoIndex + 1,
        allBounties: sortedBounties.map((b, i) => ({
          position: i + 1,
          type: getChallengeName(b.challenge),
          node: b.node,
          isEndoBounty: i === config.endoIndex,
        })),
      });
    }

    return results;
  };

  if (loading) {
    return (
      <div className="endo-bounty-page">
        <div className="endo-bounty__loading">
          <div className="endo-bounty__spinner"></div>
          <p>Loading bounty data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="endo-bounty-page">
        <div className="endo-bounty__error">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={fetchBounties} className="endo-bounty__retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const analysis = analyzeBounties();
  const hasAnyExterminate = analysis.some(a => a.isExterminate);

  return (
    <div className="endo-bounty-page">
      <header className="endo-bounty__header">
        <h1 className="endo-bounty__title">
          <span className="endo-bounty__icon">⚗️</span>
          Endo Bounty Tracker
        </h1>
        <p className="endo-bounty__subtitle">
          Track 3000/4000 Endo rewards from Exterminate bounties
        </p>
      </header>

      <div className="endo-bounty__timer-section">
        <div className="endo-bounty__timer-card">
          <span className="endo-bounty__timer-label">Next Rotation</span>
          <span className={`endo-bounty__timer-value ${timeRemaining.expired ? "expired" : ""}`}>
            {timeRemaining.text}
          </span>
          <button onClick={fetchBounties} className="endo-bounty__refresh-btn" title="Refresh">
            🔄
          </button>
        </div>
      </div>

      {hasAnyExterminate && (
        <div className="endo-bounty__alert endo-bounty__alert--success">
          <span className="endo-bounty__alert-icon">🎯</span>
          <span>Exterminate with Endo rewards is currently available!</span>
        </div>
      )}

      <div className="endo-bounty__factions">
        {analysis.map((faction) => (
          <div 
            key={faction.faction} 
            className={`endo-bounty__faction-card ${faction.isExterminate ? "endo-bounty__faction-card--active" : ""}`}
          >
            <div className="endo-bounty__faction-header">
              <h2 className="endo-bounty__faction-name">{faction.faction}</h2>
              <span className="endo-bounty__faction-location">{faction.location}</span>
            </div>

            <div className="endo-bounty__endo-info">
              <div className="endo-bounty__mission-badge">
                <span className="endo-bounty__mission-label">Bounty #{faction.bountyPosition}</span>
                <span className={`endo-bounty__mission-type ${faction.isExterminate ? "exterminate" : ""}`}>
                  {faction.missionType}
                </span>
              </div>

              <div className="endo-bounty__rewards">
                <div className="endo-bounty__reward">
                  <span className="endo-bounty__reward-rarity common">Common</span>
                  <span className="endo-bounty__reward-value">{faction.endoRewards.common.toLocaleString()} Endo</span>
                </div>
                <div className="endo-bounty__reward">
                  <span className="endo-bounty__reward-rarity uncommon">Uncommon</span>
                  <span className="endo-bounty__reward-value">{faction.endoRewards.uncommon.toLocaleString()} Endo</span>
                </div>
              </div>

              {faction.isExterminate ? (
                <div className="endo-bounty__status endo-bounty__status--available">
                  ✓ Exterminate Active
                </div>
              ) : (
                <div className="endo-bounty__status endo-bounty__status--unavailable">
                  ✗ Not Exterminate
                </div>
              )}
            </div>

            <details className="endo-bounty__all-bounties">
              <summary>View all bounties</summary>
              <ul className="endo-bounty__bounty-list">
                {faction.allBounties.map((bounty) => (
                  <li 
                    key={bounty.position} 
                    className={`endo-bounty__bounty-item ${bounty.isEndoBounty ? "highlighted" : ""}`}
                  >
                    <span className="endo-bounty__bounty-pos">#{bounty.position}</span>
                    <span className="endo-bounty__bounty-type">{bounty.type}</span>
                    {bounty.isEndoBounty && <span className="endo-bounty__bounty-tag">ENDO</span>}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>

      <div className="endo-bounty__info-section">
        <h3>ℹ️ How it works</h3>
        <ul>
          <li><strong>Cavia</strong>: Bounty #4 (Nex) rewards 3000/4000 Endo</li>
          <li><strong>The Holdfast</strong>: Bounty #4 (Oro Works) rewards 3000/4000 Endo</li>
          <li><strong>The Hex</strong>: Bounty #4 rewards 3000/4000 Endo</li>
          <li>Bounties rotate approximately every 2.5 hours</li>
          <li>This page auto-refreshes when the timer expires</li>
        </ul>
      </div>
    </div>
  );
}
