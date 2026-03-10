import { Button, TextInput } from '@mantine/core';
import { modals, type ContextModalProps } from '@mantine/modals';
import { useState } from 'react';
import styles from './StringPrompt.module.scss';

export interface StringPromptModalProps {
  label: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

function StringPromptModal ({
  innerProps,
  context: ctx,
  id: modalId,
}: ContextModalProps<StringPromptModalProps>) {
  const {
    label,
    placeholder,
    onSubmit,
  } = innerProps;

  const [value, setValue] = useState("");

  return (
    <div className={styles.modal}>
      <TextInput
        value={value}
        onChange={evt => setValue(evt.currentTarget.value)}
        label={label}
        placeholder={placeholder}
      />

      <div className={styles.ribbon}>
        <Button
          size='compact-md'
          disabled={value === ""}
          onClick={handleAccept}
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

  function handleAccept () {
    onSubmit?.(value);
    ctx.closeModal(modalId);
  }
}

export function openStringPrompt (props: StringPromptModalProps) {
  modals.openContextModal({
    modal: 'stringPrompt',
    innerProps: props,
    size: '400px',
    closeOnClickOutside: true,
  });
};

export default StringPromptModal;
