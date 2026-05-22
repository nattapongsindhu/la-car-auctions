import type { Vehicle } from "../../types/vehicle";
import demoVehicles from "../../data/demo-vehicles.json";

const STORAGE_KEY = "opg-vehicles";

export function saveVehicles(vehicles: Vehicle[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  } catch {
    // ignore storage quota / access errors
  }
}

export function loadVehicles(): Vehicle[] {
  if (typeof window === "undefined") return demoVehicles as Vehicle[];
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed: unknown = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed as Vehicle[];
    }
    return demoVehicles as Vehicle[];
  } catch {
    return demoVehicles as Vehicle[];
  }
}
