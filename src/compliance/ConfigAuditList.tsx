import {
  Link as HeadlampLink,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { useState } from 'react';
import { getControlSummary } from '../common/ControlSummary';
import { RoutingPath } from '../index';
import { configauditreportClass } from '../model';
import { ConfigAuditReport } from '../types/ConfigAuditReport';

export function ConfigAuditReportList() {
  const [configAuditReportObjects, setConfigAuditReportObjects] = useState<KubeObject[]>(null);

  configauditreportClass.useApiList(setConfigAuditReportObjects);

  if (!configAuditReportObjects) {
    return <div></div>;
  }

  const configAuditReports: ConfigAuditReport[] = configAuditReportObjects.map(
    (object: KubeObject) => object.jsonData
  );

  return (
    <SectionBox sx={{ pt: 1 }}>
      <HeadlampTable
        data={configAuditReports}
        columns={[
          {
            header: 'Name',
            accessorFn: (report: ConfigAuditReport) =>
              report.metadata.labels['trivy-operator.resource.name'],
            Cell: ({ cell, row }: any) => {
              return (
                <HeadlampLink
                  routeName={RoutingPath.ConfigAuditReportDetail}
                  params={{
                    name: row.original.metadata.name,
                    namespace: row.original.metadata.namespace ?? '-',
                  }}
                >
                  {cell.getValue()}
                </HeadlampLink>
              );
            },
            gridTemplate: 'auto',
          },
          {
            header: 'Kind',
            accessorFn: (report: ConfigAuditReport) =>
              report.metadata.labels['trivy-operator.resource.kind'],
          },
          {
            header: 'Namespace',
            accessorKey: 'metadata.namespace',
          },
          {
            header: 'Results',
            accessorFn: (report: ConfigAuditReport) => getControlSummary(report.report.summary),
          },
        ]}
        reflectInURL="config"
      />
    </SectionBox>
  );
}
