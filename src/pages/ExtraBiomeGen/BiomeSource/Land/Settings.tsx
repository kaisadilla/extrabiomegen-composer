import { InputDescription, InputLabel, SegmentedControl } from '@mantine/core';
import BiomeCell from 'components/BiomeCell';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'state/store';
import type { StateSetter } from 'types';
import styles from './Settings.module.scss';
import type { BiomeTableLeftClickMode, BiomeTableRightClickMode } from './tab';

export interface SettingsProps {
  brush: string | null;
  leftClickMode: BiomeTableLeftClickMode;
  setLeftClickMode: StateSetter<BiomeTableLeftClickMode>;
  rightClickMode: BiomeTableRightClickMode;
  setRightClickMode: StateSetter<BiomeTableRightClickMode>;
  overrideCell: string[];
}

function Settings ({
  brush,
  leftClickMode,
  setLeftClickMode,
  rightClickMode,
  setRightClickMode,
  overrideCell,
}: SettingsProps) {
  const biomes = useSelector((state: RootState) => state.biomeCatalogue.biomes);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className={styles.panel}>
      <InputLabel className={styles.brush}>
        <div className={styles.label}>Current brush</div>
        <BiomeCell
          className={styles.biome}
          biome={brush ? biomes[brush] : null}
        />
      </InputLabel>

      <InputLabel>Left click behavior</InputLabel>
      <SegmentedControl
        data={[
          { value: "set", label: "Set" },
          { value: "add", label: "Add" },
          { value: "override", label: "Replace" },
        ]}
        value={leftClickMode}
        onChange={v => setLeftClickMode(v as BiomeTableLeftClickMode)}
        transitionDuration={100}
      />
      <InputDescription>
        <strong>Set:</strong> replace the region clicked with the current brush.
      </InputDescription>
      <InputDescription>
        <strong>Add:</strong> append a new region with the brush at the end of the cell.
      </InputDescription>
      <InputDescription>
        <strong>Replace:</strong> replace the entire cell with the template defined below.
        While this mode is active, right clicking on a cell will pick that cell as a template.
      </InputDescription>

      <InputLabel>Template</InputLabel>
      <div className={styles.template}>
        {overrideCell.map((b, i) => <BiomeCell key={i} biome={biomes[b]} />)}
      </div>
    
      <InputLabel>Right click behavior</InputLabel>
      <SegmentedControl
        data={[
          { value: "pick", label: "Pick" },
          { value: "delete", label: "Delete" },
        ]}
        value={rightClickMode}
        onChange={v => setRightClickMode(v as BiomeTableRightClickMode)}
        transitionDuration={100}
      />
      <InputDescription>
        <strong>Pick:</strong> pick the biome in the region clicked as your new brush.
      </InputDescription>
      <InputDescription>
        <strong>Delete:</strong> delete the region clicked.
      </InputDescription>
    </div>
  );

  function handleKeyDown (evt: KeyboardEvent) {
    if (evt.key === 'Control') {
      setLeftClickMode(prev => prev === 'set' ? 'add' : prev);
      setRightClickMode('delete');
    }
  }

  function handleKeyUp (evt: KeyboardEvent) {
    if (evt.key === 'Control') {
      setLeftClickMode(prev => prev === 'add' ? 'set' : prev);
      setRightClickMode('pick');
    }
  }
}

export default Settings;
