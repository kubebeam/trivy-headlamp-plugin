import {
  Link as HeadlampLink,
  NameValueTable,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { FormControlLabel, Switch } from '@mui/material';
import { useState } from 'react';
import { TrivySessionSettings, useSessionStorage } from '../common/sessionStorage';
import { getURLSegments } from '../common/url';
import { RoutingPath } from '../index';
import { clustercompliancereportClass } from '../model';
import { ClusterComplianceReport } from '../types/ClusterComplianceReport';
import { ClusterComplianceReportSpecComplianceControls } from '../types/ClusterComplianceReportSpecComplianceControls';

export function ClusterComplianceDetails() {
  const [name] = getURLSegments(-1);

  const [clusterComplianceReportObject, setClusterComplianceReportObject] =
    useState<KubeObject>(null);

  clustercompliancereportClass.useApiGet(setClusterComplianceReportObject, name);

  if (!clusterComplianceReportObject) {
    return <div></div>;
  }

  const clusterComplianceReport: ClusterComplianceReport = clusterComplianceReportObject.jsonData;

  return (
    <>
      <SectionBox title={name} backLink>
        <NameValueTable
          rows={[
            {
              name: 'Name',
              value: clusterComplianceReport.metadata.name,
            },
            {
              name: 'Description',
              value: clusterComplianceReport.spec?.compliance.description,
            },
            {
              name: 'Version',
              value: clusterComplianceReport.spec?.compliance.version,
            },
            {
              name: 'Platform',
              value: clusterComplianceReport.spec?.compliance.platform,
            },
            {
              name: 'Related Resources',
              value: clusterComplianceReport.spec?.compliance.relatedResources.join(', '),
            },
          ]}
        />
      </SectionBox>
      <Results clusterComplianceReport={clusterComplianceReport} />
    </>
  );
}

function Results(props: Readonly<{ clusterComplianceReport: ClusterComplianceReport }>) {
  const { clusterComplianceReport } = props;
  const [isFailedControlSwitchChecked, setIsFailedControlSwitchChecked] = useSessionStorage(
    TrivySessionSettings.FailedControls,
    true
  );
  const controls = isFailedControlSwitchChecked
    ? getControlsWithFindings(clusterComplianceReport)
    : clusterComplianceReport.spec?.compliance.controls;

  return (
    <>
      <FormControlLabel
        checked={isFailedControlSwitchChecked}
        control={<Switch color="primary" />}
        label={'Failed controls'}
        onChange={(event: any, checked: boolean) => {
          setIsFailedControlSwitchChecked(checked);
        }}
      />
      <SectionBox title="Results">
        <HeadlampTable
          data={controls}
          columns={[
            {
              header: 'ID',
              accessorKey: 'id',
              gridTemplate: 'min-content',
            },
            {
              header: 'Name',
              accessorKey: 'name',
              gridTemplate: 'auto',
            },
            {
              header: 'Checks',
              accessorFn: (control: ClusterComplianceReportSpecComplianceControls) => {
                const controlDef = clusterComplianceReport.spec?.compliance.controls.find(
                  element => element.id === control.id
                );
                return controlDef?.checks?.map(check => check.id);
              },
              Cell: ({ cell }: any) => {
                const checks: string[] = cell.getValue();
                if (checks) {
                  return checks.map(check => (
                    <HeadlampLink
                      routeName={RoutingPath.ControlResults}
                      params={{ control: check }}
                    >
                      {check}
                    </HeadlampLink>
                  ));
                }
              },
              gridTemplate: 'auto',
            },
            {
              header: 'Description',
              accessorKey: 'description',
              gridTemplate: 'auto',
            },
            {
              header: 'Severity',
              accessorKey: 'severity',
              //Cell: ({ cell }: any) => makeSeverityLabel(cell.getValue()),
              gridTemplate: 'min-content',
            },
            {
              header: 'Failures',
              accessorFn: (control: ClusterComplianceReportSpecComplianceControls) => {
                const check = clusterComplianceReport.status?.summaryReport?.controlCheck?.find(
                  check => check.id === control.id
                );
                return check ? check.totalFail : 0;
              },
            },
          ]}
        />
      </SectionBox>
    </>
  );
}

function getControlsWithFindings(
  clusterComplianceReport: ClusterComplianceReport
): ClusterComplianceReportSpecComplianceControls[] | undefined {
  return clusterComplianceReport.spec?.compliance.controls.filter(control => {
    if (clusterComplianceReport.status?.summaryReport?.controlCheck) {
      return clusterComplianceReport.status?.summaryReport?.controlCheck.some(
        check => check.id === control.id && check.totalFail && check.totalFail > 0
      );
    }
    return true;
  });
}
