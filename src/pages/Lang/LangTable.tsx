import ResizableSeparator from 'components/ResizableSeparator';
import { DEFAULT_LANGCODE } from 'Const';
import { openStringPrompt } from 'modals/StringPrompt';
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

  const dispatch = useDispatch();

  const [langCode, setLangCode] = useState<string>(DEFAULT_LANGCODE);
  const [filter, setFilter] = useState<string | null>(null);

  const base = lang.files[namespace];
  const overrides = lang.overrides[namespace];

  const langCodes = Object.keys(overrides);
  const groups = new Set<string>();

  for (const k of Object.keys(base ?? {})) {
    const parts = k.split(".");
    if (parts.length !== 0) groups.add(parts[0]);
  }

  useEffect(() => {
    if (filter && groups.has(filter) === false) {
      setFilter(null);
    }
    if (!lang.overrides[namespace][langCode]) {
      setLangCode(DEFAULT_LANGCODE);
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
            value={langCode}
            onChange={c => c ? setLangCode(c) : {}}
            items={langCodes.map(c => ({ key: c, label: c }))}
            onAdd={handleAddOverrideLangCode}
          />
        </Panel>
        <ResizableSeparator />
        <Panel
          className={styles.namespacePanel}
          defaultSize={2}
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
          defaultSize={12}
        >
          <LangEntryTable
            key={langCode}
            namespace={namespace}
            langcode={langCode}
            group={filter}
            onOverride={(k, v) => handleOverride(namespace, k, v)}
            onEnable={(k, v) => handleEnable(namespace, k, v)}
          />
        </Panel>
      </Group>
    </div>
  );

  function handleAddOverrideLangCode () {
    openStringPrompt({
      label: "Lang code",
      placeholder: "e.g. 'es_es'",
      onSubmit: langCode => dispatch(LangActions.addOverrideLangcode({
        namespace,
        langCode,
      }))
    });
  }

  function handleOverride (namespace: string, key: string, value: string) {
    dispatch(LangActions.override({
      namespace,
      langCode,
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
