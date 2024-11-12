import {
  Link as HeadlampLink,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { useState } from 'react';
import { ClusterComplianceReport } from '../types/ClusterComplianceReport';
import { RoutingPath } from '../index';
import { clustercompliancereportClass } from '../model';

export function ClusterComplianceReportList() {
  const [clusterComplianceReportObjects, setClusterComplianceReportObjects] =
    useState<KubeObject[]>(null);

  clustercompliancereportClass.useApiList(setClusterComplianceReportObjects);

  if (!clusterComplianceReportObjects) {
    return <div></div>;
  }

  const clusterComplianceReports: ClusterComplianceReport[] = clusterComplianceReportObjects.map(
    (object: KubeObject) => object.jsonData
  );

  return (
    <>
      <SectionBox sx={{pt: 1}}>
        <HeadlampTable
          data={clusterComplianceReports}
          columns={[
            {
              header: 'Name',
              accessorKey: 'metadata.name',
              Cell: ({ cell }: any) => {
                return (
                  <HeadlampLink
                    routeName={RoutingPath.ClusterComplianceReportDetail}
                    params={{ name: cell.getValue() }}
                  >
                    {cell.getValue()}
                  </HeadlampLink>
                );
              },
              gridTemplate: 'auto',
            },
            {
              header: 'Failed',
              accessorKey: 'status.summary.failCount',
              gridTemplate: 'min-content',
            },
            {
              header: 'Passed',
              accessorKey: 'status.summary.passCount',
              gridTemplate: 'min-content',
            },
          ]}
        />
      </SectionBox>
    </>
  );
}
