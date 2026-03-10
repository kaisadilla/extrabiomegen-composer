import { $cl } from 'utils';
import styles from './Button.module.scss';
import DescriptiveTooltip from './DescriptiveTooltip';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>
{
  variant?: 'danger';
  label?: string;
  tooltip?: string;
  onClick?: () => void;
}

function Button ({
  variant,
  label,
  tooltip,
  className,
  children,
  onClick,
  ...buttonProps
}: ButtonProps) {
  if (tooltip) return (
    <DescriptiveTooltip
      label={label}
      description={tooltip}
    >
      <Button
        className={className}
        variant={variant}
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </Button>
    </DescriptiveTooltip>
  );

  return (
    <button
      {...buttonProps}
      className={$cl(styles.button, className)}
      data-variant={variant}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
}

export default Button;
