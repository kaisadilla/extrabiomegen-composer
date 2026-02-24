import { Button, Checkbox, Pagination, Table, TextInput } from '@mantine/core';
import { saveAs } from 'file-saver';
import fuzzysort from 'fuzzysort';
import { useEffect, useState } from 'react';
import useLang from 'state/langSlice';
import styles from './LangEntryTable.module.scss';

const PAGE_SIZE = 24;

export interface LangEntryTableProps {
  namespace: string;
  group: string | null;
  onOverride?: (key: string, value: string) => void;
  onEnable?: (key: string, enabled: boolean) => void;
}

function LangEntryTable ({
  namespace,
  group,
  onOverride,
  onEnable,
}: LangEntryTableProps) {
  const lang = useLang();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const base = lang.files[namespace];
  const overrides = lang.overrides[namespace];
  const removals = lang.removals[namespace];

  const entries = group
    ? Object.keys(base).filter(k => k.startsWith(group + "."))
    : Object.keys(base);

  const queriedEntries = fuzzysort.go(query, entries, {
    all: true,
  });

  const pageCount = Math.ceil(queriedEntries.length / PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;

  return (
    <div className={styles.root}>
      <div className={styles.ribbon}>
        <div className={styles.buttons}>
          <Button
            onClick={handleExport}
            size='compact-sm'
          >
            Export
          </Button>
        </div>
        <TextInput
          value={query}
          onChange={evt => setQuery(evt.currentTarget.value)}
          placeholder="Search key"
          w={300}
          size='xs'
        />
      </div>
      <div className={styles.tableContainer}>
        <Table
          classNames={{
            table: styles.table,
            tbody: styles.tbody,
            tr: styles.tr,
            td: styles.td,
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Td>
                Enabled
              </Table.Td>
              <Table.Td>
                Key
              </Table.Td>
              <Table.Td>
                Value
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {queriedEntries.slice(start, end).map(k => (
              <_Entry
                key={k.target}
                entryKey={k.target}
                display={k.highlight()}
                base={base[k.target]}
                override={overrides[k.target] ?? ""}
                removed={removals.includes(k.target)}
                onChangeValue={v => onOverride?.(k.target, v)}
                onChangeEnabled={v => onEnable?.(k.target, v)}
              />
            ))}
          </Table.Tbody>
        </Table>
      </div>
      <div className={styles.pageContainer}>
        <Pagination
          total={pageCount}
          value={page}
          onChange={setPage}
          boundaries={1}
          siblings={4}
          classNames={{
            control: styles.paginationCtrl,
            dots: styles.paginationCtrl
          }}
        />
      </div>
    </div>
  );

  function handleExport () {
    const file: Record<string, string> = {};

    for (const k of Object.keys(overrides)) {
      file[k] = overrides[k];
    }

    for (const k of removals) {
      file[k] = lang.removalPrefix + k;
    }

    const txt = JSON.stringify(file, null, 2);

    const blob = new Blob([txt], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, "en_us.json");
  }
}

interface _EntryProps {
  entryKey: string;
  display: string;
  base: string;
  override: string;
  removed: boolean;
  onChangeValue?: (value: string) => void;
  onChangeEnabled?: (enabled: boolean) => void;
}

function _Entry ({
  entryKey,
  display,
  base,
  override,
  removed,
  onChangeValue,
  onChangeEnabled,
}: _EntryProps) {
  const lang = useLang();

  const [value, setValue] = useState(override);

  return (
    <Table.Tr
      data-enabled={removed === false}
    >
      <Table.Td classNames={{ td: styles.enabledKey }}>
        <div>
          <Checkbox
            size='xs'
            checked={removed === false}
            onChange={evt => onChangeEnabled?.(evt.currentTarget.checked)}
          />
        </div>
      </Table.Td>
      <Table.Td classNames={{ td: styles.entryKey }}>
        <span dangerouslySetInnerHTML={{ __html: display }} />
      </Table.Td>
      <Table.Td>
        <TextInput
          classNames={{ input: styles.entryInput }}
          size='xs'
          placeholder={removed ? lang.removalPrefix + entryKey : base}
          value={value}
          onChange={evt => setValue(evt.currentTarget.value)}
          onBlur={handleBlur}
        />
      </Table.Td>
    </Table.Tr>
  );

  function handleBlur (evt: React.FocusEvent) {
    if (value !== override) {
      onChangeValue?.(value);
    }
  }
}


export default LangEntryTable;
