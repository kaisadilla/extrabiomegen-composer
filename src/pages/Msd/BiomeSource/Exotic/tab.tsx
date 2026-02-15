import { TemperatureKeys, type TemperatureKey } from 'api/MultiNoiseDiscreteBiomeSource';
import BiomeChart from 'components/BiomeChart';
import { useDispatch } from 'react-redux';
import useBiomeSource, { BiomeSourceActions } from 'state/biomeSourceSlice';
import styles from './tab.module.scss';

export interface ExoticTabProps {
  brush: string | null;
  onPickBrush: (brush: string) => void;
}

function ExoticTab ({
  brush,
  onPickBrush,
}: ExoticTabProps) {
  const src = useBiomeSource();
  const dispatch = useDispatch();

  return (
    <div className={styles.tab}>
      <div className={styles.chartContainer}>
        <BiomeChart<TemperatureKey>
          columnKeys={TemperatureKeys}
          getHead={t => `t = ${t}`}
          getBiomes={t => src.doc.biome_source.exotic[t]}
          onAdd={handleAdd}
          onSet={handleSet}
          onRemove={handleRemove}
          onPickBiome={onPickBrush}
        />
      </div>
    </div>
  );

  function handleAdd (t: TemperatureKey) {
    if (!brush) return;
    
    dispatch(BiomeSourceActions.addExoticBiome({
      t,
      biomeId: brush,
    }));
  }

  function handleSet (t: TemperatureKey, index: number) {
    if (!brush) return;

    dispatch(BiomeSourceActions.setExoticBiome({
      t,
      index,
      biomeId: brush,
    }));
  }

  function handleRemove (t: TemperatureKey, index: number) {
    if (!brush) return;

    dispatch(BiomeSourceActions.removeExoticBiome({
      t,
      index,
    }));
  }
}

export default ExoticTab;
