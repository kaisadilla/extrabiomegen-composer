import { TextInput } from '@mantine/core';
import { generateLangPackFileName } from 'api/LangFile';
import { useDispatch, useSelector } from 'react-redux';
import { LangActions } from 'state/langSlice';
import type { RootState } from 'state/store';
import styles from './tab.module.scss';

export interface SettingsTabProps {
  
}

function SettingsTab (props: SettingsTabProps) {
  const lang = useSelector((state: RootState) => state.lang);
  const dispatch = useDispatch();

  return (
    <div className={styles.tab}>
      <TextInput
        label="Pack name"
        value={lang.packName}
        onChange={
          evt => dispatch(LangActions.setPackName(evt.currentTarget.value))
        }
      />
      <div className={styles.internalName}>
        File's name will be "{generateLangPackFileName(lang.packName)}"
      </div>
      <TextInput
        label="Removal prefix"
        value={lang.removalPrefix}
        onChange={
          evt => dispatch(LangActions.setRemovalPrefix(evt.currentTarget.value))
        }
      />
    </div>
  );
}

export default SettingsTab;
