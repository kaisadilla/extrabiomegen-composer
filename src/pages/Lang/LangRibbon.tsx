import { ArrowLineDownIcon, ArrowSquareOutIcon, FloppyDiskIcon, FolderOpenIcon } from '@phosphor-icons/react';
import { generateLangFile, generateLangPackFileName } from 'api/LangFile';
import Ribbon from "components/Ribbon";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Local from 'Local';
import { useDispatch, useSelector } from 'react-redux';
import { LangActions, type LangDoc } from 'state/langSlice';
import type { RootState } from 'state/store';
import { jsonSortKeysCallback, openFile } from 'utils';

export interface LangRibbonProps {
  
}

function LangRibbon (props: LangRibbonProps) {
  const lang = useSelector((state: RootState) => state.lang);
  const dispatch = useDispatch();

  return (
    <Ribbon>
      <Ribbon.Button
        tooltip="Saves this document, as is, into the browser."
        onClick={handleSaveLocally}
      >
        <ArrowLineDownIcon size={24} weight='thin' />
        <div>Save locally</div>
      </Ribbon.Button>

      <Ribbon.Button
        tooltip="Opens a file."
        onClick={handleOpen}
      >
        <FolderOpenIcon size={24} weight='thin' />
        <div>Open</div>
      </Ribbon.Button>

      <Ribbon.Button
        tooltip="Saves this document as a file to be opened later."
        onClick={handleSave}
      >
        <FloppyDiskIcon size={24} weight='thin' />
        <div>Save</div>
      </Ribbon.Button>

      <Ribbon.Button
        tooltip="Exports this document as a resource pack, containing each lang in its namespace."
        onClick={handleExport}
      >
        <ArrowSquareOutIcon size={24} weight='thin' />
        <div>Export</div>
      </Ribbon.Button>
    </Ribbon>
  );

  function handleSaveLocally () {
    Local.saveLangPackName(lang.packName);
    Local.saveLangRemovalPrefix(lang.removalPrefix);
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

    zip.file(
      "pack.mcmeta",
      JSON.stringify({
        "pack": {
          "pack_format": 15,
          "description": lang.packName
        }
      }, null, 2),
    );

    for (const ns of Object.keys(lang.overrides)) {
      for (const langcode of Object.keys(lang.overrides[ns])) {
        const file = generateLangFile(lang, ns, langcode);
        if (file === null) continue;

        zip.file(
          `assets/${ns}/lang/${langcode}.json`,
          JSON.stringify(file, jsonSortKeysCallback, 2),
        );
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${generateLangPackFileName(lang.packName)}.zip`);
  }
}

export default LangRibbon;
