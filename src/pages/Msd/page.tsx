import { Tabs } from '@mantine/core';
import MapViewerPage from 'pages/MapViewer/page';
import { useState } from 'react';
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import useBiomeSource from 'state/biomeSourceSlice';
import AvailableBiomesTab from './AvailableBiomes/tab';
import BiomeSourceTab from './BiomeSource/tab';
import styles from './page.module.scss';

export interface MsdPageProps {
  
}

function MsdPage (props: MsdPageProps) {
  const [tab, setTab] = useState<string | null>("src");
  const src = useBiomeSource();
  const catalogue = useBiomeCatalogue();

  return (
    <div className={styles.page}>
      <Tabs
        classNames={{
          root: styles.tabContainer,
          panel: styles.tabPanel
        }}
        value={tab}
        onChange={setTab}
      >
        <Tabs.List>
          <Tabs.Tab value="catalogue">Biome catalogue</Tabs.Tab>
          <Tabs.Tab value="src">Biome source</Tabs.Tab>
          <Tabs.Tab value="map_viewer">Map viewer</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="catalogue">
          <AvailableBiomesTab />
        </Tabs.Panel>

        <Tabs.Panel value="src">
          <BiomeSourceTab />
        </Tabs.Panel>

        <Tabs.Panel value="map_viewer">
          <MapViewerPage />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default MsdPage;
