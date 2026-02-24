import { Button, Text, Textarea } from '@mantine/core';
import { modals, type ContextModalProps } from '@mantine/modals';
import type React from 'react';
import { useState } from 'react';
import styles from './ImportContent.module.scss';

export interface ImportContentModalProps {
  instructions?: React.ReactNode;
  onSubmit?: (text: string) => void;
}

function ImportContentModal ({
  innerProps,
  context: ctx,
  id: modalId
}: ContextModalProps<ImportContentModalProps>) {
  const {
    instructions,
    onSubmit,
  } = innerProps;

  const [text, setText] = useState("");

  return (
    <div className={styles.modal}>
      <div className={styles.instructions}>
        <Text size='sm'>{instructions}</Text>
      </div>
      <div className={styles.textAreaContainer}>
        <Textarea
          classNames={{
            input: styles.textAreaInput
          }}
          placeholder="List of biome ids."
          value={text}
          onChange={evt => setText(evt.currentTarget.value)}
          rows={20}
        />
      </div>
      <div className={styles.ribbon}>
        <Button
          size='compact-md'
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
    onSubmit?.(text);
    ctx.closeModal(modalId);
  }
}

export function openImportContent (props: ImportContentModalProps) {
  modals.openContextModal({
    modal: 'importContent',
    innerProps: props,
    size: '550px',
    closeOnClickOutside: false,
  });
}

export default ImportContentModal;
