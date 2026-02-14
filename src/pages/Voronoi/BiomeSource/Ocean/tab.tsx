import { OceanDepthKeys, TemperatureKeys, type OceanDepthKey, type TemperatureKey } from 'api/VoronoiBiomeSource';
import BiomeChart from 'components/BiomeChart';
import { useDispatch } from 'react-redux';
import useBiomeSource, { BiomeSourceActions } from 'state/biomeSourceSlice';
import styles from './tab.module.scss';

export interface OceanTabProps {
  brush: string | null;
  onPickBrush: (brush: string) => void;
}

function OceanTab ({
  brush,
  onPickBrush,
}: OceanTabProps) {
  const src = useBiomeSource();
  const dispatch = useDispatch();

  return (
    <div className={styles.tab}>
      <div className={styles.chartContainer}>
          {OceanDepthKeys.map(c => (
            <div className={styles.row}>
              <div className={styles.head}>
                c = {c}
              </div>
              <BiomeChart<TemperatureKey>
                columnKeys={TemperatureKeys}
                getHead={t => `t = ${t}`}
                getBiomes={t => src.doc.biome_source.ocean[t][c]}
                onAdd={t => handleAdd(c, t)}
                onSet={(t, i) => handleSet(c, t, i)}
                onRemove={(t, i) => handleRemove(c, t, i)}
                onPickBiome={onPickBrush}
              />
            </div>
          ))}
      </div>
    </div>
  );

  function handleAdd (c: OceanDepthKey, t: TemperatureKey) {
    if (!brush) return;
    
    dispatch(BiomeSourceActions.addOceanBiome({
      c,
      t,
      biomeId: brush,
    }));
  }

  function handleSet (c: OceanDepthKey, t: TemperatureKey, index: number) {
    if (!brush) return;

    dispatch(BiomeSourceActions.setOceanBiome({
      c,
      t,
      index,
      biomeId: brush,
    }));
  }

  function handleRemove (c: OceanDepthKey, t: TemperatureKey, index: number) {
    if (!brush) return;

    dispatch(BiomeSourceActions.removeOceanBiome({
      c,
      t,
      index,
    }));
  }
}

export default OceanTab;
