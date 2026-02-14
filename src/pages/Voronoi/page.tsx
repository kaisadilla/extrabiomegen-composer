import { Button, Tabs } from '@mantine/core';
import Local from 'Local';
import MapViewerPage from 'pages/MapViewer/page';
import { useState } from 'react';
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import useBiomeSource from 'state/biomeSourceSlice';
import AvailableBiomesTab from './AvailableBiomes/tab';
import InlandTab from './Inland/tab';
import styles from './page.module.scss';

export interface VoronoiPageProps {
  
}

function VoronoiPage (props: VoronoiPageProps) {
  const [tab, setTab] = useState<string | null>("inland");
  const src = useBiomeSource();
  const catalogue = useBiomeCatalogue();

  return (
    <div className={styles.page}>
      <div className={styles.ribbon}>
        <Button
          onClick={save}
          size='compact-sm'
        >
          Save document
        </Button>
      </div>

      <Tabs
        classNames={{
          root: styles.tabContainer,
          panel: styles.tabPanel
        }}
        value={tab}
        onChange={setTab}
      >
        <Tabs.List>
          <Tabs.Tab value="biomes">Biome catalogue</Tabs.Tab>
          <Tabs.Tab value="inland">Biome map: inland</Tabs.Tab>
          <Tabs.Tab value="river">Biome map: river</Tabs.Tab>
          <Tabs.Tab value="ocean">Biome map: ocean</Tabs.Tab>
          <Tabs.Tab value="map_viewer">Map viewer</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="biomes">
          <AvailableBiomesTab />
        </Tabs.Panel>

        <Tabs.Panel value="inland">
          <InlandTab />
        </Tabs.Panel>

        <Tabs.Panel value="river">
          Not implemented.
        </Tabs.Panel>

        <Tabs.Panel value="ocean">
          Not implemented.
        </Tabs.Panel>

        <Tabs.Panel value="map_viewer">
          <MapViewerPage />
        </Tabs.Panel>
      </Tabs>
    </div>
  )

  function save () {
    Local.saveInland(src.doc);
    Local.saveBiomes(catalogue.biomes);
  }
}

export default VoronoiPage;
