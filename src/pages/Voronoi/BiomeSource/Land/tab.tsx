import { SegmentedControl, Tooltip } from '@mantine/core';
import { ContinentalnessKeys, HumidityKeys, TemperatureKeys, type ContinentalnessKey, type ErosionKey, type HumidityKey, type TemperatureKey, type WeirdnessKey } from 'api/VoronoiBiomeSource';
import BiomeTable from 'components/BiomeTable';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { BiomeSourceActions } from 'state/biomeSourceSlice';
import { $cl } from 'utils';
import styles from './tab.module.scss';

export interface LandTabProps {
  brush: string | null;
  onPickBrush: (brush: string) => void;
}

function LandTab ({
  brush,
  onPickBrush,
}: LandTabProps) {
  const dispatch = useDispatch();

  const [c, setC] = useState<ContinentalnessKey>('coast');

  return (
    <div className={styles.tab}>
      <div className={styles.continentalness}>
        <Tooltip label='Continentalness'><div>c =&nbsp;</div></Tooltip>
        <SegmentedControl
          data={ContinentalnessKeys.map(k => ({ value: k, label: k }))}
          value={c}
          onChange={v => setC(v as ContinentalnessKey)}
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
          {HumidityKeys.map(h => (
            <div key={h} className={styles.row}>
              <div className={$cl(styles.cell, styles.head, styles.vertical)}>
                <Tooltip label='Humidity'>
                  <span>h = {h}</span>
                </Tooltip>
              </div>
              {TemperatureKeys.map(t => (
                <div key={t} className={$cl(styles.cell, styles.tableContainer)}>
                  <BiomeTable
                    c={c}
                    h={h}
                    t={t}
                    onAdd={(e, w) => handleAdd(c, e, t, h, w)}
                    onMultiAdd={() => handleMultiAdd(c, t, h)}
                    onSet={(e, w, i) => handleSet(c, e, t, h, w, i)}
                    onRemove={(e, w, i) => handleRemove(c, e, t, h, w, i)}
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
    c: ContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: HumidityKey,
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
    c: ContinentalnessKey,
    t: TemperatureKey,
    h: HumidityKey,
  ) {
    if (!brush) return;
    
    dispatch(BiomeSourceActions.propagateInitialLandBiome({
      c,
      t,
      h,
      biomeId: brush,
    }));
  }

  function handleSet (
    c: ContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: HumidityKey,
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
    c: ContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: HumidityKey,
    w: WeirdnessKey,
    index: number,
  ) {
    if (!brush) return;
    
    dispatch(BiomeSourceActions.removeLandBiome({
      c,
      e,
      t,
      h,
      w,
      index: index,
    }));
  }
}

export default LandTab;
