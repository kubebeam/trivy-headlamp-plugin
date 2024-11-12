import {
  Link as HeadlampLink,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { useState } from 'react';
import { getControlSummary } from '../common/ControlSummary';
import { RoutingPath } from '../index';
import { exposedsecretreportClass } from '../model';
import { ExposedSecretReport } from '../types/ExposedSecretReport';

export function ExposedSecretList() {
  const [exposedSecretObjects, setExposedSecretObjects] = useState<KubeObject[]>(null);

  exposedsecretreportClass.useApiList(setExposedSecretObjects);

  if (!exposedSecretObjects) {
    return <div></div>;
  }

  const exposedSecretReports: ExposedSecretReport[] = exposedSecretObjects.map(
    (object: KubeObject) => object.jsonData
  );

  const filteredSecretReports = exposedSecretReports.filter(report => {
    const s = report.report.summary;
    return s.criticalCount > 0 || s.highCount > 0 || s.mediumCount > 0 || s.lowCount > 0;
  });

  return (
    <>
      <SectionBox title="Exposed Secrets" sx={{pt: 1}}>
        <HeadlampTable
          data={filteredSecretReports}
          columns={[
            {
              header: 'Name',
              accessorFn: (exposedSecretReport: ExposedSecretReport) =>
                exposedSecretReport.metadata.labels['trivy-operator.resource.name'],
              Cell: ({ cell, row }: any) => {
                return (
                  <HeadlampLink
                    routeName={RoutingPath.ExposedSecretDetails}
                    params={{
                      name: row.original.metadata.name,
                      namespace: row.original.metadata.namespace,
                    }}
                  >
                    {cell.getValue()}
                  </HeadlampLink>
                );
              },
            },
            {
              header: 'Container',
              accessorFn: (exposedSecretReport: ExposedSecretReport) =>
                exposedSecretReport.metadata.labels['trivy-operator.container.name'],
            },
            {
              header: 'Kind',
              accessorFn: (exposedSecretReport: ExposedSecretReport) =>
                exposedSecretReport.metadata.labels['trivy-operator.resource.kind'],
            },
            {
              header: 'Namespace',
              accessorFn: (exposedSecretReport: ExposedSecretReport) =>
                exposedSecretReport.metadata.labels['trivy-operator.resource.namespace'],
            },
            {
              header: 'Results',
              accessorFn: (exposedSecretReport: ExposedSecretReport) =>
                getControlSummary(exposedSecretReport.report.summary),
              gridTemplate: 'auto',
            },
          ]}
        />
      </SectionBox>
    </>
  );
}
