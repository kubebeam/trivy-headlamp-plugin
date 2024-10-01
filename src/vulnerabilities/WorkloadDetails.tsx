/* 
  Show vulnerability scan results for a workload. 
*/
import {
  NameValueTable,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Link, MRT_Cell } from '@mui/material';
import React from 'react';
import makeSeverityLabel from '../common/SeverityLabel';
import { getURLSegments } from '../common/url';
import { vulnerabilityReportClass } from '../model';
import { VulnerabilityReport } from '../trivy-types/VulnerabilityReport';
import { getCVESummary } from './CVESummary';
import { getImage } from './util';

export default function TrivyVulnerabilityReportDetails() {
  const [name, namespace] = getURLSegments(-1, -2);
  const [vulnerabilityReportObject, setvulnerabilityReport] = React.useState(null);

  vulnerabilityReportClass.useApiGet(setvulnerabilityReport, name, namespace);

  if (!vulnerabilityReportObject) {
    return <div></div>;
  }
  const vulnerabilityReport: VulnerabilityReport = vulnerabilityReportObject.jsonData;

  return (
    <>
      <SectionBox title="Vulnerability Report">
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
    results.sort((a, b) => b.score - a.score);
  }

  return (
    <SectionBox title="Results">
      <HeadlampTable
        data={results}
        columns={[
          {
            header: 'CVE',
            Cell: ({ cell }: { cell: MRT_Cell }) => (
              <Link target="_blank" href={cell.row.original.primaryLink}>
                {cell.getValue()}
              </Link>
            ),
            accessorFn: (item: VulnerabilityReport.Vulnerability) => item.vulnerabilityID,
            gridTemplate: 'auto',
          },
          {
            header: 'Artifact',
            accessorFn: (item: VulnerabilityReport.Vulnerability) => item.resource,
            gridTemplate: 'auto',
          },
          {
            header: 'Version',
            accessorFn: (item: VulnerabilityReport.Vulnerability) => item.installedVersion,
            gridTemplate: 'min-content',
          },
          {
            header: 'Severity',
            accessorFn: (item: VulnerabilityReport.Vulnerability) =>
              makeSeverityLabel(item.severity),
            gridTemplate: 'min-content',
          },
          {
            header: 'Severity',
            accessorFn: (item: VulnerabilityReport.Vulnerability) => item.score,
            gridTemplate: 'min-content',
          },
          {
            header: 'Fix in version',
            accessorFn: (item: VulnerabilityReport.Vulnerability) => item.fixedVersion,
            gridTemplate: 'auto',
          },
          {
            header: 'Description',
            accessorFn: (item: VulnerabilityReport.Vulnerability) => item.title,
          },
        ]}
      />
    </SectionBox>
  );
}
