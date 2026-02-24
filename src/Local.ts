import type { Biome } from "api/Biome";
import type { LangFile } from "api/LangFile";
import type { MndBiomeSource } from "api/MultiNoiseDiscreteBiomeSource";

const KEY_PREFIX = "extrabiomegen-composer";
const KEY_INLAND = KEY_PREFIX + "/biome_source";
const KEY_BIOMES = KEY_PREFIX + "/catalogue";
const KEY_LANG_FILES = KEY_PREFIX + "/lang/files";
const KEY_LANG_OVERRIDES = KEY_PREFIX + "/lang/overrides";
const KEY_LANG_REMOVALS = KEY_PREFIX + "/lang/removals";

const Local = {
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

  saveBiomeSource (inland: MndBiomeSource) {
    try {
      const json = JSON.stringify(inland);
      localStorage.setItem(KEY_INLAND, json);
    }
    catch (err) {
      console.error("Couldn't save inland", err);
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

  saveBiomes (biomes: Record<string, Biome>) {
    try {
      const json = JSON.stringify(biomes);
      localStorage.setItem(KEY_BIOMES, json);
    }
    catch (err) {
      console.error("Couldn't save biomes", err);
    }
  },

  loadLangFiles () : Record<string, LangFile> | null {
    try {
      const json = localStorage.getItem(KEY_LANG_FILES);
      if (!json) return null;

      return JSON.parse(json) as Record<string, LangFile>;
    }
    catch (err) {
      console.error("Failed to load lang files", err);
      return null;
    }
  },

  saveLangFiles (files: Record<string, LangFile>) {
    try {
      const json = JSON.stringify(files);
      localStorage.setItem(KEY_LANG_FILES, json);
    }
    catch (err) {
      console.error("Failed to save lang files", err);
    }
  },

  loadLangOverrides () : Record<string, LangFile> | null {
    try {
      const json = localStorage.getItem(KEY_LANG_OVERRIDES);
      if (!json) return null;

      return JSON.parse(json) as Record<string, LangFile>;
    }
    catch (err) {
      console.error("Failed to load lang overrides", err);
      return null;
    }
  },

  saveLangOverrides (overrides: Record<string, LangFile>) {
    try {
      const json = JSON.stringify(overrides);
      localStorage.setItem(KEY_LANG_OVERRIDES, json);
    }
    catch (err) {
      console.error("Failed to save lang overrides", err);
    }
  },

  loadLangRemovals () : Record<string, string[]> | null {
    try {
      const json = localStorage.getItem(KEY_LANG_REMOVALS);
      if (!json) return null;

      return JSON.parse(json) as Record<string, string[]>;
    }
    catch (err) {
      console.error("Failed to load lang removals", err);
      return null;
    }
  },

  saveLangRemovals (removals: Record<string, string[]>) {
    try {
      const json = JSON.stringify(removals);
      localStorage.setItem(KEY_LANG_REMOVALS, json);
    }
    catch (err) {
      console.error("Failed to save lang removals", err);
    }
  },
}

export default Local;
