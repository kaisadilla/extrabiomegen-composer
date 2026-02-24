import { Button, NumberInput, Table, Tooltip } from '@mantine/core';
import { UNKNOWN_BIOME } from 'api/Biome';
import { useRef, useState } from 'react';
import { Group, Panel, Separator } from "react-resizable-panels";
import useBiomeCatalogue from 'state/biomeCatalogueSlice';
import { openFile, rgbToHex } from 'utils';
import styles from './page.module.scss';

export interface MapViewerPageProps {
  
}

function MapViewerPage (props: MapViewerPageProps) {
  const catalogue = useBiomeCatalogue();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const infoCanvasRef = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imgWidth, setImgWidth] = useState(2500);
  const [imgHeight, setImgHeight] = useState(2500);

  const [filename, setFilename] = useState("");
  const [xCenter, setXCenter] = useState(0);
  const [zCenter, setZCenter] = useState(0);
  const [scale, setScale] = useState(4);

  const [xHover, setXHover] = useState(0);
  const [zHover, setZHover] = useState(0);

  const [biome, setBiome] = useState("");

  const [aBiomeCount, setABiomeCount]
    = useState<Record<string, number> | null>(null);

  return (
    <div className={styles.page}>
      {false && <input
        type="file"
        accept="image/*"
        onChange={handleOpen}
      />}

      <div className={styles.ribbon}>
        <Button
          onClick={handleOpen}
        >
          Open file
        </Button>
        <div>Current file: {filename}</div>
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
      </div>

      <Group
        className={styles.content}
        orientation='horizontal'
        id='map-viewer-panel'
      >
        <Panel
          className={styles.canvasPanel}
          defaultSize={4}
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
              />
            </Tooltip.Floating>

          </div>
        </Panel>

        <Separator><div className={styles.separator} /></Separator>

        <Panel
          className={styles.dataPanel}
          defaultSize={1}
        >
          <div className={styles.dataRibbon}>
            <Button
              onClick={handleAnalyze}
            >
              Analyze
            </Button>
          </div>
          <div className={styles.content}>
            {aBiomeCount && <div className={styles.biomeCount}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Td>Biome</Table.Td>
                    <td>Count</td>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Object.keys(aBiomeCount).map(b => (
                    <Table.Tr key={b} className={styles.entry}>
                      <Table.Td>
                        {b}
                      </Table.Td>
                      <Table.Td>
                        {aBiomeCount[b].toLocaleString('en-US')}&nbsp;
                        ({((aBiomeCount[b] / (imgWidth * imgHeight)) * 100).toFixed(2)} %)
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <h4>Missing biomes:</h4>
              <Table>
                <Table.Tbody>
                  {Object.values(catalogue.biomes).map(b => {
                    if (b.wanted === false) return null;
                    if (Object.keys(aBiomeCount).includes(b.id)) return null;

                    return (
                      <Table.Tr key={b.id}>
                        <Table.Td>
                          {b.id}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </div>}
          </div>
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

  function handleAnalyze () {
    const ctx = infoCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, imgWidth, imgHeight).data;
    const counts = new Map<number, number>();

    for (let i = 0; i < data.length; i+= 4) {
      const color = (data[i] << 16) | (data[i + 1] << 8) | (data[i + 2]);

      const val = counts.get(color) || 0;
      counts.set(color, val + 1);
    }

    const biomeCounts = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([col, count]) => {
        const hex = `#${col.toString(16).padStart(6, '0')}`;

        const biome = Object.values(catalogue.biomes).find(
          b => b.color.toLowerCase() === hex.toLowerCase()
        ) ?? UNKNOWN_BIOME;

        return {
          id: biome.id,
          count,
        }
      });

    const biomeObj: Record<string, number> = {};

    for (const c of biomeCounts) {
      biomeObj[c.id] = c.count;
    }

    setABiomeCount(biomeObj);
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
}

export default MapViewerPage;
