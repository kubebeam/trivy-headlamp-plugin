import {
  Link as HeadlampLink,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { useState } from 'react';
import { getControlSummary } from '../common/ControlSummary';
import { RoutingPath } from '../index';
import { clusterinfraassessmentreportClass, infraassessmentreportClass } from '../model';
import { InfraAssessmentReport } from '../types/InfraAssessmentReport';

export function InfraAssessmentReportList() {
  const [infraAssessmentReportObjects, setInfraAssessmentReportObjects] =
    useState<KubeObject[]>(null);
  const [clusterInfraAssessmentReportObjects, setClusterInfraAssessmentReportObjects] =
    useState<KubeObject[]>(null);

  infraassessmentreportClass.useApiList(setInfraAssessmentReportObjects);
  clusterinfraassessmentreportClass.useApiList(setClusterInfraAssessmentReportObjects);

  if (!infraAssessmentReportObjects || !clusterInfraAssessmentReportObjects) {
    return <div></div>;
  }

  const infraAssessmentReports: InfraAssessmentReport[] = clusterInfraAssessmentReportObjects
    .concat(infraAssessmentReportObjects)
    .map((object: KubeObject) => object.jsonData);

  return (
    <SectionBox sx={{ pt: 1 }}>
      <HeadlampTable
        data={infraAssessmentReports}
        columns={[
          {
            header: 'Name',
            accessorKey: 'metadata.name',
            Cell: ({ cell, row }: any) => {
              return (
                <HeadlampLink
                  routeName={RoutingPath.InfraAssessmentReportDetail}
                  params={{
                    name: cell.getValue(),
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
            header: 'Namespace',
            accessorKey: 'metadata.namespace',
          },
          {
            header: 'Results',
            accessorFn: (report: InfraAssessmentReport) => getControlSummary(report.report.summary),
          },
        ]}
      />
    </SectionBox>
  );
}
