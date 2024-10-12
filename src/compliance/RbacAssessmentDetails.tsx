import {
  NameValueTable,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { useState } from 'react';
import { getURLSegments } from '../common/url';
import { clusterrbacassessmentreportClass, rbacassessmentreportClass } from '../model';
import { RbacAssessmentReport } from '../types/RbacAssessmentReport';
import { getRBACResource } from './RbacAssessmentList';

export function RbacAssessmentDetails() {
  const [name, namespace] = getURLSegments(-1, -2);

  const [rbacAssessmentReportObject, setRbacAssessmentReportObject] = useState<KubeObject>(null);

  if (namespace === '-')
    clusterrbacassessmentreportClass.useApiGet(setRbacAssessmentReportObject, name);
  else rbacassessmentreportClass.useApiGet(setRbacAssessmentReportObject, name, namespace);

  if (!rbacAssessmentReportObject) {
    return <div></div>;
  }

  const rbacAssessmentReport: RbacAssessmentReport = rbacAssessmentReportObject.jsonData;

  return (
    <>
      <SectionBox title="RBAC Assessment">
        <NameValueTable
          rows={[
            {
              name: 'Name',
              value: getRBACResource(rbacAssessmentReport),
            },
            {
              name: 'Namespace',
              value: rbacAssessmentReport.metadata.namespace,
            },
          ]}
        />
      </SectionBox>
      <Results rbacAssessmentReport={rbacAssessmentReport} />
    </>
  );
}

function Results(props: { rbacAssessmentReport: RbacAssessmentReport }) {
  const { rbacAssessmentReport } = props;
  const checks = rbacAssessmentReport.report?.checks;

  return (
    <>
      <SectionBox title="Checks">
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
