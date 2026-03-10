import { Tabs } from '@mantine/core';
import { usePageTitle } from 'hooks/usePageTitle';
import MapViewerPage from 'pages/MapViewer/page';
import { useState } from 'react';
import BiomeCatalogueTab from './BiomeCatalogue/tab';
import BiomeSourceTab from './BiomeSource/tab';
import styles from './page.module.scss';

export interface ExtraBiomeGenPageProps {
  
}

function ExtraBiomeGenPage (props: ExtraBiomeGenPageProps) {
  usePageTitle("Biome generator");

  const [tab, setTab] = useState<string | null>("src");

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
          <BiomeCatalogueTab />
        </Tabs.Panel>

        <Tabs.Panel value="src">
          <BiomeSourceTab active={tab === "src"} />
        </Tabs.Panel>

        <Tabs.Panel value="map_viewer">
          <MapViewerPage />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default ExtraBiomeGenPage;
