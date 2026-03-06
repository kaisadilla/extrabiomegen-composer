import { SegmentedControl } from '@mantine/core';
import { LandContinentalnessKeys, LandHumidityKeys, TemperatureKeys, type LandContinentalnessKey } from 'api/MultiNoiseDiscreteBiomeSource';
import { memo, useState } from 'react';
import { $cl } from 'utils';
import Table from './Table';
import styles from './TableMatrix.module.scss';
import type { BiomeIdCallback } from './tab';

export interface TableMatrixProps {
  onLeftClick?: BiomeIdCallback;
  onRightClick?: BiomeIdCallback;
}

const TableMatrix = memo(function TableMatrix ({
  onLeftClick,
  onRightClick,
}: TableMatrixProps) {
  const [c, setC] = useState<LandContinentalnessKey>('coast');

  return (
    <div className={styles.matrix}>
      <div className={styles.matrixSelector}>
        <div>c =&nbsp;</div>
        <SegmentedControl
          data={LandContinentalnessKeys.map(k => ({ value: k, label: k }))}
          value={c}
          onChange={v => setC(v as LandContinentalnessKey)}
        />
      </div>

      <div className={styles.matrixContainer}>
        <div className={styles.table}>
          <div className={styles.row}>
            <div className={styles.cell} />

            {TemperatureKeys.map(t => (
              <div
                key={t}
                className={$cl(styles.cell, styles.head)}
              >
                <span>t = {t}</span>
              </div>
            ))}
          </div>

          {LandHumidityKeys.map(h => (
            <div
              key={h}
              className={styles.row}
            >
              <div className={$cl(styles.cell, styles.head, styles.vertical)}>
                <span>h = {h}</span>
              </div>

              {TemperatureKeys.map(t => (
                <div
                  key={t}
                  className={$cl(styles.cell, styles.tableContainer)}
                >
                  <Table
                    key={t}
                    continentalness={c}
                    temperature={t}
                    humidity={h}
                    onLeftClick={onLeftClick}
                    onRightClick={onRightClick}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default TableMatrix;
