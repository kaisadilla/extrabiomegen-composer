import { Tabs } from '@mantine/core';
import { useState } from 'react';
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import { chooseW3CTextColor } from 'utils';
import LandTab from './Land/tab';
import styles from './tab.module.scss';

export interface BiomeSourceTabProps {
  
}

function BiomeSourceTab (props: BiomeSourceTabProps) {
  const catalogue = useBiomeCatalogue();
  
  const [tab, setTab] = useState<string | null>("land");
  const [brush, setBrush] = useState<string | null>(null);

  return (
    <div className={styles.tab}>
      <Tabs
        classNames={{
          root: styles.tabContainer,
          panel: styles.tabPanel
        }}
        value={tab}
        onChange={setTab}
      >
        <Tabs.List>
          <Tabs.Tab value="river">River</Tabs.Tab>
          <Tabs.Tab value="ocean">Ocean</Tabs.Tab>
          <Tabs.Tab value="exotic">Exotic islands</Tabs.Tab>
          <Tabs.Tab value="land">Land</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="river">
          (river)
        </Tabs.Panel>

        <Tabs.Panel value="ocean">
          (ocean)
        </Tabs.Panel>

        <Tabs.Panel value="exotic">
          (exotic)
        </Tabs.Panel>

        <Tabs.Panel value="land">
          <LandTab
            brush={brush}
            onPickBrush={setBrush}
          />
        </Tabs.Panel>
      </Tabs>
      <div className={styles.panel}>
        <div className={styles.biomeSelection}>
          {Object.values(catalogue.biomes).map(b => (
            <button
              style={{
                backgroundColor: b.color,
                color: chooseW3CTextColor(b.color),
              }}
              data-selected={brush === b.id}
              onClick={() => setBrush(b.id)}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BiomeSourceTab;
