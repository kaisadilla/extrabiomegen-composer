import { ErosionKeys, WeirdnessKeys, type ErosionKey, type LandContinentalnessKey, type LandHumidityKey, type TemperatureKey, type WeirdnessKey } from 'api/MultiNoiseDiscreteBiomeSource';
import ResizableSeparator from 'components/ResizableSeparator';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Group, Panel } from 'react-resizable-panels';
import { BiomeSourceActions } from 'state/biomeSourceSlice';
import type { RootState } from 'state/store';
import Settings from './Settings';
import styles from './tab.module.scss';
import TableMatrix from './TableMatrix';

export interface LandTabProps {
  brush: string | null;
  onPickBrush: (brush: string) => void;
}

export type BiomeTableSetMode = 'replace' | 'add';
export type BiomeTableRightClickMode = 'pick' | 'delete';

export type BiomeIdCallback = (
  c: LandContinentalnessKey,
  e: ErosionKey,
  t: TemperatureKey,
  h: LandHumidityKey,
  w: WeirdnessKey,
  i: number,
) => void;

const LandTab = memo(function LandTab ({
  brush,
  onPickBrush,
}: LandTabProps) {
  const src = useSelector((state: RootState) => state.biomeSource);
  const dispatch = useDispatch();

  const brushRef = useRef(brush);

  const [setMode, setSetMode] = useState<BiomeTableSetMode>('replace');
  const [rClickMode, setRClickMode] = useState<BiomeTableRightClickMode>('pick');

  useEffect(() => {
    brushRef.current = brush;
  }, [brush]);

  const biomes: string[][][] = [];

  for (let x = 0; x < ErosionKeys.length; x++) {
    biomes[x] = [];

    for (let y = 0; y < WeirdnessKeys.length; y++) {
      biomes[x][y] = src.doc.biome_source.land.coast[ErosionKeys[x]].cold.arid[WeirdnessKeys[y]];
    }
  }

  for (const e of ErosionKeys) {
    biomes.push()
  }

  const addBiome = useCallback((
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    biomeId: string,
  ) => {
    dispatch(BiomeSourceActions.addLandBiome({
      c,
      e,
      t,
      h,
      w,
      biomeId,
    }));
  }, [dispatch]);

  const replaceBiome = useCallback((
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    index: number,
    biomeId: string,
  ) => {
    dispatch(BiomeSourceActions.setLandBiome({
      c,
      e,
      t,
      h,
      w,
      index,
      biomeId,
    }));
  }, [dispatch]);

  const removeBiome = useCallback((
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    index: number,
  ) => {
    dispatch(BiomeSourceActions.removeLandBiome({
      c,
      e,
      t,
      h,
      w,
      index,
    }));
  }, [dispatch]);

  const handleTableLeftClick = useCallback((
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    i: number,
  ) => {
    const brush = brushRef.current;
    if (!brush) return;
    console.log(i);

    if (setMode === 'add' || i === -1) {
      addBiome(c, e, t, h, w, brush);
    }
    else if (setMode === 'replace') {
      replaceBiome(c, e, t, h, w, i, brush);
    }
  }, [setMode, addBiome, replaceBiome]);

  const handleTableRightClick = useCallback((
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    i: number,
  ) => {
    if (i === -1) return;

    if (rClickMode === 'pick') {
      const biome = src.doc.biome_source.land[c][e][t][h][w][i];
      if (!biome) return;

      onPickBrush?.(biome);
    }
    else if (rClickMode === 'delete') {
      removeBiome(c, e, t, h, w, i);
    }
  }, [rClickMode, onPickBrush, removeBiome]);

  return (
    <div className={styles.tab}>
      <Group
        className={styles.content}
        orientation='horizontal'
        id='ebg-biome-source-land'
      >
        <Panel
          className={styles.settingsPanel}
          defaultSize={1}
        >
          <Settings
            setMode={setMode}
            setSetMode={setSetMode}
            rightClickMode={rClickMode}
            setRightClickMode={setRClickMode}
          />
        </Panel>
        <ResizableSeparator />
        <Panel
          className={styles.tablePanel}
          defaultSize={8}
        >
          <TableMatrix
            onLeftClick={handleTableLeftClick}
            onRightClick={handleTableRightClick}
          />
        </Panel>
      </Group>
    </div>
  );
});

export default LandTab;
