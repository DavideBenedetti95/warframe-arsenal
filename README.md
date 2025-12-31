# ⚔️ Warframe Arsenal

Un'applicazione web completa per esplorare armi e Warframe disponibili in Warframe, con filtri avanzati e informazioni dettagliate su come ottenerli.

**🌐 Live Demo:** [https://davidebenedetti95.github.io/warframe-arsenal/](https://davidebenedetti95.github.io/warframe-arsenal/)

## ✨ Funzionalità

### 🔫 Armi
- **Filtra per Mastery Rank** - Visualizza solo le armi sbloccate al tuo livello
- **Categorie** - Passa rapidamente tra armi Primarie, Secondarie e Corpo a Corpo
- **Filtri Tipo** - Filtra per tipo specifico (Rifle, Shotgun, Pistol, Sword, Polearm, etc.)
- **Filtri Variante** - Filtra per Prime, Kuva, Tenet, Wraith, Vandal, Prisma, Syndicate
- **Ricerca** - Cerca direttamente un'arma per nome
- **Pagina Dettaglio** con:
  - Statistiche complete (danno, critico, status, fire rate/attack speed, range, etc.)
  - **Statistiche Melee** dedicate (Attack Speed, Range, Combo Duration, Slam Attack, Heavy Attack, Block Angle, Stance Polarity)
  - Tipi di danno (Impact, Puncture, Slash, Elemental)
  - Come ottenere l'arma (Market, Dojo Lab, Quest, Lich/Sister, Mission Drop)
  - Componenti necessari per il crafting
  - Drop delle Reliquie per armi Prime
  - **Status Reliquia** (Farmabile/Vaulted) con location di farm
  - **Toggle "Solo Farmabili"** per filtrare reliquie attive
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
  - Reliquie per Warframe Prime
  - Varianti disponibili

### 🎨 UI/UX
- Design moderno ispirato a Warframe
- Navigazione intuitiva con navbar
- Animazioni fluide
- Responsive design per mobile
- Immagini ufficiali per armi e Warframe
- Footer con disclaimer legale
- Pagina Terms of Service

## 🛠️ Tech Stack

- **React 19** - UI library
- **React Router 7** - Navigazione SPA
- **Vite 7** - Build tool e dev server
- **@wfcd/items** - Database ufficiale Warframe (community maintained)
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

# Estrai tutti i dati
npm run extract-weapons
npm run extract-warframes
npm run extract-relics

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
| `npm run extract-weapons` | Estrae/aggiorna i dati delle armi |
| `npm run extract-warframes` | Estrae/aggiorna i dati dei Warframe |
| `npm run extract-relics` | Estrae/aggiorna le drop location delle reliquie |
| `npm run deploy` | Build e deploy su GitHub Pages |
| `npm run lint` | Controlla errori di linting |

## 📁 Struttura Progetto

```
warframe-mr-mvp/
├── public/
│   └── favicon.png             # Favicon Warframe
├── scripts/
│   ├── extract-weapons.js      # Script estrazione armi
│   ├── extract-warframes.js    # Script estrazione Warframe
│   └── extract-relics.js       # Script estrazione drop reliquie
├── src/
│   ├── assets/
│   │   └── favicon.png
│   ├── components/
│   │   ├── Navbar.jsx          # Barra di navigazione
│   │   ├── Navbar.css
│   │   ├── Footer.jsx          # Footer con disclaimer
│   │   └── Footer.css
│   ├── data/
│   │   ├── weapons.json        # Dati armi pre-estratti
│   │   ├── warframes.json      # Dati Warframe pre-estratti
│   │   └── relic-drops.json    # Drop location reliquie
│   ├── lib/
│   │   ├── weapon.js           # Utility armi
│   │   ├── warframe.js         # Utility Warframe
│   │   └── relic.js            # Utility reliquie
│   ├── pages/
│   │   ├── Weapons.jsx         # Lista armi
│   │   ├── Weapons.css
│   │   ├── WeaponDetail.jsx    # Dettaglio arma
│   │   ├── WeaponDetail.css
│   │   ├── Warframes.jsx       # Lista Warframe
│   │   ├── Warframes.css
│   │   ├── WarframeDetail.jsx  # Dettaglio Warframe
│   │   ├── WarframeDetail.css
│   │   ├── Terms.jsx           # Terms of Service
│   │   └── Terms.css
│   ├── App.jsx                 # Router principale
│   ├── App.css                 # Stili globali condivisi
│   ├── index.css               # Reset e variabili CSS
│   └── main.jsx                # Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔄 Aggiornare i Dati (Post-Update Warframe)

Quando esce un nuovo update di Warframe, segui questi passaggi per aggiornare il sito.

### Fonti Dati

| Fonte | Cosa contiene | Tempo aggiornamento |
|-------|---------------|---------------------|
| `@wfcd/items` | Armi, Warframe, componenti, statistiche | 1-7 giorni dopo update |
| Drop Tables DE | Location farm reliquie, status vaulted | Poche ore dopo update |

### Procedura Completa

```bash
# 1. Aggiorna il pacchetto @wfcd/items all'ultima versione
npm update @wfcd/items

# 2. Ri-estrai TUTTI i dati
npm run extract-weapons
npm run extract-warframes
npm run extract-relics

# 3. Testa in locale che tutto funzioni
npm run dev
# Visita http://localhost:5173 e verifica le nuove armi/warframe

# 4. Se tutto OK, fai il deploy
npm run deploy

# 5. Commit e push su GitHub (per salvare i dati aggiornati)
git add .
git commit -m "Update data for [Nome Update Warframe]"
git push
```

### Aggiornamento Rapido (Solo Reliquie)

Se vuoi solo aggiornare le drop location delle reliquie (es: nuove reliquie unvaulted):

```bash
npm run extract-relics
npm run deploy
git add . && git commit -m "Update relic drop tables" && git push
```

### Aggiornamento Completo (Nuovo Major Update)

Per grossi update con nuove armi/warframe:

```bash
# Aggiorna tutto
npm update @wfcd/items
npm run extract-weapons
npm run extract-warframes
npm run extract-relics

# Test e deploy
npm run dev          # Verifica in locale
npm run deploy       # Pubblica

# Salva su GitHub
git add .
git commit -m "Major update: [Nome Update]"
git push
```

### Verifica Aggiornamento

Dopo l'aggiornamento, verifica:
- [ ] Nuove armi appaiono nella lista
- [ ] Nuovi Warframe appaiono nella lista
- [ ] Reliquie unvaulted mostrano "Farmabile" con location
- [ ] Nessun errore nella console del browser

---

## 📊 Dati Estratti

### Armi (600+ totali)
- 101+ armi Prime con info sulle Reliquie
- 514+ armi con componenti di crafting
- **Primarie**: Rifle, Shotgun, Sniper, Bow, Launcher
- **Secondarie**: Pistol, Dual Pistols, Throwing
- **Corpo a Corpo**: Sword, Dual Swords, Heavy Blade, Nikana, Rapier, Machete, Dagger, Dual Daggers, Fist, Claws, Sparring, Glaive, Polearm, Staff, Scythe, Whip, Blade and Whip, Nunchaku, Hammer, Gunblade, Tonfa, Warfan, Two-Handed Nikana
- Info dettagliate su: danno, statistiche ranged/melee, varianti, acquisizione
- Rilevamento automatico Dojo Lab (Bio Lab, Chem Lab, Energy Lab)
- Drop location per componenti (es: Higasa da Shrine Defense)

### Warframe
- Tutti i Warframe base, Prime e Umbra
- Statistiche complete e abilità
- Info su componenti e drop locations
- Stato Vaulted per versioni Prime

### Reliquie
- 34+ reliquie attive (farmabili)
- 688+ reliquie vaulted
- Drop location da fonte ufficiale Digital Extremes
- Missione, rotazione e % drop per ogni reliquia

## 🗺️ Roadmap

- [x] ~~Aggiungere categoria Melee~~ ✅
- [ ] Comparazione tra armi/Warframe
- [ ] Build calculator
- [ ] Mod database
- [ ] PWA support
- [ ] GitHub Action per aggiornamento automatico settimanale

## 📄 Licenza

MIT

## 🙏 Credits

- [Warframe](https://www.warframe.com/) - Digital Extremes
- [WFCD](https://github.com/WFCD) - Warframe Community Developers
- [warframestat.us](https://warframestat.us/) - CDN immagini
- [Warframe Wiki](https://wiki.warframe.com/) - Informazioni Reliquie
- [Official Drop Tables](https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html) - Digital Extremes

---

<p align="center">
  <i>Questo progetto non è affiliato con Digital Extremes.</i>
</p>
