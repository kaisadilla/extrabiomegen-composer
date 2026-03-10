import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { ArrowCounterClockwiseIcon, ArrowLineDownIcon, ArrowSquareOutIcon, FloppyDiskIcon, FolderOpenIcon, ListPlusIcon } from '@phosphor-icons/react';
import { BiomeSchema, type Biome } from 'api/Biome';
import Ribbon from 'components/Ribbon';
import vanillaBiomeCatalogue from 'data/minecraft/biomes.json';
import { saveAs } from 'file-saver';
import Local from 'Local';
import { openImportContent } from 'modals/ImportContent';
import { useDispatch, useSelector } from 'react-redux';
import { BiomeCatalogueActions } from 'state/biomeCatalogueSlice';
import type { RootState } from 'state/store';
import { openFile } from 'utils';
import z from 'zod';

export interface BiomeCatalogueRibbonProps {
  
}

function BiomeCatalogueRibbon (props: BiomeCatalogueRibbonProps) {
  const catalogue = useSelector((state: RootState) => state.biomeCatalogue);
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
    <Ribbon>
      <Ribbon.Button
        tooltip="Store the current document into the browser."
        onClick={handleSaveLocally}
      >
        <ArrowLineDownIcon size={24} weight='thin' />
        <div>Store</div>
      </Ribbon.Button>

      <Ribbon.Button
        tooltip="Reset the biome catalogue to just Vanilla biomes."
        onClick={openRestartModal}
      >
        <ArrowCounterClockwiseIcon size={24} weight='thin' />
        <div>Reset</div>
      </Ribbon.Button>

      <Ribbon.Button
        tooltip="Add a list of biomes to the catalogue."
        onClick={() => openImportContent({
          instructions: "Paste or write a list of biome ids "
            + "(e.g. 'regions_unexplored:rainforest'). Write one biome id "
            + "per line.",
          onSubmit: handleAddBiomes,
        })}
      >
        <ListPlusIcon size={24} weight='thin' />
        <div>Add biomes</div>
      </Ribbon.Button>

      <Ribbon.Button
        tooltip="Open a document."
        onClick={handleOpen}
      >
        <FolderOpenIcon size={24} weight='thin' />
        <div>Open</div>
      </Ribbon.Button>

      <Ribbon.Button
        tooltip="Save this document as a file to be opened later."
        onClick={handleSave}
      >
        <FloppyDiskIcon size={24} weight='thin' />
        <div>Save copy</div>
      </Ribbon.Button>

      <Ribbon.Button
        tooltip="Export a json for Minecraft's data pack (data/extrabiomegen/biomes/*.json)."
        onClick={handleExport}
      >
        <ArrowSquareOutIcon size={24} weight='thin' />
        <div>Export</div>
      </Ribbon.Button>
    </Ribbon>
  );

  function handleSaveLocally () {
    Local.saveBiomes(catalogue.biomes);
    Local.saveBiomeGroups(catalogue.groups);
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

export default BiomeCatalogueRibbon;
