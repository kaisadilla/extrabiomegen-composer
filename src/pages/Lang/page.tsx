import { Tabs } from "@mantine/core";
import { usePageTitle } from "hooks/usePageTitle";
import { useState } from "react";
import BaseTab from "./Base/tab";
import InfoTab from "./Info";
import LangRibbon from "./LangRibbon";
import PackTab from "./Pack/tab";
import styles from './page.module.scss';
import SettingsTab from "./Settings/tab";

export interface LangPageProps {
  
}

function LangPage (props: LangPageProps) {
  usePageTitle("Lang");

  const [tab, setTab] = useState<string | null>('info');

  return (
    <div className={styles.page}>
      <LangRibbon />

      <Tabs
        classNames={{
          root: styles.tabContainer,
          panel: styles.tabPanel
        }}
        value={tab}
        onChange={setTab}
      >
        <Tabs.List>
          <Tabs.Tab value='info'>
            <strong>Information</strong>
          </Tabs.Tab>
          <Tabs.Tab value='settings'>
            Settings
          </Tabs.Tab>
          <Tabs.Tab value='base'>
            Base
          </Tabs.Tab>
          <Tabs.Tab value='pack'>
            Overrides
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='info'>
          <InfoTab />
        </Tabs.Panel>
        <Tabs.Panel value='settings'>
          <SettingsTab />
        </Tabs.Panel>
        <Tabs.Panel value='base'>
          <BaseTab />
        </Tabs.Panel>
        <Tabs.Panel value='pack'>
          <PackTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default LangPage;
