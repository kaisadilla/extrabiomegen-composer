import { SegmentedControl, Tooltip } from '@mantine/core';
import { type CaveDepthKey, CaveDepthKeys, type ContinentalnessKey, ContinentalnessKeys, type ErosionKey, ErosionKeys, type HumidityKey, HumidityKeys, type TemperatureKey, TemperatureKeys } from 'api/MultiNoiseDiscreteBiomeSource';
import BiomeTable from 'components/BiomeTable';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useBiomeSource, { BiomeSourceActions } from 'state/biomeSourceSlice';
import { $cl } from 'utils';
import styles from './tab.module.scss';

export interface CaveTabProps {
  brush: string | null;
  onPickBrush: (brush: string) => void;
}

function CaveTab ({
  brush,
  onPickBrush,
}: CaveTabProps) {
  const src = useBiomeSource();
  const dispatch = useDispatch();

  const [d, setD] = useState<CaveDepthKey>('shallow');

  return (
    <div className={styles.tab}>
      <div className={styles.depth}>
        <Tooltip
          label="Cave depth"
        >
          <div>d =&nbsp;</div>
        </Tooltip>
        <SegmentedControl
          data={CaveDepthKeys.map(d => ({ value: d, label: d }))}
          value={d}
          onChange={v => setD(v as CaveDepthKey)}
        />
      </div>

      <div className={styles.matrixContainer}>
        <div className={styles.matrix}>
          <div className={styles.row}>
            <div className={styles.cell} />
            {TemperatureKeys.map(t => (
              <div
                key={t}
                className={$cl(styles.cell, styles.head)}
              >
                <Tooltip label="Temperature">
                  <span>t = {t}</span>
                </Tooltip>
              </div>
            ))}
          </div>

          {HumidityKeys.map(h => (
            <div
              key={h}
              className={styles.row}
            >
              <div
                className={$cl(styles.cell, styles.head, styles.vertical)}
              >
                <Tooltip label="Humidity">
                  <span>h = {h}</span>
                </Tooltip>
              </div>

              {TemperatureKeys.map(t => (
                <div key={t} className={$cl(styles.cell, styles.tableContainer)}>
                  <BiomeTable
                    columnName="Erosion"
                    columnKeys={ErosionKeys}
                    getColumnHead={k => `e = ${k}`}
                    rowName="Continentalness"
                    rowKeys={ContinentalnessKeys}
                    getRowHead={k => `c = ${k}`}
                    getBiomes={(c, e) => src.doc.biome_source.cave[d][c][e][t][h]}
                    onAdd={(c, e) => handleAdd(d, c, e, t, h)}
                    onMultiAdd={(c, e, row, col) => handleMultiAdd(row, col, d, c, e, t, h)}
                    onSet={(c, e, i) => handleSet(d, c, e, t, h, i)}
                    onRemove={(c, e, i) => handleRemove(d, c, e, t, h, i)}
                    onPickBiome={onPickBrush}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function handleAdd (
    d: CaveDepthKey,
    c: ContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: HumidityKey,
  ) {
    if (!brush) return;
    
    dispatch(BiomeSourceActions.addCaveBiome({
      d,
      c,
      e,
      t,
      h,
      biomeId: brush,
    }));
  }

  function handleMultiAdd (
    row: boolean,
    col: boolean,
    d: CaveDepthKey,
    c: ContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: HumidityKey,
  ) {
    if (!brush) return;
    console.log("in filter")

    dispatch(BiomeSourceActions.multiAddCaveBiome({
      d: [d],
      c: row ? ContinentalnessKeys : [c],
      e: col ? ErosionKeys : [e],
      t: [t],
      h: [h],
      emptyOnly: true,
      biomeId: brush,
    }));
  }

  function handleSet (
    d: CaveDepthKey,
    c: ContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: HumidityKey,
    index: number,
  ) {
    if (!brush) return;
    
    dispatch(BiomeSourceActions.setCaveBiome({
      d,
      c,
      e,
      t,
      h,
      index: index,
      biomeId: brush,
    }));
  }

  function handleRemove (
    d: CaveDepthKey,
    c: ContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: HumidityKey,
    index: number,
  ) {
    if (!brush) return;
    
    dispatch(BiomeSourceActions.removeCaveBiome({
      d,
      c,
      e,
      t,
      h,
      index: index,
    }));
  }
}

export default CaveTab;
