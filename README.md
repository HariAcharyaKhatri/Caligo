# CALIGO — Rise in the Vertical City

A text-driven, browser-based crime MMORPG inspired by Torn City. Everything runs seamlessly in the browser with local storage persistence and authentic Torn-quality UI, animations, and sound effects.

---

## 🚀 Running the App

### Option A: Direct Browser (Zero Setup)
Simply open [`index.html`](file:///d:/HARI%20KHATRI/Caligo/index.html) in any modern web browser.

If local storage access is restricted on `file://` protocols, start a local HTTP server:
```bash
python -m http.server 8080
# Open http://localhost:8080 in your browser
```

### Option B: Via `reptorn` (Next.js Application)
In `d:\HARI KHATRI\reptorn`:
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🌆 Design & UI Highlights

* **Animated City Skyline Banner**:
  * Multi-layer atmospheric city banner featuring moving clouds, cruising airplanes, and harbor skylines.
  * Collapsible via topbar button or settings.
* **Torn-Style Sticky Topbar**:
  * City Logo & Crest with quick navigation.
  * Live CST City Clock ticking in real time.
  * Real-time Status Chips (Clinic/Hospital countdown, Jail countdown, Wanted stars, Travel status).
  * Built-in Procedural Audio Toggle (Sound FX powered by the Web Audio API — zero external files).
  * Instant Theme Switcher (`Noir`, `Autumn`, `Cyber`, `Ash`).
* **High-Tech Player Sidebar & Vitals**:
  * Player profile with Level, Honor Rank, ID, and animated online status dot.
  * XP Progress Meter tracking percentage to next level.
  * Liquid Cash counter with 1-click `[Bank]` shortcut.
  * 4 Glowing Multi-Stop Vital Bars:
    * **Energy** (Emerald Green, countdown to next tick & full).
    * **Nerve** (Crimson Red, countdown to next tick).
    * **Happy** (Amber Gold, happiness rating).
    * **Life** (Electric Blue, live hit point tracking).
  * Real-time Battle Stats Mini-Drawer (Strength, Defense, Speed, Dexterity, Battle Power).
* **Enhanced Screens**:
  * **Vertical City Hub** (`city.js`): Categorized tabs (Underworld, Financial, Civilian, Syndicate, Community) and interactive platform district lore.
  * **Crime Board** (`crimes.js`): Target mark scoping cards with difficulty skulls, odds breakdown calculator, risk meters, and animated results.
  * **Combat Arena** (`combat.js`): Turn-based arena duel with dual health bars, 9 tactical moves, live scrolling battle feed, and post-fight resolution (Respect, Mug, Hospitalize).
  * **High-Roller Casino** (`casino.js`): Playable interactive 3-reel Lucky Slots with spinning reels, daily token stipend, and bet multipliers.
  * **The Gym** (`gym.js`): Multi-train selectors (1×, 5×, Max Energy), personal coaches, and injury risks.
  * **Character Dossier** (`home.js`): Quick-action buttons, vitals overview, daily streak rewards, and activity blotter.
