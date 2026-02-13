import { Button, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { saveAs } from 'file-saver';
import { openImportContent } from 'modals/ImportContent';
import { useDispatch } from 'react-redux';
import { DocActions } from 'state/docSlice';
import useDoc from 'state/useDoc';
import BiomeEntry from './Biome';
import styles from './tab.module.scss';

export interface AvailableBiomesTabProps {
  
}

function AvailableBiomesTab (props: AvailableBiomesTabProps) {
  const doc = useDoc();
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

  const namespaces = new Set<string>();

  for (const b of Object.values(doc.biomes)) {
    const rl = b.id.split(":");
    namespaces.add(rl[0]);
  }

  return (
    <div className={styles.tab}>
      <div className={styles.ribbon}>
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
        <Button
          size='compact-sm'
          onClick={exportAppJson}
        >
          Export App
        </Button>
        <Button
          size='compact-sm'
          onClick={exportDataJson}
        >
          Export MC
        </Button>
      </div>
      <div className={styles.modList}>
        {[...namespaces].map(ns => (
          <div
            key={ns}
          >
            <h2>{ns}</h2>
            <div className={styles.list}>
              {Object.values(doc.biomes).filter(b => b.id.split(":")[0] === ns)
                .map(b => <BiomeEntry key={b.id} biome={b} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function handleRestart () {
    
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

      dispatch(DocActions.addBiome(sanitized));
      console.log(`Added '${sanitized}'.`);
    }
  }

  function exportAppJson () {
    const txt = JSON.stringify(Object.values(doc.biomes), null, 2);

    const blob = new Blob([txt], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, "biomes.geojson");
  }

  function exportDataJson () {
    const txt = JSON.stringify(
      Object.values(doc.biomes).map(b => ({
        id: b.id,
        color: b.color,
      })),
      null,
      2
    );

    const blob = new Blob([txt], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, "biomedata.geojson");
  }
}

export default AvailableBiomesTab;
