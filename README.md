# Axiom - Study & Deathline Tracker

A specialized study-focused operating system and countdown planner tailored for serious competitive exams (**JEE Main & Advanced**, **NEET UG**, and **Class 12 Boards**), designed strictly around 4 user-provided UI paradigms with dual **Bright / Dark** theme modes.

---

## 📸 UI Blueprint Mappings

| View / Feature | User Reference Image | Visual & Functional Details |
| :--- | :--- | :--- |
| **Today's Planner** | **Image 1** (`media_1790533708908.jpg`) | Minimalist warm stone palette (`#F4F1EA`) in Bright mode or Deep OLED in Dark mode, `"Good Morning, Student ☀️"`, real-time mechanical rolling odometer clock, pill filters (`Today`, `Tomorrow`, `All`), rich matte colored task cards (`burgundy`, `terracotta`, `indigo`, `emerald`), and timeline sprint slots. |
| **Syllabus Matrix** | *Core Curriculum* | Complete chapter directory for **JEE**, **NEET**, and **Class 12 Boards** with 4-status mastery color coding: 🟢 Mastered, 🟡 Needs Revision, 🔴 Weak/Backlog, ⚪ Untouched. |
| **Statistics & Telemetry** | **Image 3** (`media_1790533729954.jpg`) | Sleek dark UI (`#0D0F12`), predicted readiness score, dual charts (circular SVG donut gauge & subject split distribution), glowing neon velocity momentum wave graph, and preparation telemetry breakdown. |
| **Deathline Lockscreen** | **Image 4** (`media_1790533841647.jpg`) | Brutalist minimalist screen (`#EBE8E1`), giant date number, 7-column dot matrix (`M T W T F S S`) dynamically calculated from **Start Date** to **Deathline**: solid black dots (`●`) for elapsed days, radiant orange dot (`🟠`) for Today, and hollow outline dots (`○`) for remaining days. Footer: *"LESS BUT BETTER"*. |

---

## 🌓 Bright & Dark Theme Support

Axiom includes native instant theme switching between:
*   ☀️ **Bright Mode**: Warm minimalist stone aesthetic with soft paper textures and clean typography.
*   🌙 **Dark Mode**: High-contrast OLED dark styling optimized for late-night focus and eye comfort.

Click the theme icon (`☀️` / `🌙`) in the top shell bar, status bar, or home screen to toggle themes anytime. Your preference is automatically persisted to `localStorage`.

---

## 🚀 How to Run Locally

### Option 1: Run with Python Server (Recommended)
In PowerShell or Terminal:
```powershell
python server.py
```
Open **[http://localhost:8085](http://localhost:8085)** in your browser.

### Option 2: Direct Browser Open
Double-click `index.html` in Chrome, Edge, Safari, or Firefox (works 100% offline).
