import { Select, Table, Tabs } from '@mantine/core';
import { AgGridReact } from 'ag-grid-react';
import { getBiomeStyle, UNKNOWN_BIOME, type Biome, type BiomeGroup } from 'api/Biome';
import Button from 'components/Button';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'state/store';
import styles from './Analysis.module.scss';

export interface AnalysisProps {
  infoCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  imgWidth: number;
  imgHeight: number;
  onPickBiome?: (id: string) => void;
  onPickGroup?: (id: number) => void;
}

const Analysis = memo(function Analysis ({
  infoCanvasRef,
  imgWidth,
  imgHeight,
  onPickBiome,
  onPickGroup,
}: AnalysisProps) {
  const landSrc = useSelector(
    (state: RootState) => state.biomeSource.doc.biome_source.land
  );
  const catalogue = useSelector((state: RootState) => state.biomeCatalogue);

  const [tab, setTab] = useState<string | null>('biomes');
  const [biomeCounts, setBiomeCounts]
    = useState<Record<string, number> | null>(null);
  const [groupCounts, setGroupCounts]
    = useState<number[] | null>(null);

  const groups = [...catalogue.groups];

  //const pseudoGroups: Record<string, BiomeGroup> = {};
//
  //for (const tKey of TemperatureKeys) {
  //  pseudoGroups[tKey] = {
  //    name: "Temperature: " + tKey,
  //    color: "black",
  //    biomes: [],
  //  };
  //}
//
  //for (const c of Object.values(landSrc)) {
  //  for (const e of Object.values(c)) {
  //    for (const tKey of Object.keys(e) as TemperatureKey[]) {
  //      const t = e[tKey];
  //      
  //      for (const h of Object.values(t)) {
  //        for (const w of Object.values(h)) {
  //          for (const biomeId of w) {
  //            const arr = pseudoGroups[tKey].biomes;
//
  //            if (arr.includes(biomeId) === false) arr.push(biomeId);
  //          }
  //        }
  //      }
  //    }
  //  }
  //}
//
  //groups.push(...Object.values(pseudoGroups));

  return (
    <div className={styles.analysis}>
      <div className={styles.dataRibbon}>
        <Button
          tooltip="Analyze the biomes present in this map."
          onClick={handleAnalyze}
        >
          Analyze
        </Button>
      </div>
      <div className={styles.content}>
        <Tabs
          classNames={{
            root: styles.tabsRoot,
            panel: styles.tabsPanel,
          }}
          value={tab}
          onChange={setTab}
        >
          <Tabs.List>
            <Tabs.Tab value="biomes">Biomes</Tabs.Tab>
            <Tabs.Tab value="groups">Groups</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="biomes">
            {biomeCounts && <_BiomeTab
              groups={groups}
              biomeCounts={biomeCounts}
              imgHeight={imgHeight}
              imgWidth={imgWidth}
              onPickBiome={onPickBiome}
            />}
          </Tabs.Panel>

          <Tabs.Panel value="groups">
            {biomeCounts && groupCounts && <_GroupTable
              biomes={biomeCounts}
              groups={groupCounts}
              imgHeight={imgHeight}
              imgWidth={imgWidth}
              onPickGroup={onPickGroup}
            />}
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );

  function handleAnalyze () {
    const ctx = infoCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, imgWidth, imgHeight).data;
    const biomeMap = new Map<number, number>();

    for (let i = 0; i < data.length; i+= 4) {
      const color = (data[i] << 16) | (data[i + 1] << 8) | (data[i + 2]);

      const val = biomeMap.get(color) || 0;
      biomeMap.set(color, val + 1);
    }

    const biomeCounts = Array.from(biomeMap.entries())
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

    const groupCounts: number[] = [];

    for (const entry of biomeMap.entries()) {
      const hex = `#${entry[0].toString(16).padStart(6, '0')}`;

      const biome = Object.values(catalogue.biomes).find(
        b => b.color.toLowerCase() === hex.toLowerCase()
      );
      if (!biome) continue;

      for (let g = 0; g < catalogue.groups.length; g++) {
        if (catalogue.groups[g].biomes.includes(biome.id) === false) {
          continue;
        }

        if (groupCounts[g] === undefined) groupCounts[g] = entry[1];
        else groupCounts[g] += entry[1];
      }
    }

    const biomeObj: Record<string, number> = {};

    for (const c of biomeCounts) {
      biomeObj[c.id] = c.count;
    }

    setBiomeCounts(biomeObj);
    setGroupCounts(groupCounts);
  }
});

interface _BiomeTabProps {
  groups: BiomeGroup[];
  biomeCounts: Record<string, number>;
  imgWidth: number;
  imgHeight: number;
  onPickBiome?: (id: string) => void;
}

