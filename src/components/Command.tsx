import { Button, CopyButton } from '@mantine/core';
import styles from './Command.module.scss';

export interface CommandProps {
  command: string;
}

function Command ({
  command,
}: CommandProps) {

  return (
    <div className={styles.command}>
      <div className={styles.string}>
        {command}
      </div>
      
      <CopyButton value={command}>
        {({ copied, copy }) => (
          <Button 
            classNames={{ root: styles.buttonRoot }}
            onClick={copy}
            size='compact-sm'
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        )}
      </CopyButton>
    </div>
  );
}

export default Command;
