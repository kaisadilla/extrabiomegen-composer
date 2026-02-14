export interface VoronoiBiomeSource {
  type: string;
  settings: string;
  biome_source: {
    type: 'extrabiomegen:voronoi',
    river: {},
    ocean: {},
    exotic: VoronoiExoticTemperature;
    land: VoronoiLandCont;
  }
}

export type VoronoiLandCont = ContinentalnessCollection<VoronoiLandErosion>;
export type VoronoiLandErosion = ErosionCollection<VoronoiLandTemperature>;
export type VoronoiLandTemperature = TemperatureCollection<VoronoiLandHumidity>;
export type VoronoiLandHumidity = HumidityCollection<VoronoiLandWeirdness>;
export type VoronoiLandWeirdness = WeirdnessCollection<string[]>;

export type VoronoiExoticTemperature = TemperatureCollection<string[]>;

export const ContinentalnessKeys = [
  'coast',
  'lowland',
  'highland',
  'interior',
] as const;

export type ContinentalnessKey = (typeof ContinentalnessKeys)[number];

export type ContinentalnessCollection<T> = {
  [K in ContinentalnessKey]: T;
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
] as const;

export type HumidityKey = (typeof HumidityKeys)[number];

export type HumidityCollection<T> = {
  [K in HumidityKey]: T;
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
      ocean: {},
      exotic: makeExoticTemperatureCollection(),
      land: makeContinentalnessCollection(),
    }
  };
}

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

function makeExoticTemperatureCollection () : VoronoiExoticTemperature {
  return {
    frozen: [],
    cold: [],
    normal: [],
    warm: [],
    hot: [],
  }
}
