import { Tooltip } from '@mantine/core';
import { NULL_BIOME, UNKNOWN_BIOME } from 'api/Biome';
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import { $cl, chooseW3CTextColor } from 'utils';
import styles from './BiomeTable.module.scss';

export interface BiomeTableProps<TRow, TCol> {
  className?: string;
  columnName: string;
  columnKeys: readonly TCol[];
  getColumnHead: (key: TCol) => string;
  rowName: string;
  rowKeys: readonly TRow[];
  getRowHead: (key: TRow) => string;
  riverIndex?: number;
  getBiomes: (krow: TRow, kcol: TCol) => (string | null)[];
  onAdd?: (krow: TRow, kcol: TCol) => void;
  onMultiAdd?: (
    krow: TRow, kcol: TCol, fillRow: boolean, fillCol: boolean
  ) => void;
  onSet?: (krow: TRow, kcol: TCol, index: number) => void;
  onRemove?: (krow: TRow, kcol: TCol, index: number) => void;
  onPickBiome?: (biomeId: string) => void;
}

function BiomeTable<TRow extends string, TCol extends string> ({
  className,
  columnName,
  columnKeys,
  getColumnHead,
  rowName,
  rowKeys,
  getRowHead,
  riverIndex,
  getBiomes,
  onAdd,
  onMultiAdd,
  onSet,
  onRemove,
  onPickBiome,
}: BiomeTableProps<TRow, TCol>) {
  const catalogue = useBiomeCatalogue();

  return (
    <table
      className={$cl(styles.table, className)}
      onContextMenu={evt => evt.preventDefault()}
    >
      <thead>
        <tr>
          <td></td>
          {columnKeys.map(kcol => (
            <Tooltip key={kcol} label={columnName}>
              <td>
                <span>{getColumnHead(kcol)}</span>
              </td>
            </Tooltip>
          ))}
        </tr>
      </thead>

      <tbody>
        {rowKeys.map((krow, i) => (
          <tr
            key={krow}
            data-is-river={i === riverIndex}
          >
            <Tooltip label={getRowHead(krow)}>
              <td className={styles.head}>
                <span>{i}</span>
              </td>
            </Tooltip>

            {columnKeys.map(kcol => {
              const biomes = getBiomes(krow, kcol);

              return (
                /*<Tooltip.Floating
                  key={kcol}
                  position='bottom'
                  offset={40}
                  classNames={{
                    tooltip: styles.cellTooltip,
                  }}
                  label={
                    <div className={styles.cellTooltipLabel}>
                      <div className={styles.label}>
                        Biomes in this cell:
                      </div>

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
                        )
                      })}
                    </div>
                  }
                >*/
                  <td
                    className={styles.values}
                    onClick={evt => handleLeftClickCell(evt, krow, kcol)}
                  >
                    <div>
                      {biomes?.map((b, i) => {
                        const biome = b === null
                          ? NULL_BIOME
                          : (catalogue.biomes[b] ?? UNKNOWN_BIOME);

                        return (
                          <div
                            key={i}
                            style={{
                              backgroundColor: biome.color,
                              color: chooseW3CTextColor(biome.color)
                            }}
                            onClick={ evt => handleLeftClickBiome(
                              evt, krow, kcol, i
                            )}
                            onContextMenu={evt => handleRightClickBiome(
                              evt, krow, kcol, i, biome.id
                            )}
                            data-wanted={biome.wanted}
                            data-is-null={biome.id === 'null'}
                          >
                            {biome.name}
                          </div>
                        )
                      })}
                    </div>
                  </td>
                /*</Tooltip.Floating>*/
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  function handleLeftClickCell (evt: React.MouseEvent, krow: TRow, kcol: TCol
  ) {
    evt.stopPropagation();

    if (evt.shiftKey || evt.altKey) {
      onMultiAdd?.(krow, kcol, evt.shiftKey, evt.altKey);
    }
    else {
      onAdd?.(krow, kcol);
    }
  }

  function handleLeftClickBiome (
    evt: React.MouseEvent, krow: TRow, kcol: TCol, index: number
  ) {
    evt.stopPropagation();

    if (evt.ctrlKey) {
      onAdd?.(krow, kcol);
    }
    else {
      onSet?.(krow, kcol, index);
    }
  }

  function handleRightClickBiome (
    evt: React.MouseEvent,
    krow: TRow,
    kcol: TCol,
    index: number,
    biomeId: string
  ) {
    evt.stopPropagation();
    evt.preventDefault();

    if (evt.ctrlKey) {
      onRemove?.(krow, kcol, index);
    }
    else {
      onPickBiome?.(biomeId);
    }
  }
}

export default BiomeTable;
