export interface MndBiomeSource {
  type: string;
  settings: string;
  biome_source: {
    type: 'extrabiomegen:multinoise_discrete';
    region_size?: number;
    biome_size?: number;
    ocean: MndOceanTemperature;
    exotic: MndExoticTemperature;
    land_placement_mode?: BiomePlacementMode;
    land: MndLandCont;
    cave: MndCaveDepth;
  }
}

export type BiomePlacementMode = 'terrain' | 'voronoi' | 'mixed';

export type MndRiverTemperature = TemperatureCollection<MndRiverHumidity>;
export type MndRiverHumidity = LandHumidityCollection<string[]>;

export type MndOceanTemperature = TemperatureCollection<MndOceanContinentalness>;
export type MndOceanContinentalness = OceanContinentalnessCollection<string[]>;

export type MndExoticTemperature = TemperatureCollection<string[]>;

export type MndLandCont = LandContinentalnessCollection<MndLandErosion>;
export type MndLandErosion = ErosionCollection<MndLandTemperature>;
export type MndLandTemperature = TemperatureCollection<MndLandHumidity>;
export type MndLandHumidity = LandHumidityCollection<MndLandWeirdness>;
export type MndLandWeirdness = WeirdnessCollection<string[]>;

export type MndCaveDepth = CaveDepthCollection<MndCaveContinentalness>;
export type MndCaveContinentalness = ContinentalnessCollection<MndCaveErosion>;
export type MndCaveErosion = ErosionCollection<MndCaveTemperature>;
export type MndCaveTemperature = TemperatureCollection<MndCaveHumidity>;
export type MndCaveHumidity = HumidityCollection<string[]>;

export const OceanContinentalnessKeys = [
  'shallow',
  'deep',
] as const;

export type OceanContinentalnessKey = (typeof OceanContinentalnessKeys)[number];

export type OceanContinentalnessCollection<T> = {
  [K in OceanContinentalnessKey]: T;
};

export const CaveDepthKeys = [
  'shallow',
  'normal',
  'deep',
  'very_deep',
] as const;

export type CaveDepthKey = (typeof CaveDepthKeys)[number];

export type CaveDepthCollection<T> = {
  [K in CaveDepthKey]: T;
};

export const ContinentalnessKeys = [
  'exotic',
  'deep_ocean',
  'ocean',
  'coast',
  'lowland',
  'highland',
  'interior',
  'deep_interior',
] as const;

export type ContinentalnessKey = (typeof ContinentalnessKeys)[number];

export type ContinentalnessCollection<T> = {
  [K in ContinentalnessKey]: T;
};

export const LandContinentalnessKeys = [
  'coast',
  'lowland',
  'highland',
  'interior',
] as const;

export type LandContinentalnessKey = (typeof LandContinentalnessKeys)[number];

export type LandContinentalnessCollection<T> = {
  [K in LandContinentalnessKey]: T;
};

export const ErosionKeys = [
  'jagged',
  'rugged',
  'craggy',
  'normal',
  'rolling',
  'smooth',
  'flat',
] as const;

export type ErosionKey = (typeof ErosionKeys)[number];

export type ErosionCollection<T> = {
  [K in ErosionKey]: T;
};

export const TemperatureKeys = [
  'frozen',
  'cold',
  'normal',
  'warm',
  'hot',
] as const;

export type TemperatureKey = (typeof TemperatureKeys)[number];

export type TemperatureCollection<T> = {
  [K in TemperatureKey]: T;
};

export const HumidityKeys = [
  'arid',
  'dry',
  'normal',
  'wet',
  'humid',
  'lush',
] as const;

export type HumidityKey = (typeof HumidityKeys)[number];

export type HumidityCollection<T> = {
  [K in HumidityKey]: T;
};

export const LandHumidityKeys = [
  'arid',
  'dry',
  'normal',
  'wet',
  'humid',
] as const;

export type LandHumidityKey = (typeof LandHumidityKeys)[number];

export type LandHumidityCollection<T> = {
  [K in LandHumidityKey]: T;
};

export const WeirdnessKeys = [
  'normal_outer_valley',
  'normal_outer_slope',
  'normal_peak',
  'normal_inner_slope',
  'normal_inner_valley',
  'normal_river_bank',
  'river_override',
  'variant_river_bank',
  'variant_inner_valley',
  'variant_inner_slope',
  'variant_peak',
  'variant_outer_slope',
  'variant_outer_valley',
] as const;

export type WeirdnessKey = (typeof WeirdnessKeys)[number];

export type WeirdnessCollection<T> = {
  [K in WeirdnessKey]: T;
};

export function makeMndBiomeSource () : MndBiomeSource {
  return {
    type: "minecraft:overworld",
    settings: "minecraft:overworld",
    biome_source: {
      type: 'extrabiomegen:multinoise_discrete',
      ocean: makeOceanTemperatureCollection(),
      exotic: makeExoticTemperatureCollection(),
      land: makeContinentalnessCollection(),
      cave: makeCaveDepthCollection(),
    }
  };
}

