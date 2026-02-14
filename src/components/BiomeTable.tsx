import { Tooltip } from '@mantine/core';
import { UNKNOWN_BIOME } from 'api/Biome';
import { ErosionKeys, WeirdnessKeys, type ContinentalnessKey, type ErosionKey, type HumidityKey, type TemperatureKey, type WeirdnessKey } from 'api/VoronoiBiomeSource';
import { useSelector } from 'react-redux';
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import type { RootState } from 'state/store';
import { chooseW3CTextColor } from 'utils';
import styles from './BiomeTable.module.scss';

export interface BiomeTableProps {
  c: ContinentalnessKey;
  h: HumidityKey;
  t: TemperatureKey;
  onAdd?: (e: ErosionKey, w: WeirdnessKey) => void;
  onMultiAdd?: () => void;
  onSet?: (e: ErosionKey, w: WeirdnessKey, index: number) => void;
  onRemove?: (e: ErosionKey, w: WeirdnessKey, index: number) => void;
  onPickBiome?: (biomeId: string) => void;
}

function BiomeTable ({
  c,
  h,
  t,
  onAdd,
  onMultiAdd,
  onSet,
  onRemove,
  onPickBiome,
}: BiomeTableProps) {
  //const src = useBiomeSource();
  const src = useSelector((state: RootState) => state.biomeSource);
  const catalogue = useBiomeCatalogue();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <td></td>
          {ErosionKeys.map(e => <Tooltip key={e} label="Erosion">
            <td>
              <span>e = {e}</span>
            </td>
          </Tooltip>)}
        </tr>
      </thead>
      <tbody>
        {WeirdnessKeys.map((w, i) => <tr key={w}>
          <Tooltip label={`Weirdness: ${w}`}>
            <td className={styles.head}>
              <span>{i}</span>
            </td>
          </Tooltip>
          {ErosionKeys.map(e => {
            const biomes = src.doc.biome_source.land[c][e][t][h][w];

            return (
              <Tooltip.Floating
                key={e}
                position='bottom'
                offset={40}
                classNames={{
                  tooltip: styles.cellTooltip,
                }}
                label={<div className={styles.cellTooltipLabel}>
                  <div className={styles.label}>Biomes in this cell:</div>
                  {biomes?.map((b, i) => {
                    const biome = catalogue.biomes[b] ?? UNKNOWN_BIOME;

                    return (
                      <div
                        key={i}
                        className={styles.biome}
                        style={{
                          backgroundColor: biome.color,
                          color: chooseW3CTextColor(biome.color),
                        }}
                      >
                        #{i + 1} - {biome.name}
                      </div>
                    );
                  })}
                </div>}
              >
                <td
                  className={styles.values}
                  onClick={evt => handleLeftClickCell(evt, e, w)}
                  onContextMenu={evt => evt.preventDefault()}
                >
                  <div>
                    {biomes?.map((b, i) => {
                      const biome = catalogue.biomes[b] ?? UNKNOWN_BIOME;

                      return (
                        <div
                          key={i}
                          style={{
                            backgroundColor: biome.color,
                            color: chooseW3CTextColor(biome.color),
                          }}
                          onClick={evt => handleLeftClickBiome(evt, e, w, i)}
                          onContextMenu={evt => handleRightClickBiome(evt, e, w, i, biome.id)}
                        >
                          {biome.name}
                        </div>
                      )
                    })}
                  </div>
                </td>
              </Tooltip.Floating>
            );
          })}
        </tr>)}
      </tbody>
    </table>
  );

  function handleLeftClickCell (evt: React.MouseEvent, e: ErosionKey, w: WeirdnessKey
  ) {
    evt.stopPropagation();

    if (evt.shiftKey) {
      onMultiAdd?.();
    }
    else {
      onAdd?.(e, w);
    }
  }

  function handleLeftClickBiome (
    evt: React.MouseEvent, e: ErosionKey, w: WeirdnessKey, index: number
  ) {
    evt.stopPropagation();

    if (evt.ctrlKey) {
      onAdd?.(e, w);
    }
    else {
      onSet?.(e, w, index);
    }
  }

  function handleRightClickBiome (
    evt: React.MouseEvent,
    e: ErosionKey,
    w: WeirdnessKey,
    index: number,
    biomeId: string
  ) {
    evt.stopPropagation();
    evt.preventDefault();

    if (evt.ctrlKey) {
      onRemove?.(e, w, index);
    }
    else {
      onPickBiome?.(biomeId);
    }
  }
}

export default BiomeTable;
