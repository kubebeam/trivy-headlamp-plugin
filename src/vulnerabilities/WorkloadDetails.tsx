/* 
  Show vulnerability scan results for a workload. 
*/
import {
  NameValueTable,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Link } from '@mui/material';
import React from 'react';
import { makeSeverityLabel } from '../common/SeverityLabel';
import { getURLSegments } from '../common/url';
import { vulnerabilityreportClass } from '../model';
import { VulnerabilityReport } from '../types/VulnerabilityReport';
import { getCVESummary } from './CVESummary';
import { getImage } from './util';

export function VulnerabilityReportDetails() {
  const [name, namespace] = getURLSegments(-1, -2);
  const [vulnerabilityReportObject, setvulnerabilityReport] = React.useState(null);

  vulnerabilityreportClass.useApiGet(setvulnerabilityReport, name, namespace);

  if (!vulnerabilityReportObject) {
    return <div></div>;
  }
  const vulnerabilityReport: VulnerabilityReport = vulnerabilityReportObject.jsonData;

  return (
    <>
      <SectionBox>
        <NameValueTable
          rows={[
            {
              name: 'Workload',
              value: vulnerabilityReport.metadata.labels['trivy-operator.resource.name'],
            },
            {
              name: 'Container',
              value: vulnerabilityReport.metadata.labels['trivy-operator.container.name'],
            },
            {
              name: 'Kind',
              value: vulnerabilityReport.metadata.labels['trivy-operator.resource.kind'],
            },
            {
              name: 'Namespace',
              value: vulnerabilityReport.metadata.namespace,
            },
            {
              name: 'Image',
              value: getImage(vulnerabilityReport),
            },
            {
              name: 'OS',
              value: `${vulnerabilityReport.report.os.family}:${vulnerabilityReport.report.os.name}`,
            },
            {
              name: 'Age',
              value: vulnerabilityReport.metadata.creationTimestamp,
            },
            {
              name: 'CVE',
              value: getCVESummary(vulnerabilityReport),
            },
          ]}
        />
      </SectionBox>
      <Results vulnerabilityReport={vulnerabilityReport} />
    </>
  );
}

function Results(props: { vulnerabilityReport: VulnerabilityReport }) {
  const { vulnerabilityReport } = props;
  const results = vulnerabilityReport.report.vulnerabilities;

  if (results) {
    results.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  return (
    <SectionBox title="Results">
      <HeadlampTable
        data={results}
        columns={[
          {
            header: 'CVE',
            accessorKey: 'vulnerabilityID',
            Cell: ({ cell, row }: any) => (
              <Link target="_blank" href={row.original.primaryLink}>
                {cell.getValue()}
              </Link>
            ),
            gridTemplate: 'auto',
          },
          {
            header: 'Artifact',
            accessorKey: 'resource',
            gridTemplate: 'auto',
          },
          {
            header: 'Version',
            accessorKey: 'installedVersion',
            gridTemplate: 'min-content',
          },
          {
            header: 'Severity',
            accessorKey: 'severity',
            Cell: ({ cell }: any) => makeSeverityLabel(cell.getValue()),
            gridTemplate: 'min-content',
          },
          {
            header: 'Score',
            accessorKey: 'score',
            gridTemplate: 'min-content',
          },
          {
            header: 'Fix in version',
            accessorKey: 'fixedVersion',
            gridTemplate: 'auto',
          },
          {
            header: 'Description',
            accessorKey: 'title',
          },
        ]}
      />
    </SectionBox>
  );
}
