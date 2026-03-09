import { InputLabel, SegmentedControl } from '@mantine/core';
import { useEffect } from 'react';
import type { StateSetter } from 'types';
import styles from './Settings.module.scss';
import type { BiomeTableRightClickMode, BiomeTableSetMode } from './tab';

export interface SettingsProps {
  setMode: BiomeTableSetMode;
  setSetMode: StateSetter<BiomeTableSetMode>;
  rightClickMode: BiomeTableRightClickMode;
  setRightClickMode: StateSetter<BiomeTableRightClickMode>;
}

function Settings ({
  setMode,
  setSetMode,
  rightClickMode,
  setRightClickMode,
}: SettingsProps) {

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
      <InputLabel>Set mode (Ctrl)</InputLabel>
      <SegmentedControl
        data={[
          { value: "replace", label: "Replace" },
          { value: "add", label: "Add" },
        ]}
        value={setMode}
        onChange={v => setSetMode(v as BiomeTableSetMode)}
        transitionDuration={100}
      />

      <InputLabel>Right click mode (Ctrl)</InputLabel>
      <SegmentedControl
        data={[
          { value: "pick", label: "Pick" },
          { value: "delete", label: "Delete" },
        ]}
        value={rightClickMode}
        onChange={v => setRightClickMode(v as BiomeTableRightClickMode)}
        transitionDuration={100}
      />
    </div>
  );

  function handleKeyDown (evt: KeyboardEvent) {
    if (evt.key === 'Control') {
      setSetMode('add');
      setRightClickMode('delete');
    }
  }

  function handleKeyUp (evt: KeyboardEvent) {
    if (evt.key === 'Control') {
      setSetMode('replace');
      setRightClickMode('pick');
    }
  }
}

export default Settings;
