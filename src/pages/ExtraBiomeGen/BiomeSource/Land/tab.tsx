import { type ErosionKey, type LandContinentalnessKey, type LandHumidityKey, type TemperatureKey, type WeirdnessKey } from 'api/MultiNoiseDiscreteBiomeSource';
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

export type BiomeTableLeftClickMode = 'set' | 'add' | 'override';
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
  const land = useSelector(
    (state: RootState) => state.biomeSource.doc.biome_source.land
  );
  const dispatch = useDispatch();

  const landRef = useRef(land);
  const brushRef = useRef(brush);
  const overrideRef = useRef([] as string[]);

  const [lClickMode, setLClickMode] = useState<BiomeTableLeftClickMode>('set');
  const [rClickMode, setRClickMode] = useState<BiomeTableRightClickMode>('pick');
  const [override, setOverride] = useState<string[]>([]);

  useEffect(() => {
    landRef.current = land;
  }, [land]);

  useEffect(() => {
    brushRef.current = brush;
  }, [brush]);

  useEffect(() => {
    overrideRef.current = override;
  }, [override]);

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

  const replaceCell = useCallback((
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    biomeIds: string[],
  ) => {
    dispatch(BiomeSourceActions.setLandCell({
      c,
      e,
      t,
      h,
      w,
      biomeIds,
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

  const handleTableLeftClick = useCallback((
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    i: number,
  ) => {
    const brush = brushRef.current;
    const override = overrideRef.current;

    if (lClickMode === 'add' || i === -1) {
      if (brush) addBiome(c, e, t, h, w, brush);
    }
    else if (lClickMode === 'set') {
      if (brush) replaceBiome(c, e, t, h, w, i, brush);
    }
    else if (lClickMode === 'override') {
      if (override) replaceCell(c, e, t, h, w, override);
    }
  }, [lClickMode, addBiome, replaceBiome]);

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
      if (lClickMode === 'override') {
        setOverride([...landRef.current[c][e][t][h][w]]);
        console.log("OVERRIDE!");
      }
      else {
        const biome = landRef.current[c][e][t][h][w][i];
        if (!biome) return;

        onPickBrush?.(biome);
      }
    }
    else if (rClickMode === 'delete') {
      removeBiome(c, e, t, h, w, i);
    }
  }, [landRef, lClickMode, rClickMode, onPickBrush, removeBiome]);

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
            brush={brush}
            leftClickMode={lClickMode}
            setLeftClickMode={setLClickMode}
            rightClickMode={rClickMode}
            setRightClickMode={setRClickMode}
            overrideCell={override}
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
