# 🏎️ LA Car Auctions — Intelligent Vehicle Scraper & Risk Engine

![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.9.0-339933?style=for-the-badge&logo=node.js)

An advanced, high-velocity frontend pipeline and quantitative risk-assessment engine designed to ingest raw, unformatted HTML/Plain-text clipboard data directly from the official **OPG (Official Police Garages) Los Angeles** auction portal. This application bypasses client-side reCAPTCHA limits via real-time stream parsing, identifying the top 5% highest-potential everyday drivers, and optimizing vehicle vetting workflows for automotive traders.

---

## 🌐 Live Production Application

🔗 **[la-car-auctions.vercel.app](https://la-car-auctions.vercel.app/)** &nbsp;|&nbsp; 📑 **Data Source Terminal:** [opgla.com/Auctions](http://opgla.com/Auctions)

---

## ⚡ Core Features & Automotive Intelligence

### 🤖 Dynamic HTML & Plain-Text Ingestor
Instantly parses unformatted tables, raw copy-pastes, and messy clipboard text strings containing hundreds of live vehicle listings into clean, structured JSON schemas. Hybrid dispatcher auto-detects HTML vs. plain-text format and routes to the correct parsing engine.

### 🚦 Automated 3-State Risk Engine
Programmatically flags vehicle profiles to protect capital:

| Badge | Status | Trigger Conditions |
|-------|--------|--------------------|
| 🟢 **CLEAN CANDIDATE** | Buy signal | Reliable make (Toyota, Honda, Nissan, Mazda, Ford, Chevy) + year ≥ 2012 + est. DMV fees < $1,000 |
| ⚪ **STANDARD INSPECTION** | Neutral | Passes hard safety filters; requires standard history verification |
| 🔴 **HIGH RISK: EXCEEDS LIMITS** | Avoid | Year < 2005 OR European luxury badge (BMW, Mercedes, Audi, VW, Jaguar, Land Rover) OR est. DMV fees > $1,500 |

### 🔮 California DMV Advanced Bypass Pipeline
The **"Check DMV ↗"** button delivers a two-action workflow in a single click:
1. Automatically copies the full unmasked 17-character VIN to the system clipboard
2. Opens the official [California DMV Vehicle Registration Fee Calculator](https://www.dmv.ca.gov/wasapp/FeeCalculatorWeb/usedVehicleForm.do) in a new tab

### 🎛️ Commercial Filter Matrices
- **Search** — live substring match across year, make, model, VIN, division
- **Year or Newer (Minimum)** — range-bound filter (`car.year >= selectedYear`), not a rigid equality check
- **Risk Category** — segment by Clean / Standard / High Risk
- **Hide High-Risk toggle** — one-click exclusion of all flagged assets
- **Make & Division** dropdowns — granular segmentation by brand or auction lot

### 📊 Dashboard KPIs
Live reactive counters: total vehicles ingested, average model year, average estimated DMV fee — all computed from the active filtered dataset.

### 🌙 Dark / Light Mode
Full theme toggle via `next-themes`. Persistent across sessions.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 3.x |
| Icons | lucide-react |
| Theming | next-themes |
| HTML Parsing | Browser DOMParser (SSR-guarded) |
| Persistence | localStorage |
| Deployment | Vercel (Node ≥ 20.9.0) |

---

## 🚀 Local Installation

**Requirements:** Node.js ≥ 20.9.0

```bash
# 1. Clone the repository
git clone https://github.com/nattapongsindhu/la-car-auctions.git
cd la-car-auctions

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Production build verification
npm run build
npm run start
```

---

## 📋 How to Use

1. Navigate to [opgla.com/Auctions](http://opgla.com/Auctions)
2. Select all rows in the vehicle table and copy (`Ctrl+A` → `Ctrl+C`)
3. Paste into the **Ingestor** tab text area in the app
4. Click **"Sync Vehicles"** — the engine parses and risk-scores all rows instantly
5. Use the filter bar to narrow by year, make, risk profile, or division
6. Click **"Check DMV ↗"** on any row to copy VIN and open the CA DMV fee calculator

---

## 🗂️ Project Structure

```
app/
├── ui/
│   └── la-car-auctions.tsx   # Main component — all UI, parsing, and risk logic
├── api/
│   └── scrape/
│       └── route.ts           # Server-side scrape endpoint (cheerio)
├── layout.tsx                 # Root layout + metadata
├── page.tsx                   # Entry point
└── globals.css                # Tailwind base styles
```

---

## 📄 License

Private repository. All rights reserved.
