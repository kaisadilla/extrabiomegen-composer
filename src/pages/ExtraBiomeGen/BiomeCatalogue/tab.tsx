import { Tabs } from '@mantine/core';
import { useState } from 'react';
import BiomeCatalogueRibbon from './BiomeCatalogueRibbon';
import GroupsTab from './Groups/tab';
import Info from './Info';
import BiomeList from './List/tab';
import styles from './tab.module.scss';

export interface BiomeCatalogueTabProps {
  
}

function BiomeCatalogueTab (props: BiomeCatalogueTabProps) {
  const [tab, setTab] = useState<string | null>("list");

  return (
    <div className={styles.tab}>
      <BiomeCatalogueRibbon />
      
      <Tabs
        classNames={{
          root: styles.tabContainer,
          panel: styles.tabPanel
        }}
        value={tab}
        onChange={setTab}
      >
        <Tabs.List>
          <Tabs.Tab value="info">Info</Tabs.Tab>
          <Tabs.Tab value="list">Biomes</Tabs.Tab>
          <Tabs.Tab value="groups">Groups</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="info">
          <Info />
        </Tabs.Panel>

        <Tabs.Panel value="list">
          <BiomeList />
        </Tabs.Panel>

        <Tabs.Panel value="groups">
          <GroupsTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default BiomeCatalogueTab;
