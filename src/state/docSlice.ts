import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Biome } from "api/Biome";
import { makeVoronoiBiomeSource, type ContinentalnessKey, type ErosionKey, type HumidityKey, type TemperatureKey, type VoronoiBiomeSource, type WeirdnessKey } from "api/VoronoiBiomeSource";
import biomeJson from 'data/minecraft/biomes.json';
import Local from "Local";

export interface DocState {
  src: VoronoiBiomeSource;
  biomes: Record<string, Biome>;
}

let biomeObj = Local.loadBiomes();
if (biomeObj === null) {
  biomeObj = {};
  for (const b of biomeJson) {
    biomeObj[b.id] = b;
  }
}

let src = Local.loadInland();
src ??= makeVoronoiBiomeSource();

const initialState: DocState = {
  src,
  biomes: biomeObj,
}

const docSlice = createSlice({
  name: 'doc',
  initialState,
  reducers: {
    addInlandBiome (state, action: PayloadAction<{
      c: ContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: HumidityKey,
      w: WeirdnessKey,
      biomeId: string
    }>) {
      const { c, e, t, h, w, biomeId } = action.payload;

      const set = new Set(state.src.biome_source.land[c][e][t][h][w]);
      set.add(biomeId);

      state.src.biome_source.land[c][e][t][h][w] = [...set];
    },

    setInlandBiome (state, action: PayloadAction<{
      c: ContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: HumidityKey,
      w: WeirdnessKey,
      index: number,
      biomeId: string
    }>) {
      const { c, e, t, h, w, index, biomeId } = action.payload;

      state.src.biome_source.land[c][e][t][h][w][index] = biomeId;
      state.src.biome_source.land[c][e][t][h][w]
        = [...new Set(state.src.biome_source.land[c][e][t][h][w])];
    },

    removeInlandBiome (state, action: PayloadAction<{
      c: ContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: HumidityKey,
      w: WeirdnessKey,
      index: number
    }>) {
      const { c, e, t, h, w, index } = action.payload;

      state.src.biome_source.land[c][e][t][h][w].splice(index, 1);
    },

    addBiome (state, action: PayloadAction<string>) {
      state.biomes[action.payload] = {
        id: action.payload,
        name: action.payload.split(":")[1] ?? action.payload,
        color: "#00ff00",
      };
    },

    setBiomeName (state, action: PayloadAction<{
      id: string;
      name: string;
    }>) {
      const { id, name } = action.payload;

      state.biomes[id].name = name;
    },

    setBiomeColor (state, action: PayloadAction<{
      id: string;
      color: string;
    }>) {
      const { id, color } = action.payload;

      state.biomes[id].color = color;
    },
  },
});

export const docReducer = docSlice.reducer;
export const DocActions = docSlice.actions;
