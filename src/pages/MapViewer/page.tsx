import { Tooltip } from '@mantine/core';
import { useRef, useState } from 'react';
import useDoc from 'state/useDoc';
import { rgbToHex } from 'utils';
import styles from './page.module.scss';

export interface MapViewerPageProps {
  
}

function MapViewerPage (props: MapViewerPageProps) {
  const doc = useDoc();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const [biome, setBiome] = useState("");

  return (
    <div className={styles.page}>
      <input
        type="file"
        accept="image/*"
        onChange={handleOpen}
      />

      <Tooltip.Floating
        label={biome}
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          style={{ border: "1px solid black", }}
        />
      </Tooltip.Floating>
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

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx?.drawImage(img, 0, 0);
    }
    img.onerror = console.log;
    img.src = url;
  }

  function handleMouseMove (evt: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const x = Math.floor(evt.clientX - rect.left);
    const y = Math.floor(evt.clientY - rect.top);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pix = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b, a] = pix;

    const hex = rgbToHex(r, g, b);

    const biome = Object.values(doc.biomes).find(
      b => b.color.toLowerCase() === hex.toLowerCase()
    );
    setBiome(biome?.name ?? "<unknown>");
  }
}

export default MapViewerPage;
