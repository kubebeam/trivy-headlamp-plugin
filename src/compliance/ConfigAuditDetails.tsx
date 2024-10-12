import {
  NameValueTable,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { useState } from 'react';
import { getURLSegments } from '../common/url';
import { configauditreportClass } from '../model';
import { ConfigAuditReport } from '../types/ConfigAuditReport';
import { ConfigAuditReportReportChecks } from '../types/ConfigAuditReportReportChecks';

export function ConfigAuditReportDetails() {
  const [name, namespace] = getURLSegments(-1, -2);

  const [configAuditReportObject, setConfigAuditReportObject] = useState<KubeObject>(null);

  configauditreportClass.useApiGet(setConfigAuditReportObject, name, namespace);

  if (!configAuditReportObject) {
    return <div></div>;
  }

  const configAuditReport: ConfigAuditReport = configAuditReportObject.jsonData;

  return (
    <>
      <SectionBox>
        <NameValueTable
          rows={[
            {
              name: 'Name',
              value: configAuditReport.metadata.name,
            },
            {
              name: 'Kind',
              value: configAuditReport.metadata.labels['trivy-operator.resource.kind'],
            },
            {
              name: 'Namespace',
              value: configAuditReport.metadata.namespace,
            },
          ]}
        />
      </SectionBox>
      <Results configAuditReport={configAuditReport} />
    </>
  );
}

function Results(props: { configAuditReport: ConfigAuditReport }) {
  const { configAuditReport } = props;

  return (
    <>
      <SectionBox title="Results">
        <HeadlampTable
          data={configAuditReport.report.checks}
          columns={[
            {
              header: 'Success',
              accessorFn: (check: ConfigAuditReportReportChecks) => (check.success ? 'Yes' : 'No'),
              gridTemplate: 'min-content',
            },
            {
              header: 'ID',
              accessorKey: 'checkID',
              gridTemplate: 'min-content',
            },
            {
              header: 'Category',
              accessorKey: 'category',
            },
            {
              header: 'Description',
              accessorKey: 'description',
            },
            {
              header: 'Severity',
              accessorKey: 'severity',
              gridTemplate: 'min-content',
            },
            {
              header: 'Messages',
              accessorFn: (check: ConfigAuditReportReportChecks) => check.messages?.join('\n'),
            },
            {
              header: 'Remediation',
              accessorKey: 'remediation',
            },
            // {
            //   header: 'Scope',
            //   accessorFn: (check: ConfigAuditReportReportChecks) => {
            //     if (check.scope) {
            //       return `${check.scope.type}:${check.scope.value}`;
            //     }
            //   },
            // },
          ]}
        />
      </SectionBox>
    </>
  );
}
