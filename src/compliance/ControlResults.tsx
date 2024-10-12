/* 
  Information about a control and failed workloads. 
*/
import {
  Link as HeadlampLink,
  NameValueTable,
  SectionBox,
  Table,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { useState } from 'react';
import { getURLSegments } from '../common/url';
import { RoutingPath } from '../index';
import { configauditreportClass } from '../model';
import { ConfigAuditReport } from '../types/ConfigAuditReport';
import { ConfigAuditReportReportChecks } from '../types/ConfigAuditReportReportChecks';

export function ControlResults() {
  const [controlID] = getURLSegments(-1);

  const [configAuditReportObjects, setConfigAuditReports] = useState<KubeObject>(null);

  configauditreportClass.useApiList(setConfigAuditReports);

  if (!configAuditReportObjects) {
    return <div></div>;
  }

  const configAuditReports: ConfigAuditReport[] = configAuditReportObjects.map(
    (object: KubeObject) => object.jsonData
  );

  // ControlID format is AVD-KSV-0001
  const controlNumber = parseInt(controlID.split('-')[2]);
  const controlCategory = controlID.split('-')[1];

  const resourceList = configAuditReports.filter(r =>
    r.report.checks.some(check => {
      if (check.checkID.startsWith(controlCategory)) {
        const nr = check.checkID.replace(controlCategory, '');
        return parseInt(nr) === controlNumber;
      }
    })
  );

  let firstCheck: ConfigAuditReportReportChecks | undefined;
  if (resourceList?.length > 0 && resourceList[0].report.checks) {
    firstCheck = resourceList[0].report.checks.find(check => {
      const nr = check.checkID.replace(controlCategory, '');
      return parseInt(nr) === controlNumber;
    });
  }

  return (
    <>
      <SectionBox title={`${controlID}: ${firstCheck?.title}`}>
        <NameValueTable
          rows={[
            {
              name: 'ID',
              value: controlID,
            },
            {
              name: 'Category',
              value: firstCheck?.category,
            },
            {
              name: 'Description',
              value: firstCheck?.description,
            },
            {
              name: 'Remediation',
              value: firstCheck?.remediation,
            },
          ]}
        />
      </SectionBox>

      <SectionBox title="Failed Resources">
        <Table
          data={resourceList}
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
                      namespace: row.original.metadata.namespace,
                    }}
                  >
                    {cell.getValue()}
                  </HeadlampLink>
                );
              },
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
          ]}
        />
      </SectionBox>
    </>
  );
}
