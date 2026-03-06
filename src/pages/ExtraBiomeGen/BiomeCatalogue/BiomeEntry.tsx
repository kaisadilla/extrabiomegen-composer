import { Button, Checkbox, TextInput, Tooltip } from '@mantine/core';
import type { Biome } from 'api/Biome';
import ColorPickerModal from 'components/ColorPickerModal';
import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BiomeCatalogueActions } from 'state/biomeCatalogueSlice';
import { chooseW3CTextColor } from 'utils';
import styles from './BiomeEntry.module.scss';

export interface BiomeEntryProps {
  biome: Biome;
}

const BiomeEntry = memo(function BiomeEntry ({
  biome,
}: BiomeEntryProps) {
  const [colorPicker, setColorPicker] = useState(false);

  const dispatch = useDispatch();

  return (<>
    <div
      className={styles.biome}
      style={{
        '--color-biome': biome.color,
        '--color-biome-text': chooseW3CTextColor(biome.color),
      } as any}
      data-wanted={biome.wanted}
    >
      <div className={styles.id}>
        {biome.id}
      </div>
      <div className={styles.name}>
        <TextInput
          variant='unstyled'
          classNames={{
            input: styles.nameInput,
          }}
          value={biome.name}
          onChange={handleChangeName}
        />
      </div>
      <div className={styles.actions}>
        <Tooltip
          label="Wanted"
        >
          <Checkbox
            checked={biome.wanted}
            onChange={handleChangeWanted}
          />
        </Tooltip>

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
    </div>

    {colorPicker && <ColorPickerModal
      value={biome.color}
      onCancel={() => setColorPicker(false)}
      onAccept={handlePickColor}
    />}
  </>);

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

  function handleChangeWanted (evt: React.ChangeEvent<HTMLInputElement>) {
    dispatch(BiomeCatalogueActions.setBiomeWanted({
      id: biome.id,
      wanted: evt.currentTarget.checked,
    }));
  }

  function handlePickColor (color: string) {
    dispatch(BiomeCatalogueActions.setBiomeColor({
      id: biome.id,
      color,
    }));

    setColorPicker(false);
  }
});

export default BiomeEntry;
