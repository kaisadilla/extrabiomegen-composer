import Button from "./Button";
import styles from "./Ribbon.module.scss";

export interface RibbonProps {
  position?: 'top' | 'bottom';
  children?: React.ReactNode;
}

function Ribbon ({
  position = 'top',
  children,
}: RibbonProps) {
  return (
    <div
      className={styles.ribbon}
      data-position={position}
    >
      {children}
    </div>
  );
}

Ribbon.Button = Button;

export default Ribbon;
