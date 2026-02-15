import { Button, Tabs, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { makeMndBiomeSource, type MndBiomeSource } from 'api/MultiNoiseDiscreteBiomeSource';
import vanillaDoc from 'data/minecraft/dimension/overworld.json';
import { saveAs } from "file-saver";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import useBiomeSource, { BiomeSourceActions } from 'state/biomeSourceSlice';
import { chooseW3CTextColor, openFile } from 'utils';
import CaveTab from './Cave/tab';
import ExoticTab from './Exotic/tab';
import LandTab from './Land/tab';
import OceanTab from './Ocean/tab';
import styles from './tab.module.scss';

export interface BiomeSourceTabProps {
  
}

function BiomeSourceTab (props: BiomeSourceTabProps) {
  const src = useBiomeSource();
  const catalogue = useBiomeCatalogue();

  const dispatch = useDispatch();
  
  const [tab, setTab] = useState<string | null>("land");
  const [brush, setBrush] = useState<string | null>(null);
  
  const openRestartModal = () => modals.openConfirmModal({
    title: 'Restart biome catalogue',
    children: (
      <Text size='sm'>
        Do you want to restart the biome catalogue to its default value
        (Vanilla Minecraft's list with default colors)? This action cannot
        be undone.
      </Text>
    ),
    labels: {
      confirm: "Restart",
      cancel: "Cancel",
    },
    onConfirm: handleRestart,
  });
  
  const openNewModal = () => modals.openConfirmModal({
    title: 'Restart biome catalogue',
    children: (
      <Text size='sm'>
        You will discard the current document and get a new one. This action
        won't be saved.
      </Text>
    ),
    labels: {
      confirm: "Accept",
      cancel: "Cancel",
    },
    onConfirm: handleNew,
  });

  return (
    <div className={styles.tab}>
      <div className={styles.ribbon}>
        <Tooltip
          label="Reset the document."
        >
          <Button
            size='compact-sm'
            onClick={openRestartModal}
          >
            Restart
          </Button>
        </Tooltip>

        <Tooltip
          label="Discard the current document and get a blank one."
        >
          <Button
            size='compact-sm'
            onClick={openNewModal}
          >
            New
          </Button>
        </Tooltip>

        <Tooltip
          label="Open a json containing a biome source."
        >
          <Button
            size='compact-sm'
            onClick={handleOpen}
          >
            Open
          </Button>
        </Tooltip>

        <Tooltip
          label="Export a json for Minecraft's data pack (data/minecraft/dimension/*.json). This is ONLY the value of the field 'generator', not the entire file."
        >
          <Button
            size='compact-sm'
            onClick={handleExport}
          >
            Export
          </Button>
        </Tooltip>
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
          <Tabs.Tab value="river">River</Tabs.Tab>
          <Tabs.Tab value="ocean">Ocean</Tabs.Tab>
          <Tabs.Tab value="exotic">Exotic islands</Tabs.Tab>
          <Tabs.Tab value="land">Land</Tabs.Tab>
          <Tabs.Tab value="cave">Caves</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="river">
          (river)
        </Tabs.Panel>

        <Tabs.Panel value="ocean">
          <OceanTab
            brush={brush}
            onPickBrush={setBrush}
          />
        </Tabs.Panel>

        <Tabs.Panel value="exotic">
          <ExoticTab
            brush={brush}
            onPickBrush={setBrush}
          />
        </Tabs.Panel>

        <Tabs.Panel value="land">
          <LandTab
            brush={brush}
            onPickBrush={setBrush}
          />
        </Tabs.Panel>

        <Tabs.Panel value="cave">
          <CaveTab
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
  );
  
  function handleRestart () {
    dispatch(BiomeSourceActions.loadBiomeSource(vanillaDoc as MndBiomeSource));
  }
  
  function handleNew () {
    dispatch(BiomeSourceActions.loadBiomeSource(makeMndBiomeSource()));
  }

  async function handleOpen () {
      const f = await openFile();
      if (!f) return;
  
      try {
        const data = await f.text();
        const raw = JSON.parse(data);
        
        dispatch(BiomeSourceActions.loadBiomeSource(raw as MndBiomeSource));
      }
      catch (err) {
        console.error(err);
      }
  }

  function handleExport () {
    const txt = JSON.stringify(src.doc, null, 2);

    const blob = new Blob([txt], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, "biome_source.json");
  }
}

export default BiomeSourceTab;
