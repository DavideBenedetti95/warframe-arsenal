# ⚔️ Warframe Arsenal - Mastery Rank

Un'applicazione web per esplorare le armi disponibili in Warframe filtrate per Mastery Rank.

## ✨ Funzionalità

- 🔍 **Filtra per Mastery Rank** - Visualizza solo le armi sbloccate al tuo livello
- 🎯 **Categorie** - Passa rapidamente tra armi Primarie e Secondarie
- 🖼️ **Immagini** - Ogni arma mostra la sua icona ufficiale
- 🎨 **UI Warframe-style** - Design moderno ispirato al sito ufficiale
- ⚡ **Veloce** - Dati pre-estratti per caricamento istantaneo

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool e dev server
- **@wfcd/items** - Database ufficiale delle armi Warframe
- **CSS Custom** - Styling ispirato a Warframe

## 🚀 Getting Started

### Prerequisiti

- Node.js 20.19+ o 22.12+

### Installazione

```bash
# Clona il repository
git clone https://github.com/tuousername/warframe-arsenal.git
cd warframe-arsenal

# Installa le dipendenze
npm install

# Estrai i dati delle armi
npm run extract-weapons

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
| `npm run lint` | Controlla errori di linting |

## 📁 Struttura Progetto

```
warframe-mr-mvp/
├── public/
├── scripts/
│   └── extract-weapons.js    # Script per estrarre dati armi
├── src/
│   ├── data/
│   │   └── weapons.json      # Dati armi pre-estratti
│   ├── lib/
│   │   └── weapon.js         # Utility per le armi
│   ├── App.jsx               # Componente principale
│   ├── App.css               # Stili componente
│   ├── index.css             # Stili globali
│   └── main.jsx              # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🎮 Aggiornare i Dati delle Armi

I dati delle armi provengono dal pacchetto `@wfcd/items` mantenuto dalla community.
Per aggiornare i dati all'ultima versione:

```bash
# Aggiorna il pacchetto
npm update @wfcd/items

# Ri-estrai i dati
npm run extract-weapons
```

## 🗺️ Roadmap

- [ ] Aggiungere categoria Melee
- [ ] Filtro per tipo di arma (Rifle, Shotgun, etc.)
- [ ] Ricerca per nome
- [ ] Statistiche dettagliate delle armi
- [ ] Comparazione tra armi
- [ ] Modalità scura/chiara
- [ ] PWA support

## 📄 Licenza

MIT

## 🙏 Credits

- [Warframe](https://www.warframe.com/) - Digital Extremes
- [WFCD](https://github.com/WFCD) - Warframe Community Developers
- [warframestat.us](https://warframestat.us/) - Immagini delle armi

---

<p align="center">
  <i>Questo progetto non è affiliato con Digital Extremes.</i>
</p>
