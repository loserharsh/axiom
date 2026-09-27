# Axiom - Study & Deathline Tracker (Powered by TypeSafe Jev)

A specialized study-focused operating system and countdown planner tailored for serious competitive exams (**JEE Main & Advanced**, **NEET UG**, and **Class 12 Boards**), designed strictly around 4 user-provided UI paradigms and driven by **TypeSafe AI's Jev** System 1 decision engine.

---

## 📸 UI Blueprint Mappings

| View / Feature | User Reference Image | Visual & Functional Details |
| :--- | :--- | :--- |
| **Today's Planner** | **Image 1** (`media_1790533708908.jpg`) | Minimalist warm stone palette (`#F4F1EA`), `"Good Morning, Aditya ☀️"`, date header (`28 SEPTEMBER`), pill filters (`Today`, `Tomorrow`, `All`, `+`), rich matte colored task cards (`burgundy`, `terracotta`, `indigo`, `emerald`), and timeline sprint slots. |
| **Habit Streaks** | **Image 2** (`media_1790533727888.jpg`) | 7×7 square heatmap consistency matrix for each study routine, active day badges (`Su Mo Tu We Th Fr Sa`), counter boxes (`Total Routines`, `Completed Today`), and interactive `+ Check in` buttons. |
| **Statistics & Jev Analytics** | **Image 3** (`media_1790533729954.jpg`) | Deep dark UI (`#0D0F12`), predicted readiness headline, dual charts (circular SVG donut gauge & subject split distribution), glowing neon velocity momentum wave graph, and live TypeSafe Jev System 1 decision breakdown. |
| **Deathline Lockscreen** | **Image 4** (`media_1790533841647.jpg`) | Brutalist minimalist screen (`#EBE8E1`), giant date number (`28`), 7-column dot matrix (`M T W T F S S`) dynamically calculated from **Start Date** to **Deathline**: solid black dots (`●`) for elapsed days, radiant orange dot (`🟠`) for Today, and hollow outline dots (`○`) for remaining days. Footer: *"LESS BUT BETTER"*. |
| **Syllabus Matrix** | *Custom Core Addition* | Complete chapter directory for **JEE**, **NEET**, and **Class 12 Boards** with 4-status mastery color coding: 🟢 Mastered, 🟡 Needs Revision, 🔴 Weak/Backlog, ⚪ Untouched. |

---

## ⚡ Real TypeSafe Jev System 1 Integration

Unlike generative LLMs that take 3–5 seconds streaming text, **Jev** evaluates the student's entire study state in parallel in a single forward pass (~120ms):

1. **State Synthesizer**: Compiles the current exam, days remaining to deathline, chapter mastery distribution (counts of Green, Yellow, Red, Gray), daily hours, and streak consistency.
2. **System 1 Primitives**:
   - **`deadline_risk`** (`Noul`): Calibrated probability $P(\text{failure})$ of running out of time before covering weak chapters.
   - **`readiness_score`** (`Score`): Calibrated readiness index on an ordinal scale, powering the Image 3 circular gauge.
   - **`priority_subject`** (`Choice`): Determines which subject domain (`Physics`, `Chemistry`, `Mathematics`, `Biology`) needs immediate remedial intervention today.
   - **`burnout_hazard`** (`Score`): Flags unsustainable cramming or fatigue.
   - **`daily_strategy`** (`Choice`): Recommends the dominant tactical focus for today's study block (e.g. *Tackle Red Backlog*, *Rapid Yellow PYQs*, *Mock Speed Test*).
3. **Execution**:
   - Uses `POST https://api.typesafe.ai/v1/systemone` with Bearer token authentication.
   - When hosted via `server.py`, requests are routed through `/api/systemone` to eliminate any browser CORS restrictions.

---

## 🚀 How to Run Locally

### Option 1: Run with Python Server (Recommended)
In PowerShell or Terminal:
```powershell
python server.py
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.

### Option 2: Direct Browser Open
Double-click `index.html` in Chrome, Edge, Safari, or Firefox.
