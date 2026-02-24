import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useLang, { LangActions } from 'state/langSlice';
import LangEntryTable from './LangEntryTable';
import styles from './LangTable.module.scss';

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

  return (
    <div className={styles.langTable}>
      <div className={styles.groups}>
        {[...groups].map(g => (
          <div
            className={styles.group}
            onClick={() => handleClickFilter(g)}
            data-active={g === filter}
          >
            {g}
          </div>
        ))}
      </div>
      <div className={styles.tableContainer}>
        <LangEntryTable
          namespace={namespace}
          group={filter}
          onOverride={(k, v) => handleOverride(namespace, k, v)}
          onEnable={(k, v) => handleEnable(namespace, k, v)}
        />
      </div>
    </div>
  );

  function handleClickFilter (group: string) {
    setFilter(prev => prev === group ? null : group);
  }

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
