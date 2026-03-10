import { getBiomeStyle, type Biome } from 'api/Biome';
import { $cl } from 'utils';
import styles from './BiomeButton.module.scss';
import type { ButtonProps } from './Button';

export interface BiomeButtonProps extends Omit<ButtonProps, 'children'> {
  biome: Biome;
}

function BiomeButton ({
  biome,
  className,
  style,
  ...buttonProps
}: BiomeButtonProps) {

  return (
    <button
      className={$cl(styles.button, className)}
      style={{ ...getBiomeStyle(biome), ...style }}
      data-wanted={biome.wanted}
      {...buttonProps}
    >
      <div className={styles.name}>
        {biome.name}
      </div>
    </button>
  );
}

export default BiomeButton;
