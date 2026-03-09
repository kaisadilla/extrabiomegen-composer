import { Button, Textarea, TextInput } from '@mantine/core';
import { modals, type ContextModalProps } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { LangFileSchema, type LangFile } from 'api/LangFile';
import { useState } from 'react';
import styles from './ImportLangFile.module.scss';

export interface ImportLangFileModalProps {
  onSubmit?: (name: string, content: LangFile) => void;
}

function ImportLangFileModal ({
  innerProps,
  context: ctx,
  id: modalId,
}: ContextModalProps<ImportLangFileModalProps>) {
  const {
    onSubmit,
  } = innerProps;

  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className={styles.modal}>
      <TextInput
        value={name}
        onChange={evt => setName(evt.currentTarget.value)}
        label="Namespace"
        placeholder="e.g. regions_unexplored"
      />
      
      <Textarea
        value={content}
        onChange={evt => setContent(evt.currentTarget.value)}
        label="Content"
        placeholder='e.g. { "block.minecraft.bricks": "Bricks", ... }'
        minRows={4}
        rows={4}
        maxRows={16}
      />

      <div className={styles.ribbon}>
        <Button
          size='compact-md'
          disabled={name === "" || content === ""}
          onClick={handleAdd}
        >
          Add
        </Button>

        <Button
          size='compact-md'
          variant='light'
          onClick={() => ctx.closeModal(modalId)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  function handleAdd () {
    try {
      const file = LangFileSchema.parse(JSON.parse(content));
      onSubmit?.(name, file);

      ctx.closeModal(modalId);
    }
    catch (err) {
      console.error(err);

      notifications.show({
        color: 'red',
        title: 'Error',
        message: "Failed to parse lang file. Nothing was added.",
      });
    }
  }
}

export function openImportLangFile (props: ImportLangFileModalProps) {
  modals.openContextModal({
    modal: 'importLangFile',
    innerProps: props,
    size: '700px',
    closeOnClickOutside: false,
  });
}

export default ImportLangFileModal;
