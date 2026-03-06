import { Tooltip } from '@mantine/core';
import { UNKNOWN_BIOME } from 'api/Biome';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'state/store';
import { $cl, chooseW3CTextColor } from 'utils';
import styles from './BiomeTable2.module.scss';

export interface BiomeTable2Props {
  className?: string;
  values: string[][][];
  rowNames: string[];
  columnNames: string[];
  onLeftClick?: (row: number, col: number, index: number) => void;
  onRightClick?: (row: number, col: number, index: number) => void;
}

const BiomeTable2 = memo(function BiomeTable2 ({
  className,
  values,
  rowNames,
  columnNames,
  onLeftClick,
  onRightClick,
}: BiomeTable2Props) {
  const catalogue = useSelector((state: RootState) => state.biomeCatalogue);

  return (
    <table
      className={$cl(styles.table, className)}
    >
      <thead>
        <tr>
          <td></td>
          {columnNames.map((n, i) => (
            <td key={i}>
              <span>{n}</span>
            </td>
          ))}
        </tr>
      </thead>

      <tbody>
        {values.map((arr, x) => (
          <tr
            key={x}
          >
            <Tooltip label={rowNames[x]}>
              <td className={styles.head}>
                <span>{x}</span>
              </td>
            </Tooltip>

            {arr.map((ids, y) => (
              <td
                key={y}
                className={styles.values}
                onClick={evt => handleLeftClick(evt, x, y, -1)}
                onContextMenu={evt => handleContextMenu(evt, x, y, -1)}
              >
                <div
                  className={styles.biomeContainer}
                >
                  {ids.map((id, z) => {
                    const biome = catalogue.biomes[id] ?? UNKNOWN_BIOME;

                    return (
                      <div
                        key={z}
                        className={styles.biome}
                        style={{
                          '--color-biome': biome.color,
                          '--color-biome-text': chooseW3CTextColor(biome.color)
                        } as any}
                        data-wanted={biome.wanted}
                        onClick={evt => handleLeftClick(evt, x, y, z)}
                        onContextMenu={evt => handleContextMenu(evt, x, y, z)}
                      >
                        {biome.name}
                      </div>
                    );
                  })}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  function handleLeftClick (
    evt: React.MouseEvent, x: number, y: number, index: number
  ) {
    evt.stopPropagation();
    onLeftClick?.(x, y, index);
  }

  function handleContextMenu (
    evt: React.MouseEvent, x: number, y: number, index: number
  ) {
    evt.stopPropagation();
    evt.preventDefault();

    onRightClick?.(x, y, index);
  }
});

export default BiomeTable2;
