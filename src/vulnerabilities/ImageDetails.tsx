/* 
  Show vulnerability scan results for a container image. 
*/
import {
  NameValueTable,
  SectionBox,
  ShowHideLabel,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { Link } from '@mui/material';
import { useState } from 'react';
import { getURLSegments } from '../common/url';
import { vulnerabilityreportClass } from '../model';
import { VulnerabilityReport } from '../types/VulnerabilityReport';

export function ImageVulnerabilityDetails() {
  const [name, namespace] = getURLSegments(-1, -2);
  const [reportVulnerability, setVulnerabilityReport] = useState<KubeObject>(null);

  vulnerabilityreportClass.useApiGet(setVulnerabilityReport, name, namespace);

  return (
    reportVulnerability && (
      <>
        <SectionBox title="Image Vulnerabilities">
          <NameValueTable
            rows={[
              {
                name: 'Image',
                value: reportVulnerability.metadata.annotations['kubescape.io/image-tag'],
              },
              {
                name: 'Last scan',
                value: reportVulnerability.metadata.creationTimestamp,
              },
            ]}
          />
        </SectionBox>

        <Matches reportVulnerability={reportVulnerability.jsonData} />
      </>
    )
  );
}

function Matches(props: { reportVulnerability: VulnerabilityReport }) {
  const { reportVulnerability } = props;
  const results = reportVulnerability.report.vulnerabilities;

  return (
    <SectionBox title="Findings">
      <HeadlampTable
        data={results}
        columns={[
          {
            header: 'Severity',
            accessorKey: 'vulnerability.severity',
            //Cell: ({ cell }: any) => makeSeverityLabel(cell.getValue()),
            gridTemplate: 'auto',
          },
          {
            header: 'CVE',
            accessorKey: 'vulnerability.id',
            Cell: ({ cell }: any) => {
              return (
                <Link target="_blank" href={cell.row.original.vulnerability.dataSource}>
                  {cell.getValue()}
                </Link>
              );
            },
            gridTemplate: 'auto',
          },
          {
            id: 'Score',
            header: 'CVSS',
            accessorFn: (match: VulnerabilityReport.Match) =>
              match.vulnerability.cvss ? match.vulnerability.cvss[0].metrics.baseScore : 0,
            gridTemplate: 'auto',
          },
          {
            header: 'Artifact',
            accessorKey: 'artifact.name',
            gridTemplate: 'auto',
          },
          {
            header: 'Version',
            accessorKey: 'artifact.version',
            gridTemplate: 'auto',
          },
          {
            header: 'Fix',
            accessorKey: 'vulnerability.fix.state',
            gridTemplate: 'auto',
          },
          {
            header: 'Fix in version',
            accessorFn: (item: VulnerabilityReport.Match) =>
              item.vulnerability.fix?.versions && Array.isArray(item.vulnerability.fix?.versions)
                ? item.vulnerability.fix.versions.join(', ')
                : '',
            gridTemplate: 'auto',
          },
          {
            header: 'Description',
            accessorFn: (item: VulnerabilityReport.Match) => {
              let relatedDescription: string = '';
              if (item.relatedVulnerabilities) {
                for (const related of item.relatedVulnerabilities) {
                  if (related.id === item.vulnerability.id) {
                    relatedDescription = related.description;
                  }
                }
              }
              return item.vulnerability.description ?? relatedDescription;
            },
            Cell: ({ cell }: any) => <ShowHideLabel>{cell.getValue()}</ShowHideLabel>,
          },
        ]}
        initialState={{
          sorting: [
            {
              id: 'Score',
              desc: true,
            },
          ],
        }}
      />
    </SectionBox>
  );
}
