import { Tooltip } from '@mantine/core';
import { PaletteIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import { getBiomeStyle, type Biome, type BiomeGroup } from 'api/Biome';
import Button from 'components/Button';
import ColorPickerModal from 'components/ColorPickerModal';
import { openPickBiomeModal } from 'modals/PickBiome';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiomeCatalogueActions } from 'state/biomeCatalogueSlice';
import type { RootState } from 'state/store';
import styles from './Group.module.scss';

export interface GroupProps {
  id: number;
  group: BiomeGroup;
}

function Group ({
  id,
  group,
}: GroupProps) {
  const catalogue = useSelector((state: RootState) => state.biomeCatalogue);
  const dispatch = useDispatch();

  return (
    <div className={styles.group}>
      <div className={styles.name}>
        <input
          type='text'
          value={group.name}
          onChange={handleChangeName}
          placeholder="group_tag"
        />
      </div>
      <div className={styles.biomes}>
        {group.biomes.map((b, i) => <_Biome
          key={b}
          biome={catalogue.biomes[b]}
          onRemove={handleRemoveBiome}
        />)}

        <Button
          onClick={handleAddBiome}
        >
          <PlusIcon size={16} />
          <div>Add biome</div>
        </Button>
      </div>
    </div>
  );

  function handleChangeName (evt: React.ChangeEvent<HTMLInputElement>) {
    let name = evt.currentTarget.value;
    if (!name || name === "") return;

    name = name
      .replaceAll(" ", "_")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .toLowerCase();

    dispatch(BiomeCatalogueActions.setGroupName({
      id,
      name,
    }));
  }

  function handleAddBiome () {
    openPickBiomeModal({
      values: Object.values(catalogue.biomes)
        .filter(b => group.biomes.includes(b.id) === false),
      onSubmit (biomeId: string) {
        if (group.biomes.includes(biomeId)) return;

        dispatch(BiomeCatalogueActions.setGroupBiomes({
          id,
          biomes: [...group.biomes, biomeId],
        }));
      }
    })
  }

  function handleRemoveBiome (biomeId: string) {
    if (group.biomes.includes(biomeId) === false) return;

    dispatch(BiomeCatalogueActions.setGroupBiomes({
      id,
      biomes: group.biomes.filter(b => b !== biomeId),
    }));
  }
}

interface _BiomeProps {
  biome: Biome;
  onRemove: (biomeId: string) => void;
}

function _Biome ({
  biome,
  onRemove,
}: _BiomeProps) {
  const dispatch = useDispatch();

  const [colorPicker, setColorPicker] = useState(false);

  return (<>
    <div
      className={styles.biome}
      style={getBiomeStyle(biome)}
    >
      <div className={styles.name}>
        {biome.name}
      </div>

      <Tooltip label="Change biome's color">
        <Button
          onClick={() => setColorPicker(true)}
        >
          <PaletteIcon size={18} />
        </Button>
      </Tooltip>

      <Tooltip label="Remove from list">
        <Button
          variant='danger'
          onClick={() => onRemove(biome.id)}
        >
          <XIcon size={18} />
        </Button>
      </Tooltip>
    </div>

    {colorPicker && <ColorPickerModal
      value={biome.color}
      onCancel={() => setColorPicker(false)}
      onAccept={handlePickColor}
    />}
  </>);

  function handlePickColor (color: string) {
    dispatch(BiomeCatalogueActions.setBiomeColor({
      id: biome.id,
      color,
    }));

    setColorPicker(false);
  }
}


export default Group;
