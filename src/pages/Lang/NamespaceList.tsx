import { $cl } from 'utils';
import styles from './NamespaceList.module.scss';

export interface NamespaceListProps {
  items: { key: string, label: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
  onAdd?: () => void;
}

function NamespaceList ({
  items,
  value,
  onChange: setValue,
  onAdd,
}: NamespaceListProps) {

  return (
    <div className={styles.list}>
      {items.map(i => (
        <div
          key={i.key}
          className={styles.entry}
          data-active={i.key === value}
          onClick={() => setValue(i.key === value ? null : i.key)}
        >
          {i.label}
        </div>
      ))}
      {onAdd && <div
        className={$cl(styles.entry, styles.add)}
        onClick={onAdd}
      >
        + Add
      </div>}
    </div>
  );
}

export default NamespaceList;
