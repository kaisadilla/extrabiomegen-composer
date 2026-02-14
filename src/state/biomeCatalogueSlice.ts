import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Biome } from "api/Biome";
import vanillaBiomesJson from 'data/minecraft/biomes.json';
import Local from "Local";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

interface BiomeCatalogueSlice {
  biomes: Record<string, Biome>;
}

let biomeObj = Local.loadBiomes();
if (biomeObj === null) {
  biomeObj = {};
  for (const b of vanillaBiomesJson) {
    biomeObj[b.id] = b;
  }
}

const initialState: BiomeCatalogueSlice = {
  biomes: biomeObj,
}

const biomeCatalogueSlice = createSlice({
  name: 'biomeCatalogue',
  initialState,
  reducers: {
    loadBiomeCatalogue (state, action: PayloadAction<Biome[]>) {
      state.biomes = {};

      for (const b of action.payload) {
        state.biomes[b.id] = b;
      }
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
  }
});

export const biomeCatalogueReducer = biomeCatalogueSlice.reducer;
export const BiomeCatalogueActions = biomeCatalogueSlice.actions;

export default function useBiomeCatalogue () {
  const catalogue = useSelector((state: RootState) => state.biomeCatalogue);

  return {
    ...catalogue,
  };
}
