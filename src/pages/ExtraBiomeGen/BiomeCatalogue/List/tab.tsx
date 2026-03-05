import { Button, Checkbox, Collapse, Table, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { Biome } from 'api/Biome';
import ColorPickerModal from 'components/ColorPickerModal';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useBiomeCatalogue, { BiomeCatalogueActions } from 'state/biomeCatalogueSlice';
import { chooseW3CTextColor } from 'utils';
import BiomeEntry from '../BiomeEntry';
import styles from './tab.module.scss';

export interface BiomeListProps {
  
}

function BiomeList (props: BiomeListProps) {
  const catalogue = useBiomeCatalogue();
  const dispatch = useDispatch();

  const namespaces = new Set<string>();

  for (const b of Object.values(catalogue.biomes)) {
    const rl = b.id.split(":");
    namespaces.add(rl[0]);
  }

  return (
    <div className={styles.tab}>
        {[...namespaces].map(ns => (
          <_Mod
            key={ns}
            mod={ns}
            biomes={
              Object.values(catalogue.biomes)
                .filter(b => b.id.split(":")[0] === ns)
            }
          />
        ))}
    </div>
  );
}

interface _ModProps {
  mod: string;
  biomes: Biome[];
}

function _Mod ({
  mod,
  biomes,
}: _ModProps) {
  const [ opened, { toggle } ] = useDisclosure(false);

  return (
    <div className={styles.mod}>
      <h2
        onClick={toggle}
      >
        {mod} ({biomes.filter(b => b.wanted === true).length} / {biomes.length})
      </h2>

      <Collapse in={opened} className={styles.list} transitionDuration={100}>
        {false && <Table
          classNames={{
            table: styles.biomeTable,
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Td classNames={{ td: styles.drag }}>—</Table.Td>
              <Table.Td classNames={{ td: styles.wanted }}>Wanted</Table.Td>
              <Table.Td classNames={{ td: styles.id }}>Id</Table.Td>
              <Table.Td classNames={{ td: styles.color }}>Color</Table.Td>
              <Table.Td classNames={{ td: styles.name }}>Short name</Table.Td>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {biomes.map(b => (
              <_BiomeRow
                key={b.id}
                biome={b}
              />
            ))}
          </Table.Tbody>
        </Table>}

        <div className={styles.gallery}>
          {true && biomes.map(b => <BiomeEntry key={b.id} biome={b} />)}
        </div>
      </Collapse>
    </div>
  );
}

interface _BiomeRowProps {
  biome: Biome;
}

function _BiomeRow ({
  biome,
}: _BiomeRowProps) {
  const dispatch = useDispatch();
  
  const [colorPicker, setColorPicker] = useState(false);

  return (
    <Table.Tr
      key={biome.id}
      style={{
        '--color-biome': biome.color,
        '--color-biome-text': chooseW3CTextColor(biome.color),
      }}
      data-disabled={biome.wanted === false}
    >
      <Table.Td
        classNames={{ td: styles.drag }}
      >
        —
      </Table.Td>

      <Table.Td
        classNames={{ td: styles.wanted }}
      >
        <Checkbox
          checked={biome.wanted}
          onChange={handleChangeWanted}
        />
      </Table.Td>

      <Table.Td
        classNames={{ td: styles.id }}
      >
        {biome.id}
      </Table.Td>

      <Table.Td
        classNames={{ td: styles.color }}
      >
        <div>
          <TextInput
            variant='unstyled'
            classNames={{
              root: styles.colorInput,
              input: styles.colorInputInput,
            }}
            value={biome.color}
            onChange={handleChangeColor}
          />
          
          <Button
            size='compact-xs'
            onClick={() => setColorPicker(true)}
          >
            Color
          </Button>
        </div>
      </Table.Td>

      <Table.Td classNames={{ td: styles.name }}>
        <TextInput
          variant='unstyled'
          classNames={{
            input: styles.nameInput,
          }}
          value={biome.name}
          onChange={handleChangeName}
        />
      </Table.Td>

      {colorPicker && <ColorPickerModal
        value={biome.color}
        onCancel={() => setColorPicker(false)}
        onAccept={handlePickColor}
      />}
    </Table.Tr>
  );

  function handleChangeWanted (evt: React.ChangeEvent<HTMLInputElement>) {
    dispatch(BiomeCatalogueActions.setBiomeWanted({
      id: biome.id,
      wanted: evt.currentTarget.checked,
    }));
  }

  function handleChangeName (evt: React.ChangeEvent<HTMLInputElement>) {
    dispatch(BiomeCatalogueActions.setBiomeName({
      id: biome.id,
      name: evt.currentTarget.value,
    }));
  }

  function handleChangeColor (evt: React.ChangeEvent<HTMLInputElement>) {
    dispatch(BiomeCatalogueActions.setBiomeColor({
      id: biome.id,
      color: evt.currentTarget.value,
    }));
  }

  function handlePickColor (color: string) {
    dispatch(BiomeCatalogueActions.setBiomeColor({
      id: biome.id,
      color,
    }));

    setColorPicker(false);
  }
}



export default BiomeList;
