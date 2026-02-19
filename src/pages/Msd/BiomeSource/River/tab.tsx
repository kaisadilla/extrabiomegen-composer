import { LandHumidityKeys, TemperatureKeys, type LandHumidityKey, type TemperatureKey } from 'api/MultiNoiseDiscreteBiomeSource';
import BiomeTable from 'components/BiomeTable';
import { useDispatch } from 'react-redux';
import useBiomeSource, { BiomeSourceActions } from 'state/biomeSourceSlice';
import styles from './tab.module.scss';

export interface RiverTabProps {
  active: boolean;
  brush: string | null;
  onPickBrush: (brush: string) => void;
}

function RiverTab ({
  active,
  brush,
  onPickBrush,
}: RiverTabProps) {
  const src = useBiomeSource();
  const dispatch = useDispatch();

  if (!active) return null;
  
  return (
    <div className={styles.tab}>
      <div className={styles.tableContainer}>
        <BiomeTable
          className={styles.biomeTable}
          columnName="Temperature"
          columnKeys={TemperatureKeys}
          getColumnHead={t => `t = ${t}`}
          rowName="Humidity"
          rowKeys={LandHumidityKeys}
          getRowHead={h => `h = ${h}`}
          getBiomes={(h, t) => src.doc.biome_source.river[t][h]}
          onAdd={(h, t) => handleAdd(t, h)}
          onMultiAdd={(h, t, row, col) => handleMultiAdd(row, col, t, h)}
          onSet={(h, t, i) => handleSet(t, h ,i)}
          onRemove={(h, t, i) => handleRemove(t, h, i)}
          onPickBiome={onPickBrush}
        />
      </div>
    </div>
  );

  function handleAdd (
    t: TemperatureKey,
    h: LandHumidityKey,
  ) {
    if (!brush) return;

    dispatch(BiomeSourceActions.addRiverBiome({
      t,
      h,
      biomeId: brush,
    }));
  }

  function handleMultiAdd (
    row: boolean,
    col: boolean,
    t: TemperatureKey,
    h: LandHumidityKey,
  ) {
    if (!brush) return;

    dispatch(BiomeSourceActions.multiAddRiverBiome({
      t: col ? TemperatureKeys : [t],
      h: row ? LandHumidityKeys : [h],
      emptyOnly: true,
      biomeId: brush,
    }));
  }

  function handleSet (
    t: TemperatureKey,
    h: LandHumidityKey,
    index: number,
  ) {
    if (!brush) return;
    
    dispatch(BiomeSourceActions.setRiverBiome({
      t,
      h,
      index: index,
      biomeId: brush,
    }));
  }

  function handleRemove (
    t: TemperatureKey,
    h: LandHumidityKey,
    index: number,
  ) {
    if (!brush) return;
    
    dispatch(BiomeSourceActions.removeRiverBiome({
      t,
      h,
      index: index,
    }));
  }
}

export default RiverTab;
