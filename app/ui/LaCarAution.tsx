"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Calculator,
  Car,
  CheckCircle2,
  Clock3,
  Database,
  FileSearch,
  Moon,
  Search,
  ShieldAlert,
  Star,
  Sun,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTheme } from "next-themes";

type TabId = "dashboard" | "scraper" | "history" | "dmv" | "watchlist";

type Vehicle = {
  year: number;
  make: string;
  model: string;
  vin: string;
  division: "Central" | "Hollywood" | "Northeast" | "Southwest" | "Valley";
  status: string;
  estimate: string;
};

const tabs: Array<{ id: TabId; label: string }> = [
  {
    id: "dashboard",
    label: "Dashboard",
  },
  {
    id: "scraper",
    label: "Vehicle Scraper",
  },
  {
    id: "history",
    label: "VIN History",
  },
  {
    id: "dmv",
    label: "DMV Calculator",
  },
  {
    id: "watchlist",
    label: "Watchlist",
  },
];

const vehicles: Vehicle[] = [
  {
    year: 2014,
    make: "Toyota",
    model: "Camry SE",
    vin: "4T1BF1FK8EU345921",
    division: "Central",
    status: "Lien Sale Ready",
    estimate: "$4,900",
  },
  {
    year: 2018,
    make: "Honda",
    model: "Civic LX",
    vin: "19XFC2F59JE208114",
    division: "Hollywood",
    status: "Photo Review",
    estimate: "$7,800",
  },
  {
    year: 2012,
    make: "Ford",
    model: "F-150 XLT",
    vin: "1FTFW1ET3CFA77102",
    division: "Northeast",
    status: "High Fees",
    estimate: "$6,250",
  },
  {
    year: 2016,
    make: "Nissan",
    model: "Altima S",
    vin: "1N4AL3AP7GC226415",
    division: "Southwest",
    status: "Clean Candidate",
    estimate: "$5,600",
  },
  {
    year: 2020,
    make: "Chevrolet",
    model: "Malibu LT",
    vin: "1G1ZD5ST7LF058331",
    division: "Valley",
    status: "Watchlist Match",
    estimate: "$9,400",
  },
  {
    year: 2009,
    make: "Lexus",
    model: "RX 350",
    vin: "2T2HK31U49C109772",
    division: "Central",
    status: "DMV Risk",
    estimate: "$3,700",
  },
];

const volumePoints = [78, 92, 88, 111, 126, 119, 142, 154];
const divisions = ["All Divisions", "Central", "Hollywood", "Northeast", "Southwest", "Valley"];

function maskVin(vin: string) {
  return `${vin.slice(0, 4)} ••••••••• ${vin.slice(-4)}`;
}

function googleImageLink(vin: string) {
  const query = encodeURIComponent(`${vin} car auction`);
  return `https://www.google.com/search?q=${query}&tbm=isch`;
}

export function LaCarAution() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState("All Divisions");
  const [vinInput, setVinInput] = useState("1FTFW1ET3CFA77102");
  const [monthsLate, setMonthsLate] = useState(8);
  const [baseFee, setBaseFee] = useState(276);

  const filteredVehicles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesQuery = `${vehicle.make} ${vehicle.model}`
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesDivision =
        division === "All Divisions" || vehicle.division === division;

      return matchesQuery && matchesDivision;
    });
  }, [division, query]);

  const penalty = Math.round(baseFee * Math.min(monthsLate, 24) * 0.035);
  const transfer = 15;
  const estimatedTotal = baseFee + penalty + transfer;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <header className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                <Database size={16} />
                LA Car Aution
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                LA Car Aution
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
                Official LA Car Aution Platform
              </p>
            </div>
            <ThemeToggle />
          </div>

          <nav className="mt-8 overflow-x-auto" aria-label="Primary navigation">
            <div className="flex min-w-[980px] gap-3 lg:min-w-0">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex-1 rounded-2xl border px-5 py-4 text-left transition ${
                    activeTab === tab.id
                      ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200"
                      : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <span className="block text-sm font-black">
                    {index + 1}. {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </nav>
        </header>

        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "scraper" && (
          <VehicleScraperTab
            division={division}
            filteredVehicles={filteredVehicles}
            query={query}
            setDivision={setDivision}
            setQuery={setQuery}
          />
        )}
        {activeTab === "history" && (
          <VinHistoryTab vinInput={vinInput} setVinInput={setVinInput} />
        )}
        {activeTab === "dmv" && (
          <DmvCalculatorTab
            baseFee={baseFee}
            estimatedTotal={estimatedTotal}
            monthsLate={monthsLate}
            penalty={penalty}
            setBaseFee={setBaseFee}
            setMonthsLate={setMonthsLate}
            transfer={transfer}
          />
        )}
        {activeTab === "watchlist" && <WatchlistTab />}
      </div>
    </main>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-14 items-center gap-3 rounded-full border border-slate-100 bg-slate-50 px-3 pl-5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/50"
      aria-label="Toggle day and night mode"
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
      <span>{isDark ? "Night Mode" : "Day Mode"}</span>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-blue-600 shadow-sm dark:bg-blue-500 dark:text-white">
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </span>
    </button>
  );
}

