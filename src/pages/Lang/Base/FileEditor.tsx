import { notifications } from '@mantine/notifications';
import { Editor } from '@monaco-editor/react';
import { ArrowLineDownIcon } from '@phosphor-icons/react';
import { LangFileSchema } from 'api/LangFile';
import Ribbon from 'components/Ribbon';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LangActions } from 'state/langSlice';
import type { RootState } from 'state/store';
import z from 'zod';
import styles from './FileEditor.module.scss';

export interface FileEditorProps {
  ns: string;
}

function FileEditor ({
  ns,
}: FileEditorProps) {
  const lang = useSelector((state: RootState) => state.lang);
  const dispatch = useDispatch();

  const [txt, setTxt] = useState(JSON.stringify(lang.files[ns], null, 2));

  useEffect(() => {
    setTxt(JSON.stringify(lang.files[ns], null, 2));
  }, [ns]);

  return (
    <div className={styles.editor}>
      <div className={styles.monaco}>
        <Editor
          defaultLanguage='json'
          value={txt}
          onChange={txt => txt ? setTxt(txt) : {} }
          theme='vs-light'
          options={{
            fontSize: 13,
            minimap: {
              enabled: true
            }
          }}
        />
      </div>
      <Ribbon
        position='bottom'
      >
        <Ribbon.Button
          tooltip="Commit the changes made to this file."
          onClick={handleCommit}
        >
          <ArrowLineDownIcon size={24} weight='thin' />
          <div>Commit</div>
        </Ribbon.Button>
      </Ribbon>
    </div>
  );

  function handleCommit () {
    try {
      const file = LangFileSchema.parse(JSON.parse(txt));

      dispatch(LangActions.updateLangFile({
        namespace: ns,
        file: file,
      }));

      notifications.show({
        title: "Success",
        message: "Changes commited to memory."
      });
    }
    catch (err) {
      console.error(err);

      let msg: string;

      if (err instanceof z.ZodError) {
        msg = "Invalid Lang file. Lang files must only contain key-value " +
         "pairs, where both are strings. Nothing has been commited.";
      }
      else if (err instanceof SyntaxError) {
        msg = "Invalid JSON file. Nothing has been commited.";
      }
      else {
        msg = `Unknown error. Nothing has been commited. Debug info: ${err}`;
      }

      notifications.show({
        color: 'red',
        title: 'Error',
        message: msg,
      });
    }
  }
}

export default FileEditor;
