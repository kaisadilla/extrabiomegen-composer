import { Button, Textarea, TextInput } from '@mantine/core';
import { modals, type ContextModalProps } from '@mantine/modals';
import { useState } from 'react';
import styles from './ImportLang.module.scss';

export interface ImportLangModalProps {
  onSubmit?: (name: string, content: string) => void;
}

function ImportLangModal ({
  innerProps,
  context: ctx,
  id: modalId,
}: ContextModalProps<ImportLangModalProps>) {
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
    onSubmit?.(name, content);
    ctx.closeModal(modalId);
  }
}

export function openImportLang (props: ImportLangModalProps) {
  modals.openContextModal({
    modal: 'importLang',
    innerProps: props,
    size: '550px',
    closeOnClickOutside: false,
  })
}

export default ImportLangModal;
