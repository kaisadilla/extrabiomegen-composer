import { Button, Checkbox, Pagination, Table, TextInput } from '@mantine/core';
import { generateLangFile } from 'api/LangFile';
import { DEFAULT_LANGCODE } from 'Const';
import { saveAs } from 'file-saver';
import fuzzysort from 'fuzzysort';
import { useEffect, useState } from 'react';
import useLang from 'state/langSlice';
import { jsonSortKeysCallback } from 'utils';
import styles from './LangEntryTable.module.scss';

const PAGE_SIZE = 24;

export interface LangEntryTableProps {
  namespace: string;
  langcode: string;
  group: string | null;
  onOverride?: (key: string, value: string) => void;
  onEnable?: (key: string, enabled: boolean) => void;
}

function LangEntryTable ({
  namespace,
  langcode,
  group,
  onOverride,
  onEnable,
}: LangEntryTableProps) {
  const lang = useLang();

  const [query, setQuery] = useState("");
  const [exact, setExact] = useState(false);
  const [page, setPage] = useState(1);

  const base = lang.files[namespace];
  const overrides = lang.overrides[namespace];
  const removals = lang.removals[namespace];

  useEffect(() => {
    setPage(1);
  }, [query, group]);

  if (!base || !overrides || !removals) return null;

  const entries = group
    ? Object.keys(base).filter(k => k.startsWith(group + "."))
    : Object.keys(base);

  const queriedEntries = exact
    ? entries.filter(s => s.includes(query)).map(s => ({
      target: s,
      highlight: () => s.replaceAll(query, `<b>${query}</b>`),
    }))
    : fuzzysort.go(query, entries, {
      all: true,
    });

  const pageCount = Math.ceil(queriedEntries.length / PAGE_SIZE);

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
        <Button
          onClick={() => setExact(prev => !prev)}
          size='compact-sm'
        >
          {exact ? "Exact" : "Smart"}
        </Button>
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
            {queriedEntries.slice(start, end).map((k, i) => (
              <_Entry
                key={k.target}
                index={i}
                entryKey={k.target}
                display={k.highlight()}
                base={
                  langcode === DEFAULT_LANGCODE
                    ? base[k.target]
                    : overrides[DEFAULT_LANGCODE][k.target] ?? base[k.target]
                }
                override={overrides[langcode]?.[k.target] ?? ""}
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
    const file = generateLangFile(lang, namespace, langcode);
    if (file === null) return;

    const txt = JSON.stringify(file, jsonSortKeysCallback, 2);

    const blob = new Blob([txt], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, `${langcode}.json`);
  }
}

interface _EntryProps {
  index: number;
  entryKey: string;
  display: string;
  base: string;
  override: string;
  removed: boolean;
  onChangeValue?: (value: string) => void;
  onChangeEnabled?: (enabled: boolean) => void;
}

function _Entry ({
  index,
  entryKey,
  display,
  base,
  override,
  removed,
  onChangeValue,
  onChangeEnabled,
}: _EntryProps) {
  const lang = useLang();

  const [value, setValue] = useState(removed ? "" : override);

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
            tabIndex={index}
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
          tabIndex={100_000 + index}
          disabled={removed}
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
