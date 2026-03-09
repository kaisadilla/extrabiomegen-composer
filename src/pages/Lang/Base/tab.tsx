import type { LangFile } from 'api/LangFile';
import ResizableSeparator from 'components/ResizableSeparator';
import { DEFAULT_NS } from 'Const';
import { openImportLangFile } from 'modals/ImportLangFile';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Group, Panel } from 'react-resizable-panels';
import { LangActions } from 'state/langSlice';
import type { RootState } from 'state/store';
import NamespaceList from '../NamespaceList';
import FileEditor from './FileEditor';
import styles from './tab.module.scss';

export interface BaseTabProps {
  
}

function BaseTab (props: BaseTabProps) {
  const lang = useSelector((state: RootState) => state.lang);
  const dispatch = useDispatch();

  const namespaces = Object.keys(lang.files).sort((a, b) => {
    if (a === DEFAULT_NS) return -1;
    if (b === DEFAULT_NS) return 1;
    return a.localeCompare(b);
  });
  const [ns, setNs] = useState(namespaces[0] ?? DEFAULT_NS);

  return (
    <div className={styles.tab}>
      <Group
        className={styles.content}
        orientation='horizontal'
        id='lang-base'
      >
        <Panel
          className={styles.namespacePanel}
          defaultSize={1}
        >
          <NamespaceList
            value={ns}
            onChange={ns => ns ? setNs(ns) : {}}
            items={namespaces.map(ns => ({ key: ns, label: ns }))}
            onAdd={handleAddNs}
          />
        </Panel>
        <ResizableSeparator />
        <Panel
          className={styles.editor}
          defaultSize={8}
        >
          <FileEditor
            ns={ns}
          />
        </Panel>
      </Group>
    </div>
  );

  function handleAddNs () {
    openImportLangFile({
      onSubmit: handleImportLangFile
    })
  }

  function handleImportLangFile (namespace: string, file: LangFile) {
    dispatch(LangActions.addLangFile({
      namespace,
      file,
    }));
  }
}

export default BaseTab;
