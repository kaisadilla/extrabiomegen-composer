import ResizableSeparator from 'components/ResizableSeparator';
import { DEFAULT_NS } from 'Const';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Group, Panel } from 'react-resizable-panels';
import type { RootState } from 'state/store';
import LangTable from '../LangTable';
import NamespaceList from '../NamespaceList';
import styles from './tab.module.scss';

export interface PackTabProps {
  
}

function PackTab (props: PackTabProps) {
  const lang = useSelector((state: RootState) => state.lang);
  const dispatch = useDispatch();

  const namespaces = Object.keys(lang.overrides).sort((a, b) => {
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
        id='lang-pack'
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
          <LangTable
            namespace={ns}
          />
        </Panel>
      </Group>
    </div>
  );
  
    function handleAddNs () {
      
    }
}

export default PackTab;
