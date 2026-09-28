# Axiom

A minimalist study planner and deadline tracker for competitive exam preparation (JEE, NEET, and CBSE Class 12).

Runs entirely in the browser with zero external dependencies and local offline storage (`localStorage`).

---

## Features

- **Daily Study Planner**: Schedule study blocks with custom subject tags and time slots, and toggle completion states.
- **Syllabus Mastery Tracker**: Complete syllabus checklists for JEE, NEET, and Class 12 Science with 4-state status tracking (Mastered, Revision, Weak, Untouched).
- **Diagnostics & Stats**: Deterministic readiness scoring, subject distribution gauges, and study velocity charts.
- **Countdown Lockscreen**: A brutalist calendar dot matrix displaying elapsed and remaining days until exam deathline, paired with a focus stopwatch.
- **Dual Themes**: Toggle between Warm Minimalist (Bright) and OLED Dark mode.
- **100% Client-Side**: No accounts, external APIs, or trackers required. All data persists locally.

---

## Getting Started

### Option 1: Run with Python

```bash
git clone https://github.com/loserharsh/axiom.git
cd axiom
python server.py
```

Open `http://localhost:8080` (or the port displayed in your terminal) in any browser.

### Option 2: Direct Open

Open `index.html` directly in Chrome, Firefox, Safari, or Edge.

---

## Project Structure

```text
axiom/
├── index.html          # Main application shell and views
├── styles.css          # Core styles, responsive layout & theme overrides
├── app.js              # Application logic, router, and state management
├── syllabus-data.js    # Curated chapter lists for JEE, NEET, and CBSE 12
├── server.py           # Lightweight local static server
└── manifest.json       # PWA web manifest
```

---

## Tech Stack

- **Frontend**: Vanilla HTML5, modern CSS3, ES6+ JavaScript.
- **Storage**: Browser `localStorage`.
- **Icons**: SVG & Lucide.
- **Server**: Standard library Python `http.server`.

---

## License

MIT