function _BiomeTab ({
  groups,
  biomeCounts,
  imgWidth,
  imgHeight,
  onPickBiome,
}: _BiomeTabProps) {
  const catalogue = useSelector((state: RootState) => state.biomeCatalogue);

  const [groupFilter, setGroupFilter] = useState(-1);
  
  const missingBiomes: Biome[] = [];

  for (const biome of Object.values(catalogue.biomes)) {
    if (biome.wanted && !biomeCounts[biome.id]) {
      missingBiomes.push(biome);
    }
  }

  const unwantedBiomes: Biome[] = [];
  for (const id of Object.keys(biomeCounts)) {
    const biome = catalogue.biomes[id];
    if (biome?.wanted === false) {
      unwantedBiomes.push(biome);
    }
  }

  const filteredBiomeCounts = groupFilter === -1
    ? biomeCounts
    : Object.fromEntries(
      Object
        .entries(biomeCounts)
        .filter(([k]) => catalogue.groups[groupFilter].biomes.includes(k))
    );

  return (
    <div className={styles.biomeTab}>
      <Select
        label="Filter by group"
        value={groupFilter.toString()}
        onChange={v => v ? setGroupFilter(parseInt(v)) : {}}
        data={[
          { value: "-1", label: "All" },
          ...groups.map((g, i) => ({ value: i.toString(), label: g.name })),
        ]}
      />

      <_BiomeTable
        biomes={filteredBiomeCounts}
        imgHeight={imgHeight}
        imgWidth={imgWidth}
        onPickBiome={onPickBiome}
      />

      <h1>Missing biomes</h1>
      <Table>
        <Table.Tbody>
          {missingBiomes.map(b => (
            <Table.Tr key={b.id}>
              <Table.Td>{b.name}</Table.Td>
              <Table.Td>{b.id}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <h1>Unwanted biomes</h1>
      <Table>
        <Table.Tbody>
          {unwantedBiomes.map(b => (
            <Table.Tr key={b.id}>
              <Table.Td>{b.name}</Table.Td>
              <Table.Td>{b.id}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}


interface _BiomeTableProps {
  biomes: Record<string, number>;
  imgWidth: number;
  imgHeight: number;
  onPickBiome?: (id: string) => void;
}

function _BiomeTable ({
  biomes,
  imgWidth,
  imgHeight,
  onPickBiome,
}: _BiomeTableProps) {
  const catalogue = useSelector((state: RootState) => state.biomeCatalogue);

  return (
    <AgGridReact
      className={styles.biomeTable}

      rowData={Object.keys(biomes).map(b => {
        const biome = catalogue.biomes[b] ?? UNKNOWN_BIOME;

        return {
          id: b,
          name: biome.name,
          count: biomes[b],
          perc: (biomes[b] / (imgWidth * imgHeight)) * 100,
          filter: (
            <Button onClick={() => onPickBiome?.(b)}>
              Filter
            </Button>
          ),
        };
      })}

      columnDefs={[
        {
          field: "name",
          headerName: "Biome",
          cellClass: styles.biomeCell,
          width: 150,
        },
        {
          field: "count",
          headerName: "Count",
          valueFormatter: p => `${p.value.toLocaleString('en-US')} ` +
            `(${p.data?.perc.toFixed(2)}%)`,
          width: 140,
        },
        {
          field: "filter",
          headerName: "",
          cellRenderer: (p: any) => p.value,
          width: 80,
        },
        {
          field: "id",
          headerName: "Id",
          cellClass: styles.idCell,
        },
      ]}

      getRowStyle={
        p => getBiomeStyle(catalogue.biomes[p.data?.id ?? ""] ?? UNKNOWN_BIOME) as any
      }
      getRowClass={p => styles.tableRow}

      rowHeight={24}
      pagination={true}
      paginationPageSize={25}
      paginationPageSizeSelector={[15, 25, 27, 50, 100, 500]}
    />
  );
}

interface _GroupTableProps {
  biomes: Record<string, number>;
  groups: number[];
  imgWidth: number;
  imgHeight: number;
  onPickGroup?: (id: number) => void;
}

function _GroupTable ({
  biomes,
  groups,
  imgWidth,
  imgHeight,
  onPickGroup,
}: _GroupTableProps) {
  const catalogue = useSelector((state: RootState) => state.biomeCatalogue);

  return (
    <AgGridReact
      className={styles.biomeTable}

      rowData={groups.map((count, id) => {
        return {
          id: id,
          name: catalogue.groups[id].name,
          count: count,
          perc: (count / (imgWidth * imgHeight)) * 100,
          filter: (
            <Button onClick={() => onPickGroup?.(id)}>
              Filter
            </Button>
          ),
        };
      })}

      columnDefs={[
        {
          field: "id",
          headerName: "Id",
          cellClass: styles.idCell,
          width: 50,
        },
        {
          field: "name",
          headerName: "Group",
          cellClass: styles.biomeCell,
          width: 150,
        },
        {
          field: "count",
          headerName: "Count",
          valueFormatter: p => `${p.value.toLocaleString('en-US')} ` +
            `(${p.data?.perc.toFixed(2)}%)`,
          width: 180,
        },
        {
          field: "filter",
          headerName: "",
          cellRenderer: (p: any) => p.value,
          width: 80,
        }
      ]}

      getRowStyle={
        p => getBiomeStyle(catalogue.biomes[p.data?.id ?? ""] ?? UNKNOWN_BIOME) as any
      }
      getRowClass={p => styles.tableRow}

      rowHeight={24}
      pagination={true}
      paginationPageSize={25}
      paginationPageSizeSelector={[15, 25, 27, 50, 100, 500]}
    />
  );
}


export default Analysis;
