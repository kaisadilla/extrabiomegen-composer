import { ErosionKeys, WeirdnessKeys, type LandContinentalnessKey, type LandHumidityKey, type TemperatureKey } from "api/MultiNoiseDiscreteBiomeSource";
import BiomeTable2 from "components/BiomeTable2";
import { memo, useCallback, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "state/store";
import type { BiomeIdCallback } from "./tab";



export interface TableProps {
  continentalness: LandContinentalnessKey;
  temperature: TemperatureKey;
  humidity: LandHumidityKey;
  onLeftClick?: BiomeIdCallback;
  onRightClick?: BiomeIdCallback;
}

const Table = memo(function Table ({
  continentalness: c,
  temperature: t,
  humidity: h,
  onLeftClick,
  onRightClick,
}: TableProps) {
  const land = useSelector(
    (state: RootState) => state.biomeSource.doc.biome_source.land
  );

  const prevBiomes = useRef<string[][][]>(null);

  const biomes = useMemo(() => {
    let dirty = prevBiomes.current === null;
    const result: string[][][] = [];

    for (let x = 0; x < WeirdnessKeys.length; x++) {
      result[x] = [];

      for (let y = 0; y < ErosionKeys.length; y++) {
        result[x][y] = land[c][ErosionKeys[y]][t][h][WeirdnessKeys[x]];

        if (dirty) continue;

        if (result[x][y].length !== prevBiomes.current![x][y].length) {
          dirty = true;
        }
        else for (let z = 0; z < result[x][y].length; z++) {
          if (result[x][y][z] !== prevBiomes.current![x][y][z]) dirty = true;
        }
      }
    }

    prevBiomes.current = dirty ? result : prevBiomes.current;

    return prevBiomes.current!;
  }, [land, c, t, h]);

  const rowNames = useMemo(
    () => WeirdnessKeys.map(w => `w = ${w}`),
    []
  );

  const colNames = useMemo(
    () => ErosionKeys.map(e => `e = ${e}`),
    []
  );

  const handleLeftClick = useCallback((
    row: number, col: number, index: number
  ) => {
    onLeftClick?.(c, ErosionKeys[col], t, h, WeirdnessKeys[row], index);
  }, [onLeftClick]);

  const handleRightClick = useCallback((
    row: number, col: number, index: number
  ) => {
    onRightClick?.(c, ErosionKeys[col], t, h, WeirdnessKeys[row], index);
  }, [onRightClick]);

  return (
    <BiomeTable2
      values={biomes}
      rowNames={rowNames}
      columnNames={colNames}
      onLeftClick={handleLeftClick}
      onRightClick={handleRightClick}
    />
  );
});

export default Table;
