import { useState } from 'react';
import { PhotoshopPicker } from 'react-color';
import ColorPicker from './ColorPicker';
import styles from './ColorPickerModal.module.scss';

export interface ColorPickerModalProps {
  value: string;
  onAccept?: (color: string) => void;
  onCancel?: () => void;
}

function ColorPickerModal ({
  value,
  onAccept,
  onCancel
}: ColorPickerModalProps) {
  const [color, setColor] = useState(value);

  return (
    <div className={styles.overlay}>
      {false && <PhotoshopPicker
        className={styles.colorPicker}
        color={color}
        onChange={c => setColor(c.hex)}
        onCancel={onCancel}
        onAccept={() => onAccept?.(color)}
      />}
      <ColorPicker
        className={styles.colorPicker}
        mode='photoshop'
        defaultColor={color}
        onCancel={onCancel}
        onSelect={onAccept}
      />
    </div>
  );
}

export default ColorPickerModal;
