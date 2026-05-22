import type { Vehicle } from "../../types/vehicle";

function normalizeCellText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function extractCleanVin(value: string): string {
  return (
    value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, " ")
      .match(/\b[A-HJ-NPR-Z0-9]{17}\b/)?.[0] ?? ""
  );
}

function parseOpgPlainText(source: string): Vehicle[] {
  const vehicles = new Map<string, Vehicle>();

  for (const rawLine of source.split("\n")) {
    try {
      const line = rawLine.replace(/[\t\r]+/g, " ").replace(/\s{2,}/g, " ").trim();
      if (!line) continue;

      const vinMatch = line.match(/[A-HJ-NPR-Z0-9]{17}/i);
      if (!vinMatch) continue;
      const vin = vinMatch[0].toUpperCase();

      const vinIdx = line.indexOf(vinMatch[0]);
      const before = line.slice(0, vinIdx).trim();
      const after = line.slice(vinIdx + vinMatch[0].length).trim();

      const beforeWords = before.split(/\s+/).filter(Boolean);
      if (beforeWords.length < 2) continue;

      const make = beforeWords[0];
      const model = beforeWords[1];
      const yearMatch = before.match(/\b(19\d{2}|20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : 0;

      const afterNoDate = after.replace(/\s*\d{1,2}\/\d{1,2}\/\d{4}.*$/, "").trim();
      const addressMatch = afterNoDate.match(/^(.*?)\s+\d{2,5}\s+[A-Za-z]/);
      const division = addressMatch
        ? addressMatch[1].trim()
        : afterNoDate.split(/\s+/).slice(0, 4).join(" ").trim();

      if (!vin || !make || !model) continue;
      vehicles.set(vin, { year, make, model, vin, division: division || "Unknown" });
    } catch {
      continue;
    }
  }

  return Array.from(vehicles.values());
}

function parseOpgHtmlTable(source: string): Vehicle[] {
  if (typeof window === "undefined") return [];
  const normalized = source.trim();
  const wrapped = /<table[\s>]/i.test(normalized)
    ? normalized
    : `<table>${normalized}</table>`;
  const doc = new DOMParser().parseFromString(wrapped, "text/html");
  const rows = Array.from(doc.querySelectorAll("tr"));
  const vehicles = new Map<string, Vehicle>();

  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll("td"));
    if (cells.length < 7) continue;

    const make = normalizeCellText(cells[0]?.textContent ?? "");
    const model = normalizeCellText(cells[1]?.textContent ?? "");
    const year = parseInt(normalizeCellText(cells[4]?.textContent ?? ""), 10) || 0;
    const vin = extractCleanVin(cells[5]?.textContent ?? "");
    const division = normalizeCellText(cells[6]?.textContent ?? "") || "Unknown";

    if (!vin || !make || !model) continue;
    vehicles.set(vin, { year, make, model, vin, division });
  }

  return Array.from(vehicles.values());
}

export function parseOpgData(source: string): Vehicle[] {
  return /<tr|<td/i.test(source)
    ? parseOpgHtmlTable(source)
    : parseOpgPlainText(source);
}
