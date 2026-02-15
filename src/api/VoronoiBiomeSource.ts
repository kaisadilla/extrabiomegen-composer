export interface VoronoiBiomeSource {
  type: string;
  settings: string;
  biome_source: {
    type: 'extrabiomegen:voronoi';
    river: {};
    ocean: VoronoiOceanTemperature;
    exotic: VoronoiExoticTemperature;
    land: VoronoiLandCont;
    cave: VoronoiCaveDepth;
  }
}

export type VoronoiLandCont = LandContinentalnessCollection<VoronoiLandErosion>;
export type VoronoiLandErosion = ErosionCollection<VoronoiLandTemperature>;
export type VoronoiLandTemperature = TemperatureCollection<VoronoiLandHumidity>;
export type VoronoiLandHumidity = LandHumidityCollection<VoronoiLandWeirdness>;
export type VoronoiLandWeirdness = WeirdnessCollection<string[]>;

export type VoronoiCaveDepth = CaveDepthCollection<VoronoiCaveContinentalness>;
export type VoronoiCaveContinentalness = ContinentalnessCollection<VoronoiCaveErosion>;
export type VoronoiCaveErosion = ErosionCollection<VoronoiCaveTemperature>;
export type VoronoiCaveTemperature = TemperatureCollection<VoronoiCaveHumidity>;
export type VoronoiCaveHumidity = HumidityCollection<string[]>;

export type VoronoiExoticTemperature = TemperatureCollection<string[]>;

export type VoronoiOceanTemperature = TemperatureCollection<VoronoiOceanContinentalness>;
export type VoronoiOceanContinentalness = OceanContinentalnessCollection<string[]>;

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
  'normal_outer_peak',
  'normal_inner_slope',
  'normal_inner_valley',
  'normal_river_bank',
  'variant_river_bank',
  'variant_inner_valley',
  'variant_inner_slope',
  'variant_outer_peak',
  'variant_outer_slope',
  'variant_outer_valley',
] as const;

export type WeirdnessKey = (typeof WeirdnessKeys)[number];

export type WeirdnessCollection<T> = {
  [K in WeirdnessKey]: T;
};

export function makeVoronoiBiomeSource () : VoronoiBiomeSource {
  return {
    type: "minecraft:overworld",
    settings: "minecraft:overworld",
    biome_source: {
      type: 'extrabiomegen:voronoi',
      river: {},
      ocean: makeOceanTemperatureCollection(),
      exotic: makeExoticTemperatureCollection(),
      land: makeContinentalnessCollection(),
      cave: makeCaveDepthCollection(),
    }
  };
}

// #region Land
function makeContinentalnessCollection () : VoronoiLandCont {
  return {
    coast: makeErosionCollection(),
    lowland: makeErosionCollection(),
    highland: makeErosionCollection(),
    interior: makeErosionCollection(),
  };
}

function makeErosionCollection () : VoronoiLandErosion {
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

function makeTemperatureCollection () : VoronoiLandTemperature {
  return {
    frozen: makeHumidityCollection(),
    cold: makeHumidityCollection(),
    normal: makeHumidityCollection(),
    warm: makeHumidityCollection(),
    hot: makeHumidityCollection(),
  };
}

function makeHumidityCollection () : VoronoiLandHumidity {
  return {
    arid: makeWeirdnessCollection(),
    dry: makeWeirdnessCollection(),
    normal: makeWeirdnessCollection(),
    wet: makeWeirdnessCollection(),
    humid: makeWeirdnessCollection(),
  }
}

function makeWeirdnessCollection () : VoronoiLandWeirdness {
  return {
    normal_outer_valley: [],
    normal_outer_slope: [],
    normal_outer_peak: [],
    normal_inner_slope: [],
    normal_inner_valley: [],
    normal_river_bank: [],
    variant_river_bank: [],
    variant_inner_valley: [],
    variant_inner_slope: [],
    variant_outer_peak: [],
    variant_outer_slope: [],
    variant_outer_valley: [],
  };
}
// #endregion Land

// #region Cave
function makeCaveDepthCollection () : VoronoiCaveDepth {
  return {
    shallow: makeCaveContinentalnessCollection(),
    normal: makeCaveContinentalnessCollection(),
    deep: makeCaveContinentalnessCollection(),
    very_deep: makeCaveContinentalnessCollection(),
  };
}

function makeCaveContinentalnessCollection () : VoronoiCaveContinentalness {
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

function makeCaveErosionCollection () : VoronoiCaveErosion {
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

function makeCaveTemperatureCollection () : VoronoiCaveTemperature {
  return {
    frozen: makeCaveHumidityCollection(),
    cold: makeCaveHumidityCollection(),
    normal: makeCaveHumidityCollection(),
    warm: makeCaveHumidityCollection(),
    hot: makeCaveHumidityCollection(),
  };
}

function makeCaveHumidityCollection () : VoronoiCaveHumidity {
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

function makeExoticTemperatureCollection () : VoronoiExoticTemperature {
  return {
    frozen: [],
    cold: [],
    normal: [],
    warm: [],
    hot: [],
  }
}

function makeOceanTemperatureCollection () : VoronoiOceanTemperature {
  return {
    frozen: makeOceanContinentalnessCollection(),
    cold: makeOceanContinentalnessCollection(),
    normal: makeOceanContinentalnessCollection(),
    warm: makeOceanContinentalnessCollection(),
    hot: makeOceanContinentalnessCollection(),
  };
}

function makeOceanContinentalnessCollection () : VoronoiOceanContinentalness {
  return {
    shallow: [],
    deep: [],
  };
}
