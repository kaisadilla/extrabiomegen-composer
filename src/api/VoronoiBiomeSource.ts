export interface VoronoiBiomeSource {
  type: string;
  settings: string;
  biome_source: {
    type: 'extrabiomegen:voronoi',
    river: {},
    ocean: {},
    land: VoronoiInlandCont;
  }
}

export type VoronoiInlandCont = ContinentalnessCollection<VoronoiInlandErosion>;
export type VoronoiInlandErosion = ErosionCollection<VoronoiInlandTemperature>;
export type VoronoiInlandTemperature = TemperatureCollection<VoronoiInlandHumidity>;
export type VoronoiInlandHumidity = HumidityCollection<VoronoiInlandWeirdness>;
export type VoronoiInlandWeirdness = WeirdnessCollection<string[]>;

export const ContinentalnessKeys
  = ['coast', 'lowland', 'highland', 'interior'] as const;

export type ContinentalnessKey = (typeof ContinentalnessKeys)[number];

export type ContinentalnessCollection<T> = {
  [K in ContinentalnessKey]: T;
};

export const ErosionKeys = ['jagged', 'rugged', 'normal', 'smooth', 'flat'] as const;

export type ErosionKey = (typeof ErosionKeys)[number];

export type ErosionCollection<T> = {
  [K in ErosionKey]: T;
};

export const TemperatureKeys
  = ['frozen', 'cold', 'normal', 'warm', 'hot'] as const;

export type TemperatureKey = (typeof TemperatureKeys)[number];

export type TemperatureCollection<T> = {
  [K in TemperatureKey]: T;
};

export const HumidityKeys = ['arid', 'dry', 'normal', 'wet', 'humid'] as const;

export type HumidityKey = (typeof HumidityKeys)[number];

export type HumidityCollection<T> = {
  [K in HumidityKey]: T;
};

export const WeirdnessKeys = [
  'normal_slope',
  'normal_peak',
  'normal_riverside',
  'variant_riverside',
  'variant_peak',
  'variant_slope'
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
      land: makeContinentalnessCollection(),
    }
  };
}

function makeContinentalnessCollection () : VoronoiInlandCont {
  return {
    coast: makeErosionCollection(),
    lowland: makeErosionCollection(),
    highland: makeErosionCollection(),
    interior: makeErosionCollection(),
  };
}

function makeErosionCollection () : VoronoiInlandErosion {
  return {
    jagged: makeTemperatureCollection(),
    rugged: makeTemperatureCollection(),
    normal: makeTemperatureCollection(),
    smooth: makeTemperatureCollection(),
    flat: makeTemperatureCollection(),
  }
}

function makeTemperatureCollection () : VoronoiInlandTemperature {
  return {
    frozen: makeHumidityCollection(),
    cold: makeHumidityCollection(),
    normal: makeHumidityCollection(),
    warm: makeHumidityCollection(),
    hot: makeHumidityCollection(),
  };
}

function makeHumidityCollection () : VoronoiInlandHumidity {
  return {
    arid: makeWeirdnessCollection(),
    dry: makeWeirdnessCollection(),
    normal: makeWeirdnessCollection(),
    wet: makeWeirdnessCollection(),
    humid: makeWeirdnessCollection(),
  }
}

function makeWeirdnessCollection () : VoronoiInlandWeirdness {
  return {
    normal_slope: [],
    normal_peak: [],
    normal_riverside: [],
    variant_riverside: [],
    variant_peak: [],
    variant_slope: [],
  };
}
