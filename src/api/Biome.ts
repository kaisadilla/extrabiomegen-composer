import z from "zod";

export interface Biome {
  id: string;
  name: string;
  color: string;
}

export const BiomeSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  color: z.string(),
});

export const UNKNOWN_BIOME: Biome = {
  id: "unknown:unknown",
  name: "<unknown>",
  color: "#000000",
};
