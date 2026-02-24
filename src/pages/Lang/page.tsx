import { Button, Tabs, Tooltip } from '@mantine/core';
import { parseLangFile } from 'api/LangFile';
import { saveAs } from 'file-saver';
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
}

export default LangPage;
