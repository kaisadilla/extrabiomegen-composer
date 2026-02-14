import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import { chooseW3CTextColor } from 'utils';
import styles from './BiomeChart.module.scss';

export interface BiomeListProps<T> {
  columnKeys: readonly T[];
  getHead: (key: T) => string;
  getBiomes: (key: T) => string[];
  onAdd?: (key: T) => void;
  onSet?: (key: T, index: number) => void;
  onRemove?: (key: T, index: number) => void;
  onPickBiome?: (biomeId: string) => void;
}

function BiomeChart<T extends string> ({
  columnKeys,
  getHead,
  getBiomes,
  onAdd,
  onSet,
  onRemove,
  onPickBiome,
}: BiomeListProps<T>) {
  const catalogue = useBiomeCatalogue();

  return (
    <div className={styles.chart} onContextMenu={evt => evt.preventDefault()}>
      {columnKeys.map(k => (
        <div
          key={k}
          className={styles.column}
        >
          <div className={styles.head}>
            {getHead(k)}
          </div>
          <div
            className={styles.biomeList}
            onClick={evt => handleListLeftClick(evt, k)}
          >
            {getBiomes(k).map((b, i) => {
              const biome = catalogue.biomes[b];

              return (
                <div
                  className={styles.biome}
                  style={{
                    backgroundColor: biome.color,
                    color: chooseW3CTextColor(biome.color),
                  }}
                  onClick={evt => handleBiomeLeftClick(evt, k, i)}
                  onContextMenu={evt => handleBiomeRightClick(evt, k, i, b)}
                >
                  {biome.name}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  );
  
  function handleListLeftClick (evt: React.MouseEvent, k: T) {
    onAdd?.(k);
  }

  function handleBiomeLeftClick (
    evt: React.MouseEvent, k: T, index: number
  ) {
    evt.stopPropagation();

    if (evt.ctrlKey) {
      onAdd?.(k);
    }
    else {
      onSet?.(k, index);
    }
  }

  function handleBiomeRightClick (
    evt: React.MouseEvent, k: T, index: number, biomeId: string
  ) {
    evt.stopPropagation();
    evt.preventDefault();

    if (evt.ctrlKey) {
      onRemove?.(k, index);
    }
    else {
      onPickBiome?.(biomeId);
    }
  }
}

export default BiomeChart;
