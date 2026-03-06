import { Button, Tabs, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { BiomeSchema, type Biome } from 'api/Biome';
import vanillaBiomeCatalogue from 'data/minecraft/biomes.json';
import { saveAs } from 'file-saver';
import Local from 'Local';
import { openImportContent } from 'modals/ImportContent';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useBiomeCatalogue, { BiomeCatalogueActions } from 'state/biomeCatalogueSlice';
import { openFile } from 'utils';
import z from 'zod';
import Info from './Info';
import BiomeList from './List/tab';
import styles from './tab.module.scss';

export interface BiomeCatalogueTabProps {
  
}

function BiomeCatalogueTab (props: BiomeCatalogueTabProps) {
  const catalogue = useBiomeCatalogue();
  const dispatch = useDispatch();

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

  return (
    <div className={styles.tab}>
      <div className={styles.ribbon}>
        <Tooltip
          label="Saves this document, as is, into the browser."
        >
          <Button
            size='compact-sm'
            onClick={handleSaveLocally}
          >
            Save locally
          </Button>
        </Tooltip>

        <Tooltip
          label="Reset the biome catalogue to just Vanilla biomes."
        >
          <Button
            size='compact-sm'
            onClick={openRestartModal}
          >
            Restart
          </Button>
        </Tooltip>
        
        <Tooltip
          label="Add a list of biomes to the catalogue."
        >
          <Button
            size='compact-sm'
            onClick={() => openImportContent({
              instructions: "Paste or write a list of biome ids "
                + "(e.g. 'regions_unexplored:rainforest'). Write one biome id "
                + "per line.",
              onSubmit: handleAddBiomes,
            })}
          >
            Add biomes
          </Button>
        </Tooltip>

        <Tooltip
          label="Open a biome catalogue file."
        >
          <Button
            size='compact-sm'
            onClick={handleOpen}
          >
            Open
          </Button>
        </Tooltip>

        <Tooltip
          label="Save the biome catalogue to disk, to be able to import it later."
        >
          <Button
            size='compact-sm'
            onClick={handleSave}
          >
            Save
          </Button>
        </Tooltip>

        <Tooltip
          label="Export a json for Minecraft's data pack (data/extrabiomegen/biomes/*.json)."
        >
          <Button
            size='compact-sm'
            onClick={handleExport}
          >
            Export
          </Button>
        </Tooltip>
      </div>

      <_Tabs />
    </div>
  );

  function handleSaveLocally () {
    Local.saveBiomes(catalogue.biomes);
  }

  function handleRestart () {
    dispatch(BiomeCatalogueActions.loadBiomeCatalogue(
      vanillaBiomeCatalogue as Biome[]
    ));
  }

  function handleAddBiomes (text: string) {
    const rows = text
      .replaceAll("\r\n", "\n")
      .split("\n")
      .map(r => r.trim())
      .filter(r => r !== "");

    for (const r of rows) {
      const rl = r.split(":");

      if (rl.length !== 2) {
        console.log(`Skipping value '${r}' as it's not valid.`);
        continue;
      }

      const sanitized = rl[0].trim() + ":" + rl[1].trim();

      dispatch(BiomeCatalogueActions.addBiome(sanitized));
    }
  }

  async function handleOpen () {
    const f = await openFile();
    if (!f) return;

    try {
      const data = await f.text();
      const raw = JSON.parse(data);

      const schema = z.array(BiomeSchema);
      const biomes = schema.parse(raw);
      if (!biomes) return;
      
      dispatch(BiomeCatalogueActions.loadBiomeCatalogue(biomes as Biome[]));
    }
    catch (err) {
      console.error(err);
    }
  }

  function handleSave () {
    const txt = JSON.stringify(Object.values(catalogue.biomes), null, 2);

    const blob = new Blob([txt], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, "biome-catalogue.json");
  }

  function handleExport () {
    const txt = JSON.stringify(
      Object.values(catalogue.biomes).map(b => ({
        id: b.id,
        color: b.color,
      })),
      null,
      2
    );

    const blob = new Blob([txt], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, "minecraft.json");
  }
}

interface _TabsProps {
  
}

function _Tabs (props: _TabsProps) {
  const [tab, setTab] = useState<string | null>("list");

  return (
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
        Groups
      </Tabs.Panel>
    </Tabs>
  );
}


export default BiomeCatalogueTab;
