import { chooseW3CTextColor } from "utils";
import z from "zod";

export interface Biome {
  id: string;
  name: string;
  color: string;
  wanted: boolean;
}

export const BiomeSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  color: z.string(),
  wanted: z.boolean(),
});

export const UNKNOWN_BIOME: Biome = {
  id: "unknown:unknown",
  name: "<unknown>",
  color: "#000000",
  wanted: true,
};

/**
 * Returns a CSS Style object that sets the variables '--color-biome' and
 * '--color-biome-text', based on the biome's color.
 * @param biome The biome to get the style for.
 */
export function getBiomeStyle (biome: Biome) {
  return {
    "--color-biome": biome.color,
    "--color-biome-text": chooseW3CTextColor(biome.color),
  } as React.CSSProperties;
};

export interface BiomeGroup {
  name: string;
  color: string;
  biomes: string[];
}
