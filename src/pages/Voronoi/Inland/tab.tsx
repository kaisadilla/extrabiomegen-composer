import { Button, SegmentedControl, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { ContinentalnessKeys, HumidityKeys, TemperatureKeys, type ContinentalnessKey, type ErosionKey, type HumidityKey, type TemperatureKey, type VoronoiBiomeSource, type WeirdnessKey } from 'api/VoronoiBiomeSource';
import vanillaDoc from 'data/minecraft/dimension/overworld.json';
import { saveAs } from "file-saver";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import useBiomeSource, { biomeSourceActions } from 'state/biomeSourceSlice';
import { $cl, chooseW3CTextColor, openFile } from 'utils';
import BiomeTable from './BiomeTable';
import styles from './tab.module.scss';

export interface InlandTabProps {
  
}

function InlandTab (props: InlandTabProps) {
  const src = useBiomeSource();
  const catalogue = useBiomeCatalogue();
  const dispatch = useDispatch();

  const [c, setC] = useState<ContinentalnessKey>('coast');
  const [brush, setBrush] = useState<string | null>(null);
  
  const openRestartModal = () => modals.openConfirmModal({
    title: 'Restart biome catalogue',
    children: (
      <Text size='sm'>
        Do you want to restart the biome catalogue to its default value
        (Vanilla Minecraft's list with default colors)? This action cannot
        be undone.
      </Text>
    ),
    labels: {
      confirm: "Restart",
      cancel: "Cancel",
    },
    onConfirm: handleRestart,
  });

  return (
    <div className={styles.tab}>
      <div className={styles.ribbon}>
        <Tooltip
          label="Reset the document."
        >
          <Button
            size='compact-sm'
            onClick={openRestartModal}
          >
            Restart
          </Button>
        </Tooltip>

        <Tooltip
          label="Open a json containing a biome source."
        >
          <Button
            size='compact-sm'
            onClick={handleOpen}
          >
            Open
          </Button>
        </Tooltip>

        <Tooltip
          label="Export a json for Minecraft's data pack (data/minecraft/dimension/*.json). This is ONLY the value of the field 'generator', not the entire file."
        >
          <Button
            size='compact-sm'
            onClick={handleExport}
          >
            Export
          </Button>
        </Tooltip>
      </div>
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
                    onPickBiome={id => setBrush(id)}
                />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.panel}>
        <div className={styles.biomeSelection}>
          {Object.values(catalogue.biomes).map(b => (
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

  function handleRestart () {
    dispatch(biomeSourceActions.loadBiomeSource(vanillaDoc as VoronoiBiomeSource));
  }

  async function handleOpen () {
      const f = await openFile();
      if (!f) return;
  
      try {
        const data = await f.text();
        const raw = JSON.parse(data);
        
        dispatch(biomeSourceActions.loadBiomeSource(raw as VoronoiBiomeSource));
      }
      catch (err) {
        console.error(err);
      }
  }

  function handleExport () {
    const txt = JSON.stringify(src.doc, null, 2);

    const blob = new Blob([txt], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, "biome_source.json");
  }

  function handleAdd (
    c: ContinentalnessKey,
    e: ErosionKey,
    t: TemperatureKey,
    h: HumidityKey,
    w: WeirdnessKey,
  ) {
    if (!brush) return;
    
    dispatch(biomeSourceActions.addInlandBiome({
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
    
    dispatch(biomeSourceActions.propagateInitialLandBiome({
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
    
    dispatch(biomeSourceActions.setInlandBiome({
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
    
    dispatch(biomeSourceActions.removeInlandBiome({
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
