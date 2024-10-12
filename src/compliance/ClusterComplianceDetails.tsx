import {
  NameValueTable,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { FormControlLabel, Switch } from '@mui/material';
import { useState } from 'react';
import { getURLSegments } from '../common/url';
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
      <SectionBox>
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
              name: 'ID',
              value: clusterComplianceReport.spec?.compliance.id,
            },
            {
              name: 'Platform',
              value: clusterComplianceReport.spec?.compliance.platform,
            },
            {
              name: 'Title',
              value: clusterComplianceReport.spec?.compliance.title,
            },
            {
              name: 'Type',
              value: clusterComplianceReport.spec?.compliance.type,
            },
            {
              name: 'Version',
              value: clusterComplianceReport.spec?.compliance.version,
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

function Results(props: { clusterComplianceReport: ClusterComplianceReport }) {
  const { clusterComplianceReport } = props;
  const [isFailedControlSwitchChecked, setIsFailedControlSwitchChecked] = useState(true);
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
                if (clusterComplianceReport.status?.summaryReport?.controlCheck) {
                  for (const check of clusterComplianceReport.status?.summaryReport?.controlCheck) {
                    if (check.id === control.id) {
                      return check.totalFail;
                    }
                  }
                }
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
