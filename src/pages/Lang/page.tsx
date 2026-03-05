import { Button, Tabs, Tooltip } from '@mantine/core';
import { parseLangFile } from 'api/LangFile';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Local from 'Local';
import { openImportLang } from 'modals/ImportLang';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useLang, { LangActions, type LangDoc } from 'state/langSlice';
import { openFile } from 'utils';
import LangTable from './LangTable';
import styles from './page.module.scss';

export interface LangPageProps {
  
}

function LangPage (props: LangPageProps) {
  const lang = useLang();
  const dispatch = useDispatch();

  const [tab, setTab] = useState<string | null>('info');

  const keys = Object.keys(lang.files).sort((a, b) => a.localeCompare(b));

  return (
    <div className={styles.page}>
      <div className={styles.ribbon}>
        <Tooltip
          label="Saves this document, as is, into the browser."
        >
          <Button
            size='compact-sm'
            onClick={handleSaveLocally}
          >
            Save locally
          </Button>
        </Tooltip>

        <Button
          size='compact-sm'
          onClick={handleOpen}
        >
          Open
        </Button>

        <Tooltip
          label="Saves this document as a file to be opened later."
        >
          <Button
            size='compact-sm'
            onClick={handleSave}
          >
            Save
          </Button>
        </Tooltip>

        <Tooltip
          label="Exports this document as a resource pack, containing each lang in its namespace."
        >
          <Button
            size='compact-sm'
            onClick={handleExport}
          >
            Export
          </Button>
        </Tooltip>

        <Button
          size='compact-sm'
          onClick={() => openImportLang({
            onSubmit: handleImportLang,
          })}
        >
          Add lang file
        </Button>
      </div>
      
      <Tabs
        classNames={{
          root: styles.tabContainer,
          panel: styles.tabPanel
        }}
        value={tab}
        onChange={setTab}
      >
        <Tabs.List>
          <Tabs.Tab value="info">
            <strong>Information</strong>
          </Tabs.Tab>
          {keys.map(ns => (
            <Tabs.Tab key={ns} value={ns}>
              {ns}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="info">
          TODO: Info
        </Tabs.Panel>
        {keys.map(ns => (
          <Tabs.Panel key={ns} value={ns}>
            <div className={styles.langTblContainer}>
              <LangTable namespace={ns} />
            </div>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );

  function handleSaveLocally () {
    Local.saveLangFiles(lang.files);
    Local.saveLangOverrides(lang.overrides);
    Local.saveLangRemovals(lang.removals);
  }

  async function handleOpen () {
    const f = await openFile();
    if (!f) return;

    try {
      const data = await f.text();
      const raw = JSON.parse(data);
      
      dispatch(LangActions.loadDoc(raw as LangDoc));
    }
    catch (err) {
      console.error(err);
    }
  }

  function handleSave () {
    const txt = JSON.stringify(lang, null, 2);

    const blob = new Blob([txt], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, "doc-lang.json");
  }

  async function handleExport () {
    const zip = new JSZip();

    for (const ns of Object.keys(lang.files)) {
      const overrides = lang.overrides[ns];
      const removals = lang.removals[ns];

      if (!overrides && !removals) continue;

      const file: Record<string, string> = {};

      for (const k of Object.keys(overrides)) {
        file[k] = overrides[k];
      }
      for (const k of removals) {
        file[k] = lang.removalPrefix + k;
      }

      if (Object.keys(file).length === 0) continue;

      zip.file(
        `${ns}/lang/en_us.json`,
        JSON.stringify(file, jsonSortKeysCallback, 2)
      );
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, "renames.zip");
  }

  function handleImportLang (namespace: string, content: string) {
    if (namespace === "") {
      console.info("No namespace.");
      return;
    }
    
    var file = parseLangFile(content);
    if (!file) {
      console.info("no file.");
      return;
    }

    dispatch(LangActions.addLangFile({
      namespace,
      file,
    }));
  }

  function jsonSortKeysCallback (key: string, value: any) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((sorted, k) => {
          sorted[k] = value[k];
          return sorted;
        }, {} as Record<string, any>);
    }

    return value;
  }
}

export default LangPage;
