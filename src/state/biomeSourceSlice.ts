import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ContinentalnessKey, type ErosionKey, type HumidityKey, type TemperatureKey, type VoronoiBiomeSource, type WeirdnessKey } from "api/VoronoiBiomeSource";
import vanillaDoc from 'data/minecraft/dimension/overworld.json';
import Local from "Local";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

export interface BiomeSourceState {
  doc: VoronoiBiomeSource;
}

let doc = Local.loadInland();
doc ??= vanillaDoc as VoronoiBiomeSource;

const initialState: BiomeSourceState = {
  doc,
}

const biomeSourceSlice = createSlice({
  name: 'biomeSource',
  initialState,
  reducers: {
    loadBiomeSource (state, action: PayloadAction<VoronoiBiomeSource>) {
      state.doc = action.payload;
    },

    addInlandBiome (state, action: PayloadAction<{
      c: ContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: HumidityKey,
      w: WeirdnessKey,
      biomeId: string,
    }>) {
      const { c, e, t, h, w, biomeId } = action.payload;

      //const set = new Set(state.src.biome_source.land[c][e][t][h][w]);
      //set.add(biomeId);
      //
      //state.src.biome_source.land[c][e][t][h][w] = [...set];
      state.doc.biome_source.land[c][e][t][h][w].push(biomeId);
    },

    propagateInitialLandBiome (state, action: PayloadAction<{
      c: ContinentalnessKey,
      t: TemperatureKey,
      h: HumidityKey,
      biomeId: string,
    }>) {
      const { c, t, h, biomeId } = action.payload;

      for (const e of Object.values(state.doc.biome_source.land[c])) {
        for (const w of Object.keys(e[t][h])) {
          if (e[t][h][w as WeirdnessKey].length === 0) {
            e[t][h][w as WeirdnessKey].push(biomeId);
          }
        }
      }
    },

    setInlandBiome (state, action: PayloadAction<{
      c: ContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: HumidityKey,
      w: WeirdnessKey,
      index: number,
      biomeId: string,
    }>) {
      const { c, e, t, h, w, index, biomeId } = action.payload;

      state.doc.biome_source.land[c][e][t][h][w][index] = biomeId;
      //state.src.biome_source.land[c][e][t][h][w]
      //  = [...new Set(state.src.biome_source.land[c][e][t][h][w])];
    },

    removeInlandBiome (state, action: PayloadAction<{
      c: ContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: HumidityKey,
      w: WeirdnessKey,
      index: number,
    }>) {
      const { c, e, t, h, w, index } = action.payload;

      state.doc.biome_source.land[c][e][t][h][w].splice(index, 1);
    },
  },
});

export const biomeSourceReducer = biomeSourceSlice.reducer;
export const biomeSourceActions = biomeSourceSlice.actions;

export default function useBiomeSource () {
  const biomeSource = useSelector((state: RootState) => state.biomeSource);

  return {
    ...biomeSource,
  };
}
