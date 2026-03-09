import { SegmentedControl, Tooltip } from '@mantine/core';
import _OLD_BiomeTable from '_discard/BiomeTable';
import { ErosionKeys, LandContinentalnessKeys, LandHumidityKeys, TemperatureKeys, WeirdnessKeys, type ErosionKey, type LandContinentalnessKey, type LandHumidityKey, type TemperatureKey, type WeirdnessKey } from 'api/MultiNoiseDiscreteBiomeSource';
import { memo, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import useBiomeSource, { BiomeSourceActions } from 'state/biomeSourceSlice';
import { $cl } from 'utils';
import styles from './tab.module.scss';

export interface LandTabProps {
  active: boolean;
  brush: string | null;
  onPickBrush: (brush: string) => void;
}

const LandTab = memo(function LandTab ({
  active,
  brush,
  onPickBrush,
}: LandTabProps) {
  const src = useBiomeSource();
  const dispatch = useDispatch();

  const [c, setC] = useState<LandContinentalnessKey>('coast');

  if (!active) return null;

  return (
    <div className={styles.tab}>
      <div className={styles.continentalness}>
        <Tooltip label='Continentalness'><div>c =&nbsp;</div></Tooltip>
        <SegmentedControl
          data={LandContinentalnessKeys.map(k => ({ value: k, label: k }))}
          value={c}
          onChange={v => setC(v as LandContinentalnessKey)}
        />
      </div>
      <div className={styles.matrixContainer}>
        <div className={styles.matrix}>
          <div className={styles.row}>
            <div className={styles.cell}></div>
            {TemperatureKeys.map(t => (
              <div
                key={t}
                className={$cl(styles.cell, styles.head)}
              >
                <Tooltip label='Temperature'>
                  <span>t = {t}</span>
                </Tooltip>
              </div>
            ))}
          </div>
          {LandHumidityKeys.map(h => (
            <div key={h} className={styles.row}>
              <div className={$cl(styles.cell, styles.head, styles.vertical)}>
                <Tooltip label='Humidity'>
                  <span>h = {h}</span>
                </Tooltip>
              </div>
              {TemperatureKeys.map(t => (
                <div key={t} className={$cl(styles.cell, styles.tableContainer)}>
                  {false && <_Table
                    brush={brush}
                    onPickBrush={onPickBrush}
                    continentalness={c}
                    temperature={t}
                    humidity={h}
                  />}
                  {true && <_OLD_BiomeTable
                    columnName="Erosion"
                    columnKeys={ErosionKeys}
                    getColumnHead={k => `e = ${k}`}
                    rowName="Weirdness"
                    rowKeys={WeirdnessKeys}
                    getRowHead={k => `w = ${k}`}
                    getBiomes={(w, e) => src.doc.biome_source.land[c][e][t][h][w]}
                    riverIndex={6}
                    onAdd={(w, e) => handleAdd(c, e, t, h, w)}
                    onMultiAdd={(w, e, row, col) => handleMultiAdd(row, col, c, e, t, h, w)}
                    onSet={(w, e, i) => handleSet(c, e, t, h, w, i)}
                    onRemove={(w, e, i) => handleRemove(c, e, t, h, w, i)}
                    onPickBiome={onPickBrush}
                  />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function handleAdd (
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
  ) {
    if (!brush) return;

    dispatch(BiomeSourceActions.addLandBiome({
      c,
      e,
      t,
      h,
      w,
      biomeId: brush,
    }));
  }
  
  function handleMultiAdd (
    row: boolean,
    col: boolean,
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
  ) {
    if (!brush) return;

    const emptyOnly = src.doc.biome_source.land[c][e][t][h][w].length === 0;

    dispatch(BiomeSourceActions.multiAddLandBiome({
      c: [c],
      e: col ? ErosionKeys : [e],
      t: [t],
      h: [h],
      w: row ? WeirdnessKeys : [w],
      emptyOnly,
      biomeId: brush,
    }));
  }

  function handleSet (
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    index: number,
  ) {
    if (!brush) return;

    dispatch(BiomeSourceActions.setLandBiome({
      c,
      e,
      t,
      h,
      w,
      index: index,
      biomeId: brush,
    }));
  }

  function handleRemove (
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    index: number,
  ) {
    dispatch(BiomeSourceActions.removeLandBiome({
      c,
      e,
      t,
      h,
      w,
      index: index,
    }));
  }
});

interface _TableProps {
  brush: string | null;
  onPickBrush: (brush: string) => void;
  continentalness: LandContinentalnessKey;
  temperature: TemperatureKey;
  humidity: LandHumidityKey;
}

const _Table = memo(function _Table ({
  brush,
  onPickBrush,
  continentalness: c,
  temperature: t,
  humidity: h,
}: _TableProps) {
  const src = useBiomeSource();
  const dispatch = useDispatch();

  const getColHead = useCallback(
    (e: ErosionKey) => `e = ${e}`,
    [c, t, h]
  );

  const getRowHead = useCallback(
    (w: WeirdnessKey) => `w = ${w}`,
    [c, t, h]
  );

  const getBiomes = useCallback(
    (w: WeirdnessKey, e: ErosionKey) => src.doc.biome_source.land[c][e][t][h][w],
    [c, t, h]
  );

  const onAdd = useCallback(
    (w: WeirdnessKey, e: ErosionKey) => handleAdd(c, e, t, h, w),
    [c, t, h]
  );

  const onMultiAdd = useCallback(
    (w: WeirdnessKey, e: ErosionKey, row: boolean, col: boolean) =>
      handleMultiAdd(row, col, c, e, t, h, w),
    [c, t, h]
  );

  const onSet = useCallback(
    (w: WeirdnessKey, e: ErosionKey, i: number) => handleSet(c, e, t, h, w, i),
    [c, t, h]
  );

  const onRemove = useCallback(
    (w: WeirdnessKey, e: ErosionKey, i: number) => handleRemove(c, e, t, h, w, i),
    [c, t, h]
  );

  return (
    <_OLD_BiomeTable
      columnName="Erosion"
      columnKeys={ErosionKeys}
      getColumnHead={getColHead}
      rowName="Weirdness"
      rowKeys={WeirdnessKeys}
      getRowHead={getRowHead}
      getBiomes={getBiomes}
      riverIndex={6}
      onAdd={onAdd}
      onMultiAdd={onMultiAdd}
      onSet={onSet}
      onRemove={onRemove}
      onPickBiome={onPickBrush}
    />
  );

  function handleAdd (
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
  ) {
    if (!brush) return;

    dispatch(BiomeSourceActions.addLandBiome({
      c,
      e,
      t,
      h,
      w,
      biomeId: brush,
    }));
  }
  
  function handleMultiAdd (
    row: boolean,
    col: boolean,
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
  ) {
    if (!brush) return;

    const emptyOnly = src.doc.biome_source.land[c][e][t][h][w].length === 0;

    dispatch(BiomeSourceActions.multiAddLandBiome({
      c: [c],
      e: col ? ErosionKeys : [e],
      t: [t],
      h: [h],
      w: row ? WeirdnessKeys : [w],
      emptyOnly,
      biomeId: brush,
    }));
  }

  function handleSet (
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    index: number,
  ) {
    if (!brush) return;

    dispatch(BiomeSourceActions.setLandBiome({
      c,
      e,
      t,
      h,
      w,
      index: index,
      biomeId: brush,
    }));
  }

  function handleRemove (
    c: LandContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: LandHumidityKey,
    w: WeirdnessKey,
    index: number,
  ) {
    dispatch(BiomeSourceActions.removeLandBiome({
      c,
      e,
      t,
      h,
      w,
      index: index,
    }));
  }
});

export default LandTab;
