import {
  NameValueTable,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { FormControlLabel, Switch } from '@mui/material';
import { useState } from 'react';
import { getURLSegments } from '../common/url';
import { infraassessmentreportClass } from '../model';
import { InfraAssessmentReport } from '../types/InfraAssessmentReport';

export function InfraAssessmentDetails() {
  const [name, namespace] = getURLSegments(-1, -2);

  const [infraAssessmentReportObject, setInfraAssessmentReportObject] = useState<KubeObject>(null);

  infraassessmentreportClass.useApiGet(setInfraAssessmentReportObject, name, namespace);

  if (!infraAssessmentReportObject) {
    return <div></div>;
  }

  const infraAssessmentReport: InfraAssessmentReport = infraAssessmentReportObject.jsonData;

  return (
    <>
      <SectionBox title="Infra Assessment">
        <NameValueTable
          rows={[
            {
              name: 'Name',
              value: infraAssessmentReport.metadata.name,
            },
            {
              name: 'Namespace',
              value: infraAssessmentReport.metadata.namespace,
            },
          ]}
        />
      </SectionBox>
      <Results infraAssessmentReport={infraAssessmentReport} />
    </>
  );
}

function Results(props: { infraAssessmentReport: InfraAssessmentReport }) {
  const { infraAssessmentReport } = props;
  const [isFailedControlSwitchChecked, setIsFailedControlSwitchChecked] = useState(true);
  const checks = isFailedControlSwitchChecked
    ? infraAssessmentReport.report.checks.filter(check => !check.success)
    : infraAssessmentReport.report?.checks;

  return (
    <>
      <FormControlLabel
        checked={isFailedControlSwitchChecked}
        control={<Switch color="primary" />}
        label={'Failed checks'}
        onChange={(event: any, checked: boolean) => {
          setIsFailedControlSwitchChecked(checked);
        }}
      />
      <SectionBox title="Results">
        <HeadlampTable
          data={checks}
          columns={[
            {
              header: 'Severity',
              accessorKey: 'severity',
              gridTemplate: 'min-content',
            },
            {
              header: 'ID',
              accessorKey: 'checkID',
              gridTemplate: 'min-content',
            },
            {
              header: 'Description',
              accessorKey: 'description',
              gridTemplate: 'auto',
            },
            {
              header: 'Remediation',
              accessorKey: 'remediation',
              gridTemplate: 'auto',
            },
          ]}
        />
      </SectionBox>
    </>
  );
}
