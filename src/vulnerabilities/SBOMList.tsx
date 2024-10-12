import {
  Link as HeadlampLink,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { useState } from 'react';
import { RoutingPath } from '../index';
import { sbomreportClass } from '../model';
import { SbomReport } from '../types/SbomReport';

export function SbomReportList() {
  const [sbomReportObjects, setSbomReportObjects] = useState<KubeObject>(null);

  sbomreportClass.useApiList(setSbomReportObjects);

  if (!sbomReportObjects) {
    return <div></div>;
  }

  const sbomReports: SbomReport[] = sbomReportObjects.map((object: KubeObject) => object.jsonData);

  return (
    <>
      <SectionBox>
        <HeadlampTable
          data={sbomReports}
          columns={[
            {
              header: 'Name',
              accessorKey: 'metadata.name',
              Cell: ({ cell, row }: any) => {
                return (
                  <HeadlampLink
                    routeName={RoutingPath.SbomReportDetail}
                    params={{ name: cell.getValue(), namespace: row.original.metadata.namespace }}
                  >
                    {cell.getValue()}
                  </HeadlampLink>
                );
              },
              gridTemplate: 'auto',
            },
            {
              header: 'Repository',
              accessorKey: 'report.artifact.repository',
            },
            {
              header: 'Tag',
              accessorKey: 'report.artifact.tag',
            },
            {
              header: 'Registry',
              accessorKey: 'report.registry.server',
            },
            {
              header: 'Components',
              accessorKey: 'report.summary.componentsCount',
            },
          ]}
        />
      </SectionBox>
    </>
  );
}
