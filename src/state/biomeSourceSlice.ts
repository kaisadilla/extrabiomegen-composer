import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type CaveDepthKey, type ContinentalnessKey, type ErosionKey, type HumidityKey, type LandContinentalnessKey, type LandHumidityKey, type OceanContinentalnessKey, type TemperatureKey, type VoronoiBiomeSource, type WeirdnessKey } from "api/VoronoiBiomeSource";
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

    // #region Land biomes
    addLandBiome (state, action: PayloadAction<{
      c: LandContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: LandHumidityKey,
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

    multiAddLandBiome (state, action: PayloadAction<{
      c: readonly LandContinentalnessKey[],
      e: readonly ErosionKey[],
      t: readonly TemperatureKey[],
      h: readonly LandHumidityKey[],
      w: readonly WeirdnessKey[],
      emptyOnly: boolean,
      biomeId: string,
    }>) {
      const { c, e, t, h, w, emptyOnly, biomeId } = action.payload;

      for (const cs of Object.keys(state.doc.biome_source.land) as LandContinentalnessKey[]) {
        if (c.includes(cs) === false) continue;
        const cont = state.doc.biome_source.land[cs];

        for (const es of Object.keys(cont) as ErosionKey[]) {
          if (e.includes(es) === false) continue;

          for (const ts of Object.keys(cont[es]) as TemperatureKey[]) {
            if (t.includes(ts) === false) continue;

            for (const hs of Object.keys(cont[es][ts]) as LandHumidityKey[]) {
              if (h.includes(hs) === false) continue;

              for (const ws of Object.keys(cont[es][ts][hs]) as WeirdnessKey[]) {
                if (w.includes(ws) === false) continue;
                if (emptyOnly && cont[es][ts][hs][ws].length !== 0) continue;

                cont[es][ts][hs][ws].push(biomeId);
              }
            }
          }
        }
      }
    },

    setLandBiome (state, action: PayloadAction<{
      c: LandContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: LandHumidityKey,
      w: WeirdnessKey,
      index: number,
      biomeId: string,
    }>) {
      const { c, e, t, h, w, index, biomeId } = action.payload;

      state.doc.biome_source.land[c][e][t][h][w][index] = biomeId;
      //state.src.biome_source.land[c][e][t][h][w]
      //  = [...new Set(state.src.biome_source.land[c][e][t][h][w])];
    },

    removeLandBiome (state, action: PayloadAction<{
      c: LandContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: LandHumidityKey,
      w: WeirdnessKey,
      index: number,
    }>) {
      const { c, e, t, h, w, index } = action.payload;

      state.doc.biome_source.land[c][e][t][h][w].splice(index, 1);
    },
    // #endregion Land biomes

    // #region Cave biomes
    addCaveBiome (state, action: PayloadAction<{
      d: CaveDepthKey,
      c: ContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: HumidityKey,
      biomeId: string,
    }>) {
      const { d, c, e, t, h, biomeId } = action.payload;

      state.doc.biome_source.cave[d][c][e][t][h].push(biomeId);
    },

    multiAddCaveBiome (state, action: PayloadAction<{
      d: readonly CaveDepthKey[],
      c: readonly ContinentalnessKey[],
      e: readonly ErosionKey[],
      t: readonly TemperatureKey[],
      h: readonly HumidityKey[],
      emptyOnly: boolean,
      biomeId: string,
    }>) {
      const { d, c, e, t, h, emptyOnly, biomeId } = action.payload;

      for (const ds of Object.keys(state.doc.biome_source.cave) as CaveDepthKey[]) {
        if (d.includes(ds) === false) continue;
        const depth = state.doc.biome_source.cave[ds];

        for (const cs of Object.keys(depth) as ContinentalnessKey[]) {
          if (c.includes(cs) === false) continue;

          for (const es of Object.keys(depth[cs]) as ErosionKey[]) {
            if (e.includes(es) === false) continue;

            for (const ts of Object.keys(depth[cs][es]) as TemperatureKey[]) {
              if (t.includes(ts) === false) continue;

              for (const hs of Object.keys(depth[cs][es][ts]) as HumidityKey[]) {
                if (h.includes(hs) === false) continue;
                if (emptyOnly && depth[cs][es][ts][hs].length !== 0) continue;

                depth[cs][es][ts][hs].push(biomeId);
              }
            }
          }
        }
      }
    },

    setCaveBiome (state, action: PayloadAction<{
      d: CaveDepthKey,
      c: ContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: HumidityKey,
      index: number,
      biomeId: string,
    }>) {
      const { d, c, e, t, h, index, biomeId } = action.payload;

      state.doc.biome_source.cave[d][c][e][t][h][index] = biomeId;
    },

    removeCaveBiome (state, action: PayloadAction<{
      d: CaveDepthKey,
      c: ContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: HumidityKey,
      index: number,
    }>) {
      const { d, c, e, t, h, index } = action.payload;

      state.doc.biome_source.cave[d][c][e][t][h].splice(index, 1);
    },
    // #endregion Cave biomes

    addExoticBiome (state, action: PayloadAction<{
      t: TemperatureKey,
      biomeId: string,
    }>) {
      const { t, biomeId } = action.payload;

      state.doc.biome_source.exotic[t].push(biomeId);
    },

    setExoticBiome (state, action: PayloadAction<{
      t: TemperatureKey,
      index: number,
      biomeId: string,
    }>) {
      const { t, index, biomeId } = action.payload;

      state.doc.biome_source.exotic[t][index] = biomeId;
    },

    removeExoticBiome (state, action: PayloadAction<{
      t: TemperatureKey,
      index: number,
    }>) {
      const { t, index } = action.payload;

      state.doc.biome_source.exotic[t].splice(index, 1);
    },

    addOceanBiome (state, action: PayloadAction<{
      c: OceanContinentalnessKey,
      t: TemperatureKey,
      biomeId: string,
    }>) {
      const { c, t, biomeId } = action.payload;

      state.doc.biome_source.ocean[t][c].push(biomeId);
    },

    setOceanBiome (state, action: PayloadAction<{
      c: OceanContinentalnessKey,
      t: TemperatureKey,
      index: number,
      biomeId: string,
    }>) {
      const { c, t, index, biomeId } = action.payload;

      state.doc.biome_source.ocean[t][c][index] = biomeId;
    },

    removeOceanBiome (state, action: PayloadAction<{
      c: OceanContinentalnessKey,
      t: TemperatureKey,
      index: number,
    }>) {
      const { c, t, index } = action.payload;

      state.doc.biome_source.ocean[t][c].splice(index, 1);
    },
  },
});

export const biomeSourceReducer = biomeSourceSlice.reducer;
export const BiomeSourceActions = biomeSourceSlice.actions;

export default function useBiomeSource () {
  const biomeSource = useSelector((state: RootState) => state.biomeSource);

  return {
    ...biomeSource,
  };
}
