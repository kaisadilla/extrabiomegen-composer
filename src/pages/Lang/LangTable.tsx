import ResizableSeparator from 'components/ResizableSeparator';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Group, Panel } from 'react-resizable-panels';
import useLang, { LangActions } from 'state/langSlice';
import LangEntryTable from './LangEntryTable';
import styles from './LangTable.module.scss';
import NamespaceList from './NamespaceList';

export interface LangTableProps {
  namespace: string;
}

function LangTable ({
  namespace,
}: LangTableProps) {
  const lang = useLang();
  const file = lang.files[namespace];

  const dispatch = useDispatch();

  const [filter, setFilter] = useState<string | null>(null);

  const groups = new Set<string>();

  for (const k of Object.keys(file ?? {})) {
    const parts = k.split(".");
    if (parts.length !== 0) groups.add(parts[0]);
  }

  useEffect(() => {
    if (filter && groups.has(filter) === false) {
      setFilter(null);
    }
  }, [namespace]);

  return (
    <div className={styles.langTable}>
      <Group
        className={styles.content}
        orientation='horizontal'
        id='lang-langtable'
      >
        <Panel
          className={styles.namespacePanel}
          defaultSize={1}
        >
          <NamespaceList
            value={filter}
            onChange={setFilter}
            items={[...groups].map(g => ({ key: g, label: g }))}
          />
        </Panel>
        <ResizableSeparator />
        <Panel
          className={styles.editor}
          defaultSize={6}
        >
          <LangEntryTable
            namespace={namespace}
            group={filter}
            onOverride={(k, v) => handleOverride(namespace, k, v)}
            onEnable={(k, v) => handleEnable(namespace, k, v)}
          />
        </Panel>
      </Group>
    </div>
  );

  function handleOverride (namespace: string, key: string, value: string) {
    dispatch(LangActions.override({
      namespace,
      key,
      value,
    }));
  }

  function handleEnable (namespace: string, key: string, enabled: boolean) {
    dispatch(LangActions.setEnabled({
      namespace,
      key,
      enabled,
    }));
  }
}

export default LangTable;
