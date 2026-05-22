import type { Vehicle, RiskResult } from "../../types/vehicle";

const CURRENT_YEAR = new Date().getFullYear();

const EUROPEAN_PREFIXES = ["BMW", "MERC", "AUDI", "VOLK", "JAGU", "LAND"];
const CLEAN_MAKES = [
  "TOYT", "TOYOTA",
  "HOND", "HONDA",
  "NISS", "NISSAN",
  "MAZD", "MAZDA",
  "FORD", "CHEV",
];

export function computeDmvFee(year: number): number {
  if (!year || isNaN(year)) return 500;
  if (year >= CURRENT_YEAR) return 200;
  return (CURRENT_YEAR - year) * 150 + 200;
}

export function assessRisk(vehicle: Vehicle): RiskResult {
  const dmvFee = computeDmvFee(vehicle.year);
  const makeUpper = vehicle.make.toUpperCase();

  const isOld = vehicle.year > 0 && vehicle.year < 2005;
  const isEuropean = EUROPEAN_PREFIXES.some((p) => makeUpper.startsWith(p));
  const feesTooHigh = dmvFee > 1500;

  if (isOld || isEuropean || feesTooHigh) {
    const reasons: string[] = [];
    if (isOld) reasons.push(`Pre-2005 (${vehicle.year})`);
    if (isEuropean) reasons.push("European brand");
    if (feesTooHigh) reasons.push(`Est. DMV $${dmvFee.toLocaleString()}`);
    return { status: "high", dmvFee, reasons };
  }

  const isCleanMake = CLEAN_MAKES.some(
    (m) => makeUpper === m || makeUpper.startsWith(m) || m.startsWith(makeUpper),
  );
  if (isCleanMake && vehicle.year >= 2012 && dmvFee < 1000) {
    return { status: "clean", dmvFee, reasons: [] };
  }

  return { status: "standard", dmvFee, reasons: [] };
}
