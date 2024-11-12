import {
  Link as HeadlampLink,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { FormControlLabel, Switch } from '@mui/material';
import { useState } from 'react';
import { getControlSummary } from '../common/ControlSummary';
import { RoutingPath } from '../index';
import { clusterrbacassessmentreportClass, rbacassessmentreportClass } from '../model';
import { RbacAssessmentReport } from '../types/RbacAssessmentReport';

export function RbacAssessmentReportList() {
  const [rbacAssessmentReportObjects, setRbacAssessmentReportObjects] = useState<KubeObject>(null);
  const [clusterRbacAssessmentReportObjects, setClusterRbacAssessmentReportObjects] =
    useState<KubeObject[]>(null);
  const [isFailedControlSwitchChecked, setIsFailedControlSwitchChecked] = useState(true);

  rbacassessmentreportClass.useApiList(setRbacAssessmentReportObjects);
  clusterrbacassessmentreportClass.useApiList(setClusterRbacAssessmentReportObjects);

  if (!rbacAssessmentReportObjects || !clusterRbacAssessmentReportObjects) {
    return <div></div>;
  }

  const rbacAssessmentReports: RbacAssessmentReport[] = clusterRbacAssessmentReportObjects
    .concat(rbacAssessmentReportObjects)
    .map((object: KubeObject) => object.jsonData);

  const reports = isFailedControlSwitchChecked
    ? rbacAssessmentReports.filter(report => {
        const summary = report.report.summary;
        return (
          summary.criticalCount + summary.highCount + summary.mediumCount + summary.lowCount > 0
        );
      })
    : rbacAssessmentReports;

  return (
    <>
      <SectionBox>
        <FormControlLabel
          checked={isFailedControlSwitchChecked}
          control={<Switch color="primary" />}
          label={'Failed checks'}
          onChange={(event: any, checked: boolean) => {
            setIsFailedControlSwitchChecked(checked);
          }}
        />
        <HeadlampTable
          data={reports}
          columns={[
            {
              header: 'Name',
              accessorFn: (report: RbacAssessmentReport) => getRBACResource(report),
              Cell: ({ cell, row }: any) => {
                return (
                  <HeadlampLink
                    routeName={RoutingPath.RbacAssessmentReportDetail}
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
              accessorFn: (report: RbacAssessmentReport) =>
                report.metadata.labels['trivy-operator.resource.kind'],
              gridTemplate: 'auto',
            },
            {
              header: 'Namespace',
              accessorFn: (report: RbacAssessmentReport) =>
                report.metadata.labels['trivy-operator.resource.namespace'],
              gridTemplate: 'auto',
            },
            {
              header: 'Results',
              accessorFn: (report: RbacAssessmentReport) =>
                getControlSummary(report.report.summary),
            },
          ]}
        />
      </SectionBox>
    </>
  );
}

export function getRBACResource(report: RbacAssessmentReport): string {
  const getOwnerName = (report: RbacAssessmentReport) => {
    if (report.metadata.ownerReferences && report.metadata.ownerReferences.length > 0)
      return report.metadata.ownerReferences[0].name;
  };
  return (
    report.metadata.labels['trivy-operator.resource.name'] ??
    getOwnerName(report) ??
    report.metadata.labels['trivy-operator.resource.name-hash']
  );
}
