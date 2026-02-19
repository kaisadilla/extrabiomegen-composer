import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type CaveDepthKey, type ContinentalnessKey, type ErosionKey, type HumidityKey, type LandContinentalnessKey, type LandHumidityKey, type MndBiomeSource, type OceanContinentalnessKey, type TemperatureKey, type WeirdnessKey } from "api/MultiNoiseDiscreteBiomeSource";
import vanillaDoc from 'data/minecraft/dimension/overworld.json';
import Local from "Local";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

export interface BiomeSourceState {
  doc: MndBiomeSource;
}

let doc = Local.loadBiomeSource();

doc ??= vanillaDoc as MndBiomeSource;

const initialState: BiomeSourceState = {
  doc,
}

const biomeSourceSlice = createSlice({
  name: 'biomeSource',
  initialState,
  reducers: {
    loadBiomeSource (state, action: PayloadAction<MndBiomeSource>) {
      state.doc = action.payload;
    },

    // #region River biomes
    addRiverBiome (state, action: PayloadAction<{
      t: TemperatureKey,
      h: LandHumidityKey,
      biomeId: string,
    }>) {
      const { t, h, biomeId } = action.payload;

      state.doc.biome_source.river[t][h].push(biomeId);
    },

    multiAddRiverBiome (state, action: PayloadAction<{
      t: readonly TemperatureKey[],
      h: readonly LandHumidityKey[],
      emptyOnly: boolean,
      biomeId: string,
    }>) {
      const { t, h, emptyOnly, biomeId } = action.payload;

      for (const ts of Object.keys(state.doc.biome_source.river) as TemperatureKey[]) {
        if (t.includes(ts) === false) continue;
        const temp = state.doc.biome_source.river[ts];

        for (const hs of Object.keys(temp) as LandHumidityKey[]) {
          if (h.includes(hs) === false) continue;
          if (emptyOnly && temp[hs].length !== 0) continue;

          temp[hs].push(biomeId);
        }
      }
    },

    setRiverBiome (state, action: PayloadAction<{
      t: TemperatureKey,
      h: LandHumidityKey,
      index: number,
      biomeId: string,
    }>) {
      const { t, h, index, biomeId } = action.payload;

      state.doc.biome_source.river[t][h][index] = biomeId;
    },

    removeRiverBiome (state, action: PayloadAction<{
      t: TemperatureKey,
      h: LandHumidityKey,
      index: number,
    }>) {
      const { t, h, index } = action.payload;

      state.doc.biome_source.river[t][h].splice(index, 1);
    },
    // #endregion River biomes

    // #region Land biomes
    addLandBiome (state, action: PayloadAction<{
      c: LandContinentalnessKey,
      e: ErosionKey,
      t: TemperatureKey,
      h: LandHumidityKey,
      w: WeirdnessKey,
      biomeId: string | null,
    }>) {
      const { c, e, t, h, w, biomeId } = action.payload;

      state.doc.biome_source.land[c][e][t][h][w].push(biomeId);
    },

    multiAddLandBiome (state, action: PayloadAction<{
      c: readonly LandContinentalnessKey[],
      e: readonly ErosionKey[],
      t: readonly TemperatureKey[],
      h: readonly LandHumidityKey[],
      w: readonly WeirdnessKey[],
      emptyOnly: boolean,
      biomeId: string | null,
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
      biomeId: string | null,
    }>) {
      const { c, e, t, h, w, index, biomeId } = action.payload;

      state.doc.biome_source.land[c][e][t][h][w][index] = biomeId;
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

    // #region Exotic biomes
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
    // #endregion Exotic biomes

    // #region Ocean biomes
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
    // #endregion Ocean biomes
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
