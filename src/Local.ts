import type { Biome } from "api/Biome";
import type { MndBiomeSource } from "api/MultiNoiseDiscreteBiomeSource";

const KEY_PREFIX = "extrabiomegen-composer";
const KEY_INLAND = KEY_PREFIX + "/biome_source";
const KEY_BIOMES = KEY_PREFIX + "/catalogue";

const Local = {
  saveBiomeSource (inland: MndBiomeSource) {
    try {
      const json = JSON.stringify(inland);
      localStorage.setItem(KEY_INLAND, json);
    }
    catch (err) {
      console.error("Couldn't save inland", err);
    }
  },

  loadBiomeSource () : MndBiomeSource | null {
    try {
      const json = localStorage.getItem(KEY_INLAND);
      if (!json) return null;

      return JSON.parse(json) as MndBiomeSource;
    }
    catch (err) {
      console.error("Couldn't parse inland", err);
      return null;
    }
  },

  saveBiomes (biomes: Record<string, Biome>) {
    try {
      const json = JSON.stringify(biomes);
      localStorage.setItem(KEY_BIOMES, json);
    }
    catch (err) {
      console.error("Couldn't save biomes", err);
    }
  },

  loadBiomes () : Record<string, Biome> | null {
    try {
      const json = localStorage.getItem(KEY_BIOMES);
      if (!json) return null;

      return JSON.parse(json) as Record<string, Biome>;
    }
    catch (err) {
      console.error("Couldn't parse biomes", err);
      return null;
    }
  },
}

export default Local;