// #region River
function makeriverTemperatureCollection () : MndRiverTemperature {
  return {
    frozen: makeRiverHumidityCollection(),
    cold: makeRiverHumidityCollection(),
    normal: makeRiverHumidityCollection(),
    warm: makeRiverHumidityCollection(),
    hot: makeRiverHumidityCollection(),
  };
}

function makeRiverHumidityCollection () : MndRiverHumidity {
  return {
    arid: [],
    dry: [],
    normal: [],
    wet: [],
    humid: [],
  };
}
// #endregion River

// #region Ocean
function makeOceanTemperatureCollection () : MndOceanTemperature {
  return {
    frozen: makeOceanContinentalnessCollection(),
    cold: makeOceanContinentalnessCollection(),
    normal: makeOceanContinentalnessCollection(),
    warm: makeOceanContinentalnessCollection(),
    hot: makeOceanContinentalnessCollection(),
  };
}

function makeOceanContinentalnessCollection () : MndOceanContinentalness {
  return {
    shallow: [],
    deep: [],
  };
}
// #endregion Ocean

function makeExoticTemperatureCollection () : MndExoticTemperature {
  return {
    frozen: [],
    cold: [],
    normal: [],
    warm: [],
    hot: [],
  }
}

// #region Land
function makeContinentalnessCollection () : MndLandCont {
  return {
    coast: makeErosionCollection(),
    lowland: makeErosionCollection(),
    highland: makeErosionCollection(),
    interior: makeErosionCollection(),
  };
}

function makeErosionCollection () : MndLandErosion {
  return {
    jagged: makeTemperatureCollection(),
    rugged: makeTemperatureCollection(),
    craggy: makeTemperatureCollection(),
    normal: makeTemperatureCollection(),
    rolling: makeTemperatureCollection(),
    smooth: makeTemperatureCollection(),
    flat: makeTemperatureCollection(),
  }
}

function makeTemperatureCollection () : MndLandTemperature {
  return {
    frozen: makeHumidityCollection(),
    cold: makeHumidityCollection(),
    normal: makeHumidityCollection(),
    warm: makeHumidityCollection(),
    hot: makeHumidityCollection(),
  };
}

function makeHumidityCollection () : MndLandHumidity {
  return {
    arid: makeWeirdnessCollection(),
    dry: makeWeirdnessCollection(),
    normal: makeWeirdnessCollection(),
    wet: makeWeirdnessCollection(),
    humid: makeWeirdnessCollection(),
  }
}

function makeWeirdnessCollection () : MndLandWeirdness {
  return {
    normal_outer_valley: [],
    normal_outer_slope: [],
    normal_peak: [],
    normal_inner_slope: [],
    normal_inner_valley: [],
    normal_river_bank: [],
    river_override: [],
    variant_river_bank: [],
    variant_inner_valley: [],
    variant_inner_slope: [],
    variant_peak: [],
    variant_outer_slope: [],
    variant_outer_valley: [],
  };
}
// #endregion Land

// #region Cave
function makeCaveDepthCollection () : MndCaveDepth {
  return {
    shallow: makeCaveContinentalnessCollection(),
    normal: makeCaveContinentalnessCollection(),
    deep: makeCaveContinentalnessCollection(),
    very_deep: makeCaveContinentalnessCollection(),
  };
}

function makeCaveContinentalnessCollection () : MndCaveContinentalness {
  return {
    exotic: makeCaveErosionCollection(),
    deep_ocean: makeCaveErosionCollection(),
    ocean: makeCaveErosionCollection(),
    coast: makeCaveErosionCollection(),
    lowland: makeCaveErosionCollection(),
    highland: makeCaveErosionCollection(),
    interior: makeCaveErosionCollection(),
    deep_interior: makeCaveErosionCollection(),
  };
}

function makeCaveErosionCollection () : MndCaveErosion {
  return  {
    jagged: makeCaveTemperatureCollection(),
    rugged: makeCaveTemperatureCollection(),
    craggy: makeCaveTemperatureCollection(),
    normal: makeCaveTemperatureCollection(),
    rolling: makeCaveTemperatureCollection(),
    smooth: makeCaveTemperatureCollection(),
    flat: makeCaveTemperatureCollection(),
  };
}

function makeCaveTemperatureCollection () : MndCaveTemperature {
  return {
    frozen: makeCaveHumidityCollection(),
    cold: makeCaveHumidityCollection(),
    normal: makeCaveHumidityCollection(),
    warm: makeCaveHumidityCollection(),
    hot: makeCaveHumidityCollection(),
  };
}

function makeCaveHumidityCollection () : MndCaveHumidity {
  return {
    arid: [],
    dry: [],
    normal: [],
    wet: [],
    humid: [],
    lush: [],
  };
}
// #endregion Cave
