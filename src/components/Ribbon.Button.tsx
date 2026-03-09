import { $cl } from 'utils';
import DescriptiveTooltip from './DescriptiveTooltip';
import styles from './Ribbon.module.scss';

export interface Ribbon_ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>
{
  tooltip?: string;
  onClick?: () => void;
}

function Ribbon_Button ({
  tooltip,
  className,
  children,
  onClick,
  ...buttonProps
}: Ribbon_ButtonProps) {
  if (tooltip) return (
    <DescriptiveTooltip
      description={tooltip}
    >
      <Ribbon_Button
        className={className}
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </Ribbon_Button>
    </DescriptiveTooltip>
  );

  return (
    <button
      {...buttonProps}
      className={$cl(styles.button, className)}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
}

export default Ribbon_Button;
