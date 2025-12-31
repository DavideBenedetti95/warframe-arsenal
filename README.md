# ⚔️ Warframe Arsenal

Un'applicazione web completa per esplorare armi e Warframe disponibili in Warframe, con filtri avanzati e informazioni dettagliate su come ottenerli.

## ✨ Funzionalità

### 🔫 Armi
- **Filtra per Mastery Rank** - Visualizza solo le armi sbloccate al tuo livello
- **Categorie** - Passa rapidamente tra armi Primarie e Secondarie
- **Filtri Tipo** - Filtra per Rifle, Shotgun, Sniper, Bow, Launcher, Pistol, etc.
- **Filtri Variante** - Filtra per Prime, Kuva, Tenet, Wraith, Vandal, Prisma, Syndicate
- **Ricerca** - Cerca direttamente un'arma per nome
- **Pagina Dettaglio** con:
  - Statistiche complete (danno, critico, status, fire rate, etc.)
  - Tipi di danno (Impact, Puncture, Slash, Elemental)
  - Come ottenere l'arma (Market, Dojo Lab, Quest, Lich/Sister)
  - Componenti necessari per il crafting
  - Drop delle Reliquie per armi Prime (con link alla Wiki)
  - Varianti disponibili

### 🎭 Warframe
- **Filtra per Mastery Rank** - Visualizza i Warframe sbloccati al tuo livello
- **Filtri Variante** - Base, Prime, Umbra
- **Ricerca** - Cerca direttamente un Warframe per nome
- **Pagina Dettaglio** con:
  - Statistiche (Health, Shield, Armor, Energy, Sprint Speed)
  - Abilità con descrizioni
  - Come ottenere il Warframe
  - Componenti e dove dropparli
  - Reliquie per Warframe Prime (con link alla Wiki)
  - Varianti disponibili

### 🎨 UI/UX
- Design moderno ispirato a Warframe
- Navigazione intuitiva con navbar
- Animazioni fluide
- Responsive design per mobile
- Immagini ufficiali per armi e Warframe

## 🛠️ Tech Stack

- **React 19** - UI library
- **React Router 7** - Navigazione SPA
- **Vite 7** - Build tool e dev server
- **@wfcd/items** - Database ufficiale Warframe
- **CSS Custom** - Styling ispirato a Warframe (Orbitron + Rajdhani fonts)

## 🚀 Getting Started

### Prerequisiti

- Node.js 20.19+ o 22.12+

### Installazione

```bash
# Clona il repository
git clone https://github.com/DavideBenedetti95/warframe-arsenal.git
cd warframe-arsenal

# Installa le dipendenze
npm install

# Estrai i dati
npm run extract-weapons
npm run extract-warframes

# Avvia il dev server
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

## 📜 Scripts Disponibili

| Script | Descrizione |
|--------|-------------|
| `npm run dev` | Avvia il server di sviluppo |
| `npm run build` | Build per produzione |
| `npm run preview` | Anteprima build di produzione |
| `npm run extract-weapons` | Aggiorna i dati delle armi |
| `npm run extract-warframes` | Aggiorna i dati dei Warframe |
| `npm run lint` | Controlla errori di linting |

## 📁 Struttura Progetto

```
warframe-mr-mvp/
├── public/
├── scripts/
│   ├── extract-weapons.js      # Script estrazione armi
│   └── extract-warframes.js    # Script estrazione Warframe
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Barra di navigazione
│   │   └── Navbar.css
│   ├── data/
│   │   ├── weapons.json        # Dati armi pre-estratti
│   │   └── warframes.json      # Dati Warframe pre-estratti
│   ├── lib/
│   │   ├── weapon.js           # Utility armi
│   │   └── warframe.js         # Utility Warframe
│   ├── pages/
│   │   ├── Weapons.jsx         # Lista armi
│   │   ├── Weapons.css
│   │   ├── WeaponDetail.jsx    # Dettaglio arma
│   │   ├── WeaponDetail.css
│   │   ├── Warframes.jsx       # Lista Warframe
│   │   ├── Warframes.css
│   │   ├── WarframeDetail.jsx  # Dettaglio Warframe
│   │   └── WarframeDetail.css
│   ├── App.jsx                 # Router principale
│   ├── App.css                 # Stili globali condivisi
│   ├── index.css               # Reset e variabili CSS
│   └── main.jsx                # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🎮 Aggiornare i Dati

I dati provengono dal pacchetto `@wfcd/items` mantenuto dalla community Warframe.
Per aggiornare i dati all'ultima versione:

```bash
# Aggiorna il pacchetto
npm update @wfcd/items

# Ri-estrai tutti i dati
npm run extract-weapons
npm run extract-warframes
```

## 📊 Dati Estratti

### Armi (336 totali)
- 62 armi Prime con info sulle Reliquie
- 285 armi con componenti di crafting
- Info dettagliate su: danno, statistiche, varianti, acquisizione
- Rilevamento automatico Dojo Lab (Bio Lab, Chem Lab, Energy Lab)

### Warframe
- Tutti i Warframe base, Prime e Umbra
- Statistiche complete e abilità
- Info su componenti e drop locations
- Stato Vaulted per versioni Prime

## 🗺️ Roadmap

- [ ] Aggiungere categoria Melee
- [ ] Comparazione tra armi/Warframe
- [ ] Build calculator
- [ ] Mod database
- [ ] PWA support
- [ ] Sync con account Warframe

## 📄 Licenza

MIT

## 🙏 Credits

- [Warframe](https://www.warframe.com/) - Digital Extremes
- [WFCD](https://github.com/WFCD) - Warframe Community Developers
- [warframestat.us](https://warframestat.us/) - CDN immagini
- [Warframe Wiki](https://wiki.warframe.com/) - Informazioni Reliquie

---

<p align="center">
  <i>Questo progetto non è affiliato con Digital Extremes.</i>
</p>
