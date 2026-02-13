import { Button, TextInput } from '@mantine/core';
import type { Biome } from 'api/Biome';
import { useState } from 'react';
import { PhotoshopPicker } from 'react-color';
import { useDispatch } from 'react-redux';
import { DocActions } from 'state/docSlice';
import { chooseW3CTextColor } from 'utils';
import styles from './Biome.module.scss';

export interface BiomeProps {
  biome: Biome;
}

function BiomeEntry ({
  biome,
}: BiomeProps) {
  const [colorPicker, setColorPicker] = useState(false);
  const [color, setColor] = useState(biome.color);

  const dispatch = useDispatch();

  return (<>
    <div
      className={styles.biome}
      style={{
        backgroundColor: biome.color,
        color: chooseW3CTextColor(biome.color),
      }}
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
        <Button
          size='compact-xs'
          onClick={() => setColorPicker(true)}
        >
          Color
        </Button>
        <TextInput
          variant='unstyled'
          classNames={{
            root: styles.colorInput,
            input: styles.colorInputInput,
          }}
          value={biome.color}
          onChange={handleChangeColor}
        />
      </div>
    </div>

    {colorPicker && <div className={styles.colorPickerContainer}>
      <PhotoshopPicker
        className={styles.colorPicker}
        color={color}
        onChange={c => setColor(c.hex)}
        onCancel={() => setColorPicker(false)}
        onAccept={handlePickColor}
      />
    </div>}
  </>);

  function handleChangeName (evt: React.ChangeEvent<HTMLInputElement>) {
    dispatch(DocActions.setBiomeName({
      id: biome.id,
      name: evt.currentTarget.value,
    }));
  }

  function handleChangeColor (evt: React.ChangeEvent<HTMLInputElement>) {
    dispatch(DocActions.setBiomeColor({
      id: biome.id,
      color: evt.currentTarget.value,
    }));
    
    setColor(evt.currentTarget.value);
  }

  function handlePickColor () {
    dispatch(DocActions.setBiomeColor({
      id: biome.id,
      color,
    }));

    setColorPicker(false);
  }
}

export default BiomeEntry;
