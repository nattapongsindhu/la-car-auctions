import { z } from "zod";

export const vehicleSchema = z.object({
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  make: z.string().min(1).max(40),
  model: z.string().min(1).max(60),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: "Invalid 17-character VIN format",
  }),
  division: z.string().min(1).max(120),
  auctionDate: z.string().max(20).optional(),
});

export const vehiclesSchema = z.array(vehicleSchema);

export type ValidatedVehicle = z.infer<typeof vehicleSchema>;
