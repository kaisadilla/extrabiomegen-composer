import type { HSLColor } from 'react-color';
import styles from './ColorPicker.module.scss';

import { Button, TextInput } from '@mantine/core';
import { useState } from "react";
import { Hue, Saturation } from "react-color/lib/components/common";
// @ts-ignore
import SliderSwatches from "react-color/lib/components/slider/SliderSwatches";
import tinycolor from "tinycolor2";
import type { DivProps } from 'types';
import { $cl } from 'utils';

interface HSVColor {
  h: number;
  s: number;
  v: number;
  a: number;
  source: string;
}

export type ColorPickerMode = 'sketch' | 'photoshop';

export interface ColorPickerProps extends Omit<DivProps, 'onSelect'> {
  mode: ColorPickerMode;
  defaultColor: string;
  suggestions?: string[];
  suggestionsTitle?: string;
  onSelect?: (selectedColor: string) => void;
  onCancel?: (selectedColor: string) => void;
}

function ColorPicker ({
  mode,
  defaultColor,
  suggestions,
  suggestionsTitle,
  onSelect,
  onCancel,
  className,
  ...divProps
}: ColorPickerProps) {
  suggestions = suggestions
    ?.map(s => s.startsWith("#") ? s.substring(1, 7): s)
    .filter(s => s.length === 6);

  const colorObj = tinycolor(defaultColor);
  const [hex, setHex] = useState(colorObj.toHex());
  const [rgb, setRgb] = useState(colorObj.toRgb());
  const [hsl, setHsl] = useState(colorObj.toHsl());
  const [hsv, setHsv] = useState(colorObj.toHsv());

  const [tempHex, setTempHex] = useState(hex);

  const CustomPointer = () => <div className={styles.pointer} />
  const CustomSlider = () => <div className={styles.slider} />

  return (
    <div
      className={$cl(styles.colorPicker, className)}
      {...divProps}
    >
      <div className={styles.colorControls}>
        <div className={styles.colorGadgets}>
          <div className={styles.saturationContainer}>
            {/*@ts-ignore*/}
            <Saturation
              //@ts-ignore
              hsl={hsl}
              hsv={hsv}
              pointer={CustomPointer}
              //@ts-ignore
              onChange={handleSaturationChange}
            />
          </div>

          <div className={styles.hueContainer}>
            {/*@ts-ignore*/}
            <Hue
              //@ts-ignore
              hsl={hsl}
              pointer={CustomSlider}
              direction='vertical'
              //@ts-ignore
              onChange={handleHueChange}
            />
          </div>

          <div className={styles.swatchesContainer}>
            <SliderSwatches
              hsl={hsl}
              onClick={handleSwatchesClick}
            />
          </div>
        </div>

        <div className={styles.manualInputContainer}>
          <div
            className={styles.colorComparison}
            style={{
              '--color-sample-old': defaultColor,
              '--color-sample-new': "#" + hex,
            } as any}
          >
            <div className={styles.old} />
            <div className={styles.new} />
          </div>

          <div className={styles.colorParams}>
            <div className={styles.title}>Color</div>
            
            <div className={styles.hexControl}>
              <div>Hex</div>
              <TextInput
                classNames={{ input: styles.input }}
                value={tempHex}
                pattern={"^[0-9a-fA-F]{0,6}$"}
                onChange={evt => handleHexInput(evt.currentTarget.value)}
              />
            </div>

            TODO
          </div>
        </div>
      </div>

      <div className={styles.colorPickerToolbox}>
        <Button
          onClick={handleCancel}
          size='compact-sm'
          variant='light'
        >
          Cancel
        </Button>
        <Button
          onClick={handleSelect}
          size='compact-sm'
        >
          Select
        </Button>
      </div>
    </div>
  );

  function handleSelect () {
      onSelect?.("#" + hex);
  }

  function handleCancel () {
      onCancel?.("#" + hex);
  }

  function handleHueChange (hue: HSLColor) {
    const colorObj = tinycolor(hue);

    setHsl(hue as tinycolor.ColorFormats.HSLA);
    //setHsv(colorObj.toHsv());
    setRgb(colorObj.toRgb());
    setHexAndTempHex(colorObj.toHex());
  }

  function handleSaturationChange (res:HSVColor) {
    const colorObj = tinycolor(res);
    setHsv(res);
    setRgb(colorObj.toRgb());
    setHexAndTempHex(colorObj.toHex());

    // prevent saturation from changing the hue.
    const newHsl = colorObj.toHsl();
    newHsl.h = hsl.h;
    setHsl(newHsl);
  }

  function handleSwatchesClick (hue: HSLColor) {
    const colorObj = tinycolor(hue);
    setHsl(colorObj.toHsl());
    setHsv(colorObj.toHsv());
    setRgb(colorObj.toRgb());
    setHexAndTempHex(colorObj.toHex());
  }

  function handleHexInput (str: string) {
    setTempHex(str);
    if (str.length === 6) {
      const colorObj = tinycolor(str);
      setHsl(colorObj.toHsl());
      setHsv(colorObj.toHsv());
      setRgb(colorObj.toRgb());
      setHexAndTempHex(colorObj.toHex());
    }
  }

  function setHexAndTempHex (hex: string) {
    setHex(hex);
    setTempHex(hex);
  }
}

export default ColorPicker;