function DashboardTab() {
  return (
    <section className="grid gap-6">
      <div className="grid gap-5 md:grid-cols-3">
        <KpiCard
          icon={<Car size={22} />}
          label="Total Live OPG Vehicles"
          value="427 Vehicles"
          note="Across active Los Angeles OPG divisions"
        />
        <KpiCard
          icon={<TrendingUp size={22} />}
          label="Average Year Model"
          value="2011"
          note="Weighted by current scraped inventory"
        />
        <KpiCard
          icon={<Calculator size={22} />}
          label="Estimated Avg DMV Back-Fees"
          value="$420.00"
          note="Before inspection, smog, and repair risk"
        />
      </div>

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black">Weekly Vehicle Volume</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Mock OPG crawl volume over the last eight weeks.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            +18.4% trend
          </span>
        </div>
        <MiniLineChart />
      </section>
    </section>
  );
}

function KpiCard({
  icon,
  label,
  note,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  note: string;
  value: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-7 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
        {icon}
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <strong className="mt-3 block text-3xl font-black tracking-tight">
        {value}
      </strong>
      <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {note}
      </p>
    </article>
  );
}

function MiniLineChart() {
  const max = Math.max(...volumePoints);
  const min = Math.min(...volumePoints);
  const points = volumePoints
    .map((value, index) => {
      const x = (index / (volumePoints.length - 1)) * 700;
      const y = 190 - ((value - min) / (max - min)) * 150;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-72 rounded-3xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
      <svg viewBox="0 0 700 230" className="h-full w-full" role="img">
        <title>Vehicle volume line chart</title>
        {[40, 90, 140, 190].map((y) => (
          <line
            key={y}
            x1="0"
            x2="700"
            y1={y}
            y2={y}
            className="stroke-slate-200 dark:stroke-slate-800"
          />
        ))}
        <polyline
          fill="none"
          points={points}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
          className="text-blue-600 dark:text-blue-400"
        />
        {volumePoints.map((value, index) => {
          const x = (index / (volumePoints.length - 1)) * 700;
          const y = 190 - ((value - min) / (max - min)) * 150;

          return (
            <g key={value + index}>
              <circle cx={x} cy={y} r="8" className="fill-white stroke-blue-600 stroke-[5] dark:fill-slate-950 dark:stroke-blue-400" />
              <text x={x} y="222" textAnchor="middle" className="fill-slate-400 text-[18px] font-bold">
                W{index + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function VehicleScraperTab({
  division,
  filteredVehicles,
  query,
  setDivision,
  setQuery,
}: {
  division: string;
  filteredVehicles: Vehicle[];
  query: string;
  setDivision: (value: string) => void;
  setQuery: (value: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-black">Vehicle Scraper</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            LA Car Aution
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_190px]">
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-950">
            <Search size={18} className="text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Make or Model"
              className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
            />
          </label>
          <select
            value={division}
            onChange={(event) => setDivision(event.target.value)}
            className="h-12 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none dark:border-slate-800 dark:bg-slate-950"
          >
            {divisions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-800">
        <table className="min-w-[900px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400 dark:bg-slate-950">
            <tr>
              {["Year", "Make", "Model", "VIN", "OPG Division", "Actions"].map(
                (header) => (
                  <th key={header} className="px-6 py-5 font-black">
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.vin} className="align-middle">
                <td className="px-6 py-5 font-black">{vehicle.year}</td>
                <td className="px-6 py-5 font-bold">{vehicle.make}</td>
                <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                  {vehicle.model}
                </td>
                <td className="px-6 py-5 font-mono text-xs font-bold text-slate-500">
                  {maskVin(vehicle.vin)}
                </td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {vehicle.division}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <a
                      href={googleImageLink(vehicle.vin)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white transition hover:bg-blue-700"
                    >
                      Deep Link
                      <ArrowUpRight size={14} />
                    </a>
                    <span className="text-xs font-bold text-slate-400">
                      {vehicle.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function VinHistoryTab({
  setVinInput,
  vinInput,
}: {
  setVinInput: (value: string) => void;
  vinInput: string;
}) {
  const timeline = [
    "Copart Salvage Title 2022",
    "Registered in LA 2024",
    "LAPD Impounded / OPG Lien Sale 2026",
  ];
  const redFlags = ["Prior salvage record", "Odometer gap detected", "Lien sale risk"];

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-7 grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
          <FileSearch size={22} />
        </div>
        <h2 className="text-2xl font-black">VIN History</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Paste a VIN to review a mocked vehicle timeline before placing
          an auction bid.
        </p>
        <label className="mt-8 block text-sm font-black text-slate-500 dark:text-slate-400">
          VIN Lookup
          <input
            value={vinInput}
            onChange={(event) => setVinInput(event.target.value.toUpperCase())}
            className="mt-3 h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 font-mono text-sm font-black outline-none focus:border-blue-300 dark:border-slate-800 dark:bg-slate-950"
          />
        </label>
        <a
          href={googleImageLink(vinInput)}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white dark:bg-white dark:text-slate-950"
        >
          Search Damage Photos
          <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-black">Vehicle Life Timeline</h3>
        <div className="mt-8 grid gap-4">
          {timeline.map((item, index) => (
            <div key={item} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-sm font-black text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  {index + 1}
                </span>
                {index < timeline.length - 1 && (
                  <span className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
                )}
              </div>
              <div className="pt-2">
                <p className="font-black">{item}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Mock record source: auction, DMV, and impound metadata.
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-rose-100 bg-rose-50 p-5 dark:border-rose-500/20 dark:bg-rose-500/10">
          <div className="mb-4 flex items-center gap-2 text-rose-700 dark:text-rose-300">
            <ShieldAlert size={18} />
            <h4 className="font-black">Red Flags</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {redFlags.map((flag) => (
              <span
                key={flag}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-700 dark:bg-slate-950 dark:text-rose-300"
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DmvCalculatorTab({
  baseFee,
  estimatedTotal,
  monthsLate,
  penalty,
  setBaseFee,
  setMonthsLate,
  transfer,
}: {
  baseFee: number;
  estimatedTotal: number;
  monthsLate: number;
  penalty: number;
  setBaseFee: (value: number) => void;
  setMonthsLate: (value: number) => void;
  transfer: number;
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-black">California DMV Calculator</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Estimate back-fees and late penalties before bidding. This is a mock
          planning calculator, not an official DMV quote.
        </p>
        <div className="mt-8 grid gap-5">
          <label className="text-sm font-black text-slate-500 dark:text-slate-400">
            Base registration estimate
            <input
              type="number"
              min={0}
              value={baseFee}
              onChange={(event) => setBaseFee(Number(event.target.value))}
              className="mt-3 h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-lg font-black outline-none dark:border-slate-800 dark:bg-slate-950"
            />
          </label>
          <label className="text-sm font-black text-slate-500 dark:text-slate-400">
            Months late
            <input
              type="number"
              min={0}
              max={24}
              value={monthsLate}
              onChange={(event) => setMonthsLate(Number(event.target.value))}
              className="mt-3 h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-lg font-black outline-none dark:border-slate-800 dark:bg-slate-950"
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-black">Fee Breakdown</h3>
        <div className="mt-7 grid gap-3">
          <FeeRow label="Base registration estimate" value={baseFee} />
          <FeeRow label="Late penalties estimate" value={penalty} />
          <FeeRow label="Transfer fee estimate" value={transfer} />
        </div>
        <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white dark:bg-blue-600">
          <p className="text-sm font-bold opacity-70">Estimated DMV Exposure</p>
          <p className="mt-2 text-4xl font-black">${estimatedTotal.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
}

function FeeRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
      <span className="font-bold text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-black">${value.toFixed(2)}</span>
    </div>
  );
}

function WatchlistTab() {
  const watched = vehicles.slice(0, 3);

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {watched.map((vehicle, index) => (
        <article
          key={vehicle.vin}
          className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
              <Star size={20} />
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              Priority {index + 1}
            </span>
          </div>
          <h2 className="text-xl font-black">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h2>
          <p className="mt-2 font-mono text-xs font-bold text-slate-400">
            {maskVin(vehicle.vin)}
          </p>
          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
              <CheckCircle2 size={16} />
              <span className="font-bold">Target appraisal: {vehicle.estimate}</span>
            </div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300">
              <AlertTriangle size={16} />
              <span className="font-bold">Review DMV exposure before bid</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Clock3 size={16} />
              <span className="font-bold">Custom note: inspect photos first</span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
