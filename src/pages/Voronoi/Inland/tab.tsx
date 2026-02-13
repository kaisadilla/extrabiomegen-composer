import { Button, SegmentedControl, Tooltip } from '@mantine/core';
import { ContinentalnessKeys, HumidityKeys, TemperatureKeys, type ContinentalnessKey, type ErosionKey, type HumidityKey, type TemperatureKey, type WeirdnessKey } from 'api/VoronoiBiomeSource';
import { saveAs } from "file-saver";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { DocActions } from 'state/docSlice';
import useDoc from 'state/useDoc';
import { chooseW3CTextColor } from 'utils';
import BiomeTable from './BiomeTable';
import styles from './tab.module.scss';

export interface InlandTabProps {
  
}

function InlandTab (props: InlandTabProps) {
  const doc = useDoc();
  const dispatch = useDispatch();

  const [c, setC] = useState<ContinentalnessKey>('coast');
  const [brush, setBrush] = useState<string | null>(null);

  return (
    <div className={styles.tab}>
      <div className={styles.ribbon}>
        <Button
          size='compact-sm'
          onClick={exportJson}
        >
          Export JSON
        </Button>
      </div>
      <div className={styles.continentalness}>
        <Tooltip label='Continentalness'><div>c =&nbsp;</div></Tooltip>
        <SegmentedControl
          data={ContinentalnessKeys.map(k => ({ value: k, label: k }))}
          value={c}
          onChange={v => setC(v as ContinentalnessKey)}
        />
      </div>
      <table className={styles.htTable}>
        <thead>
          <tr>
            <td></td>
            {TemperatureKeys.map(t => <td key={t}>
              <div>
                <Tooltip label='Temperature'>
                  <span>t = {t}</span>
                </Tooltip>
              </div>
            </td>)}
          </tr>
        </thead>
        <tbody>
          {HumidityKeys.map(h => <tr key={h}>
            <td className={styles.head}>
              <div>
                <Tooltip label='Humidity'>
                  <span>h = {h}</span>
                </Tooltip>
              </div>
            </td>
            {TemperatureKeys.map(t => <td key={t}>
              <div>
                <BiomeTable
                  c={c}
                  h={h}
                  t={t}
                  onAdd={(e, w) => handleAdd(c, e, t, h, w)}
                  onSet={(e, w, i) => handleSet(c, e, t, h, w, i)}
                  onRemove={(e, w, i) => handleRemove(c, e, t, h, w, i)}
                  onPickBiome={id => setBrush(id)}
              />
              </div>
            </td>)}
          </tr>)}
        </tbody>
      </table>
      <div className={styles.panel}>
        <div className={styles.biomeSelection}>
          {Object.values(doc.biomes).map(b => (
            <button
              style={{
                backgroundColor: b.color,
                color: chooseW3CTextColor(b.color),
              }}
              data-selected={brush === b.id}
              onClick={() => setBrush(b.id)}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  function exportJson () {
    const txt = JSON.stringify(doc.src, null, 2);

    const blob = new Blob([txt], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, "inland.geojson");
  }

  function handleAdd (
    c: ContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: HumidityKey,
    w: WeirdnessKey,
  ) {
    if (!brush) return;
    
    dispatch(DocActions.addInlandBiome({
      c,
      e,
      t,
      h,
      w,
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
    
    dispatch(DocActions.setInlandBiome({
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
    
    dispatch(DocActions.removeInlandBiome({
      c,
      e,
      t,
      h,
      w,
      index: index,
    }));
  }
}

export default InlandTab;
