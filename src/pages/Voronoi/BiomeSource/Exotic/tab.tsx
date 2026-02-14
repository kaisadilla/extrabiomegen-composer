import { TemperatureKeys, type TemperatureKey } from 'api/VoronoiBiomeSource';
import { useDispatch } from 'react-redux';
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import useBiomeSource, { BiomeSourceActions } from 'state/biomeSourceSlice';
import { chooseW3CTextColor } from 'utils';
import styles from './tab.module.scss';

export interface ExoticTabProps {
  brush: string | null;
  onPickBrush: (brush: string) => void;
}

function ExoticTab ({
  brush,
  onPickBrush,
}: ExoticTabProps) {
  const catalogue = useBiomeCatalogue();
  const src = useBiomeSource();
  const dispatch = useDispatch();

  return (
    <div className={styles.tab}>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          {TemperatureKeys.map(t => (
            <div
              key={t}
              className={styles.temp}
            >
              <div className={styles.head}>
                t = {t}
              </div>
              <div
                className={styles.biomeList}
                onClick={evt => handleListLeftClick(evt, t)}
              >
                {src.doc.biome_source.exotic[t].map((b, i) => {
                  const biome = catalogue.biomes[b];

                  return (
                    <div
                      className={styles.biome}
                      style={{
                        backgroundColor: biome.color,
                        color: chooseW3CTextColor(biome.color),
                      }}
                      onClick={evt => handleBiomeLeftClick(evt, t, i)}
                      onContextMenu={evt => handleBiomeRightClick(evt, t, i, b)}
                    >
                      {biome.name}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function handleListLeftClick (evt: React.MouseEvent, t: TemperatureKey) {
    if (!brush) return;
    
    dispatch(BiomeSourceActions.addExoticBiome({
      t,
      biomeId: brush,
    }));
  }

  function handleBiomeLeftClick (
    evt: React.MouseEvent, t: TemperatureKey, index: number
  ) {
    evt.stopPropagation();

    if (!brush) return;

    if (evt.ctrlKey) {
      dispatch(BiomeSourceActions.addExoticBiome({
        t,
        biomeId: brush,
      }));
    }
    else {
      dispatch(BiomeSourceActions.setExoticBiome({
        t,
        index,
        biomeId: brush,
      }));
    }
  }

  function handleBiomeRightClick (
    evt: React.MouseEvent, t: TemperatureKey, index: number, biomeId: string
  ) {
    evt.stopPropagation();
    evt.preventDefault();

    if (evt.ctrlKey) {
      dispatch(BiomeSourceActions.removeExoticBiome({
        t,
        index,
      }));
    }
    else {
      onPickBrush?.(biomeId);
    }
  }
}

export default ExoticTab;
