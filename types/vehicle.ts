export type Vehicle = {
  year: number;
  make: string;
  model: string;
  vin: string;
  division: string;
};

export type RiskStatus = "clean" | "high" | "standard";

export type RiskResult = {
  status: RiskStatus;
  dmvFee: number;
  reasons: string[];
};

export type SortKey = "year" | "make" | "model";
export type SortDirection = "asc" | "desc";
