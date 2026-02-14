import { makeTemperatureCollection } from "api/VoronoiBiomeSource";

export function retrofit1 (doc) {
  console.log(doc);
  for (const c of Object.values(doc.biome_source.land)) {
    for (const e of Object.values(c)) {
      for (const t of Object.values(e)) {
        for (const h of Object.keys(t)) {
          const hum = t[h];

          const upd = {
            normal_outer_valley: hum['normal_slope'],
            normal_outer_slope: [],
            normal_outer_peak: hum['normal_peak'],
            normal_inner_slope: [],
            normal_inner_valley: [],
            normal_river_bank: hum['normal_riverside'],
            variant_river_bank: hum['variant_riverside'],
            variant_inner_valley: [],
            variant_inner_slope: [],
            variant_outer_peak: hum['variant_peak'],
            variant_outer_slope: [],
            variant_outer_valley: hum['variant_slope'],
          }

          t[h] = upd;
        }
      }
    }
  }

  for (const c of Object.keys(doc.biome_source.land)) {
    // @ts-ignore
    const obj = doc.biome_source.land[c];

    const upd = {
      jagged: obj.jagged,
      rugged: obj.rugged,
      craggy: makeTemperatureCollection(),
      normal: obj.normal,
      rolling: makeTemperatureCollection(),
      smooth: obj.smooth,
      flat: obj.flat,
    };

    // @ts-ignore
    doc.biome_source.land[c] = upd;
  }

  console.log(doc);
}
