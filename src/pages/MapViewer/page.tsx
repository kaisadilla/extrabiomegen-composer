import { NumberInput, Tooltip } from '@mantine/core';
import { UNKNOWN_BIOME } from 'api/Biome';
import { useRef, useState } from 'react';
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import { rgbToHex } from 'utils';
import styles from './page.module.scss';

export interface MapViewerPageProps {
  
}

function MapViewerPage (props: MapViewerPageProps) {
  const catalogue = useBiomeCatalogue();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imgWidth, setImgWidth] = useState(2500);
  const [imgHeight, setImgHeight] = useState(2500);

  const [xCenter, setXCenter] = useState(0);
  const [zCenter, setZCenter] = useState(0);
  const [scale, setScale] = useState(4);

  const [xHover, setXHover] = useState(0);
  const [zHover, setZHover] = useState(0);

  const [biome, setBiome] = useState("");

  return (
    <div className={styles.page}>
      <input
        type="file"
        accept="image/*"
        onChange={handleOpen}
      />

      <div className={styles.params}>
        <NumberInput
          label="x"
          size='xs'
          value={xCenter}
          onChange={evt => setXCenter(Number(evt))}
        />
        <NumberInput
          label="z"
          size='xs'
          value={zCenter}
          onChange={evt => setZCenter(Number(evt))}
        />
        <NumberInput
          label="scale"
          size='xs'
          value={scale}
          onChange={evt => setScale(Number(evt))}
        />
      </div>

      <div className={styles.canvasContainer}>
        <Tooltip.Floating
          label={(
            <div className={styles.mapLabel}>
              <div className={styles.pos}>
                ({xHover}, {zHover})
              </div>
              <div className={styles.biome}>
                {biome}
              </div>
            </div>
          )}
        >
          <canvas
            ref={canvasRef}
            onClick={handleClickCanvas}
            onMouseMove={handleMouseMove}
          />
        </Tooltip.Floating>
      </div>
    </div>
  );

  async function handleOpen (evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    console.log(url);

    const img = new Image();
    img.onload = () => {
      console.log("image loaded!");
      URL.revokeObjectURL(url);

      setImage(img);
      setImgWidth(img.naturalWidth);
      setImgHeight(img.naturalHeight);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx?.drawImage(img, 0, 0);
    }
    img.onerror = console.log;
    img.src = url;
    
    readFileParams(file.name);
  }

  function handleMouseMove (evt: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const x = Math.floor(evt.clientX - rect.left);
    const y = Math.floor(evt.clientY - rect.top);
    
    const xOffset = x - (imgWidth / 2);
    const zOffset = y - (imgHeight / 2);

    setXHover(xOffset * scale);
    setZHover(zOffset * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pix = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b, a] = pix;

    const hex = rgbToHex(r, g, b);

    const biome = Object.values(catalogue.biomes).find(
      b => b.color.toLowerCase() === hex.toLowerCase()
    ) ?? UNKNOWN_BIOME;
    setBiome(biome.name);
  }

  function handleClickCanvas () {
    navigator.clipboard.writeText(`/tp ${xHover} ~ ${zHover}`);
  }

  function readFileParams (filename: string) {
    const params = filename.split(".");
    if (params.length !== 7) return;

    const x = Number(params[2]);
    const z = Number(params[4]);
    const scale = Number(params[5]);

    if (Number.isFinite(x)) setXCenter(x);
    if (Number.isFinite(z)) setZCenter(z);
    if (Number.isFinite(scale)) setScale(scale);
  }
}

export default MapViewerPage;
