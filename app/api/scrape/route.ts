import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ScrapedVehicle = {
  year: number;
  make: string;
  model: string;
  vin: string;
  division: string;
};

const OPG_AUCTIONS_URL = "https://www.opgla.com/Auctions";
const VIN_PATTERN = /\b[A-HJ-NPR-Z0-9]{17}\b/g;
const YEAR_PATTERN = /\b(19[5-9]\d|20[0-3]\d)\b/;
const KNOWN_MAKES = [
  "Acura",
  "Audi",
  "BMW",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Dodge",
  "Fiat",
  "Ford",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Mazda",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "Ram",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

const KNOWN_DIVISIONS = [
  "Central",
  "Hollywood",
  "Northeast",
  "Southwest",
  "West Valley",
  "Valley",
  "Pacific",
  "South LA",
  "Harbor",
  "Van Nuys",
  "Wilshire",
  "Hollenbeck",
  "Newton",
  "Rampart",
  "Topanga",
  "77th",
];

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeVin(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function extractDivision(text: string, fallback = "Unknown") {
  const normalized = cleanText(text).toLowerCase();
  const match = KNOWN_DIVISIONS.find((division) =>
    normalized.includes(division.toLowerCase()),
  );

  return match ?? fallback;
}

function extractYear(text: string) {
  const match = text.match(YEAR_PATTERN);
  return match ? Number(match[1]) : 0;
}

function extractMakeModel(text: string, year: number, vin: string) {
  const withoutVin = cleanText(text.replace(vin, " "));
  const afterYear = year
    ? cleanText(withoutVin.slice(withoutVin.indexOf(String(year)) + 4))
    : withoutVin;
  const make = KNOWN_MAKES.find((knownMake) =>
    new RegExp(`\\b${knownMake.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(
      afterYear,
    ),
  );

  if (!make) {
    return { make: "Unknown", model: "Unknown" };
  }

  const makeIndex = afterYear.toLowerCase().indexOf(make.toLowerCase());
  const modelSource = cleanText(afterYear.slice(makeIndex + make.length));
  const model = cleanText(
    modelSource
      .replace(YEAR_PATTERN, " ")
      .replace(VIN_PATTERN, " ")
      .split(/\b(?:Central|Hollywood|Northeast|Southwest|West Valley|Valley|Pacific|Harbor)\b/i)[0],
  );

  return { make, model: model || "Unknown" };
}

function parseTableRows(html: string) {
  const $ = cheerio.load(html);
  const vehicles = new Map<string, ScrapedVehicle>();

  $("tr").each((_, row) => {
    const cells = $(row)
      .find("th,td")
      .map((__, cell) => cleanText($(cell).text()))
      .get()
      .filter(Boolean);
    const rowText = cleanText(cells.join(" "));
    const vinMatches = rowText.match(VIN_PATTERN) ?? [];

    for (const vinMatch of vinMatches) {
      const vin = normalizeVin(vinMatch);
      if (vehicles.has(vin)) {
        continue;
      }

      const year = extractYear(rowText);
      const { make, model } = extractMakeModel(rowText, year, vinMatch);
      const division = extractDivision(
        rowText,
        extractDivision($(row).prevAll("tr,h1,h2,h3,h4").first().text(), "Unknown"),
      );

      vehicles.set(vin, {
        year,
        make,
        model,
        vin,
        division,
      });
    }
  });

  return vehicles;
}

function parseFullText(html: string, vehicles: Map<string, ScrapedVehicle>) {
  const $ = cheerio.load(html);
  const pageText = cleanText($("body").text());
  const matches = [...pageText.matchAll(VIN_PATTERN)];

  for (const match of matches) {
    const vin = normalizeVin(match[0]);
    if (vehicles.has(vin)) {
      continue;
    }

    const start = Math.max(0, match.index - 220);
    const end = Math.min(pageText.length, match.index + 220);
    const windowText = pageText.slice(start, end);
    const year = extractYear(windowText);
    const { make, model } = extractMakeModel(windowText, year, match[0]);

    vehicles.set(vin, {
      year,
      make,
      model,
      vin,
      division: extractDivision(windowText),
    });
  }
}

const FETCH_TIMEOUT_MS = 8_000;
const MAX_RESPONSE_BYTES = 2_000_000;

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(OPG_AUCTIONS_URL, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "LA-Car-Auctions-Portfolio/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: "SOURCE_UNAVAILABLE", status: response.status, vehicles: [] },
        { status: 502 },
      );
    }

    const html = await response.text();

    if (html.length > MAX_RESPONSE_BYTES) {
      return NextResponse.json(
        { ok: false, error: "SOURCE_TOO_LARGE", vehicles: [] },
        { status: 413 },
      );
    }

    const vehicles = parseTableRows(html);
    parseFullText(html, vehicles);

    return NextResponse.json({
      ok: true,
      source: "opgla",
      fetchedAt: new Date().toISOString(),
      vehicles: [...vehicles.values()],
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      { ok: false, error: isTimeout ? "FETCH_TIMEOUT" : "SCRAPE_FAILED", vehicles: [] },
      { status: 500 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
