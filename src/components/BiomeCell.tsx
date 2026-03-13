import { getBiomeStyle, UNKNOWN_BIOME, type Biome } from 'api/Biome';
import type { DivProps } from 'types';
import { $cl } from 'utils';
import styles from './BiomeCell.module.scss';

export interface BiomeCellProps extends DivProps {
  biome: Biome | null;
}

function BiomeCell ({
  biome,
  style,
  className,
  ...divProps
}: BiomeCellProps) {
  if (biome === undefined) biome = UNKNOWN_BIOME;

  if (!biome) return (
    <div
      className={$cl(styles.cell, className)}
      style={style}
      {...divProps}
    >
      <div className={styles.name}>
        (none)
      </div>
    </div>
  );

  return (
    <div
      className={$cl(styles.cell, className)}
      style={{ ...getBiomeStyle(biome), ...style }}
      data-wanted={biome.wanted}
      {...divProps}
    >
      <div className={styles.name}>
        {biome.name}
      </div>
    </div>
  );
}

export default BiomeCell;
