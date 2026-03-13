import { NumberInput, Tooltip } from '@mantine/core';
import { FolderOpenIcon } from '@phosphor-icons/react';
import { UNKNOWN_BIOME } from 'api/Biome';
import Button from 'components/Button';
import ResizableSeparator from 'components/ResizableSeparator';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Group, Panel } from "react-resizable-panels";
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import { openFile, rgbToHex } from 'utils';
import Analysis from './Analysis';
import styles from './page.module.scss';

export interface MapViewerPageProps {
  
}

type Filter = { type: 'biome', id: string } | { type: 'group', id: number };

function MapViewerPage (props: MapViewerPageProps) {
  const catalogue = useBiomeCatalogue();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const infoCanvasRef = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imgWidth, setImgWidth] = useState(2500);
  const [imgHeight, setImgHeight] = useState(2500);

  const [filename, setFilename] = useState("(no file loaded)");
  const [xCenter, setXCenter] = useState(0);
  const [zCenter, setZCenter] = useState(0);
  const [scale, setScale] = useState(4);

  const [xHover, setXHover] = useState(0);
  const [zHover, setZHover] = useState(0);

  const [biome, setBiome] = useState("");
  const [filter, setFilter] = useState<Filter | null>(null);

  useEffect(() => {
    renderFilteredCanvas();
  }, [filter]);

  const handlePickBiome = useCallback((id: string) => {
    setFilter(prev => {
      if (!prev) return { type: 'biome', id, };

      if (prev.type !== 'biome' || prev.id !== id) return { type: 'biome', id, };

      return null;
    });
  }, [setFilter]);

  const handlePickGroup = useCallback((id: number) => {
    setFilter(prev => {
      if (!prev) return { type: 'group', id, };

      if (prev.type !== 'group' || prev.id !== id) return { type: 'group', id, };

      return null;
    });
  }, [setFilter]);

  return (
    <div className={styles.page}>
      <div className={styles.ribbon}>
        <Button
          onClick={handleOpen}
        >
          <FolderOpenIcon size={24} />
          <div>Open file</div>
        </Button>
        <NumberInput
          label="Center X"
          size='xs'
          value={xCenter}
          onChange={evt => setXCenter(Number(evt))}
        />
        <NumberInput
          label="Center Z"
          size='xs'
          value={zCenter}
          onChange={evt => setZCenter(Number(evt))}
        />
        <NumberInput
          label="Scale"
          size='xs'
          value={scale}
          onChange={evt => setScale(Number(evt))}
        />
        <div className={styles.fileName}>
          {filename}
        </div>
      </div>

      <Group
        className={styles.content}
        orientation='horizontal'
        id='map-viewer-panel'
      >
        <Panel
          className={styles.canvasPanel}
          defaultSize={3}
        >
          <div className={styles.canvasContainer}>
            <canvas
              ref={infoCanvasRef}
              style={{ display: 'none', }}
            />

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
                width={0}
                height={0}
              />
            </Tooltip.Floating>

          </div>
        </Panel>

        <ResizableSeparator />

        <Panel
          className={styles.dataPanel}
          defaultSize={1}
        >
          <Analysis
            infoCanvasRef={infoCanvasRef}
            imgWidth={imgWidth}
            imgHeight={imgHeight}
            onPickBiome={handlePickBiome}
            onPickGroup={handlePickGroup}
          />
        </Panel>
      </Group>

    </div>
  );

  async function handleOpen () {
    const f = await openFile("image/*");
    if (!f) return;
    
    const url = URL.createObjectURL(f);

    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);

      setImage(img);
      setImgWidth(img.naturalWidth);
      setImgHeight(img.naturalHeight);

      if (canvasRef.current) {
        setCanvasToImage(canvasRef.current, img);
      }
      if (infoCanvasRef.current) {
        setCanvasToImage(infoCanvasRef.current, img);
      }
    }
    img.onerror = console.log;
    img.src = url;
    
    readFileParams(f.name);
  }

  function handleMouseMove (evt: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const info = infoCanvasRef.current;
    if (!canvas || !info) return;

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
    if (params.length < 6) return;

    const x = Number(params[2]);
    const z = Number(params[4]);
    const scale = Number(params[5]);

    setFilename(filename);
    if (Number.isFinite(x)) setXCenter(x);
    if (Number.isFinite(z)) setZCenter(z);
    if (Number.isFinite(scale)) setScale(scale);
  }

  function setCanvasToImage (canvas: HTMLCanvasElement, img: HTMLImageElement) {
      const ctx = canvas.getContext("2d");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx?.drawImage(img, 0, 0);
  }

  function renderFilteredCanvas () {
    const canvas = canvasRef.current;
    const info = infoCanvasRef.current;
    if (!canvas || !info) return;

    const canvasCtx = canvas.getContext('2d');
    const infoCtx = info.getContext('2d');
    if (!canvasCtx || !infoCtx) return;

    if (filter === null) {
      canvasCtx?.drawImage(info, 0, 0);
      return;
    }

    // The biomes contained by this filter.
    const biomes = filter.type === 'biome'
      ? [filter.id]
      : catalogue.groups[filter.id].biomes;

    // The colors of the biomes contained by this filter
    const colors: { r: number, g: number, b: number}[] = [];
    
    for (const id of biomes) {
      const biome = catalogue.biomes[id] ?? UNKNOWN_BIOME;

      const r = parseInt(biome.color.slice(1, 3), 16);
      const g = parseInt(biome.color.slice(3, 5), 16);
      const b = parseInt(biome.color.slice(5, 7), 16);

      colors.push({ r, g, b, });
    }

    const src = infoCtx.getImageData(0, 0, imgWidth, imgHeight);
    const dst = canvasCtx.createImageData(imgWidth, imgHeight);

    const s = src.data;
    const d = dst.data;

    for (let i = 0; i < s.length; i += 4) {
      const sr = s[i];
      const sg = s[i + 1];
      const sb = s[i + 2];

      d[i] = 255;
      d[i + 1] = 255;
      d[i + 2] = 255;
      d[i + 3] = 255;

      for (const color of colors) {
        if (sr === color.r && sg === color.g && sb === color.b) {
          d[i] = color.r;
          d[i + 1] = color.g;
          d[i + 2] = color.b;
          d[i + 3] = 255;
          
          break;
        }
      }
    }

    canvasCtx.putImageData(dst, 0, 0);
  }
}

export default MapViewerPage;
