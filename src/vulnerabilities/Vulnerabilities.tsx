/* 
  Overview page for vulnerability issues, workloads and images. 
*/
import {
  SectionBox,
  Table as HeadlampTable,
  Tabs as HeadlampTabs,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { Link } from '@mui/material';
import { useState } from 'react';
import { makeSeverityLabel } from '../common/SeverityLabel';
import { clustervulnerabilityreportClass, vulnerabilityreportClass } from '../model';
import { VulnerabilityReport } from '../types/VulnerabilityReport';
import ImageListView from './ImageList';
import ResourceView from './ResourceList';
import { getImage } from './util';

export function VulnerabilityList() {
  const [vulnerabilityReportObjects, setVulnerabilityReports] = useState<KubeObject>(null);
  const [clusterVulnerabilityReportObjects, setClusterVulnerabilityReports] =
    useState<KubeObject>(null);

  vulnerabilityreportClass.useApiList(setVulnerabilityReports);
  clustervulnerabilityreportClass.useApiList(setClusterVulnerabilityReports);

  if (!vulnerabilityReportObjects || !clusterVulnerabilityReportObjects) {
    return <div></div>;
  }

  const vulnerabilityReports = clusterVulnerabilityReportObjects
    .concat(vulnerabilityReportObjects)
    .map((object: KubeObject) => object.jsonData);

  return (
    <>
      <h1>Vulnerabilities</h1>
      <HeadlampTabs
        tabs={[
          {
            label: 'CVE',
            component: <CVEListView vulnerabilityReports={vulnerabilityReports} />,
          },
          {
            label: 'Resources',
            component: <ResourceView vulnerabilityReports={vulnerabilityReports} />,
          },
          {
            label: 'Images',
            component: <ImageListView vulnerabilityReports={vulnerabilityReports} />,
          },
        ]}
        ariaLabel="Navigation Tabs"
      />
    </>
  );
}

interface CVEScan {
  CVE: string;
  workloads: Set<string>;
  fixed: boolean;
  artifacts: Set<string>;
  images: Set<string>;
  score: number;
  severity: string;
  title?: string;
  primaryLink?: string;
}

// flatten vulnerabilityReports into a list of CVEScan
function getCVEList(vulnerabilityReports: VulnerabilityReport[]): CVEScan[] {
  const cveScans: CVEScan[] = [];

  for (const vulnerabilityReport of vulnerabilityReports) {
    for (const vulnerability of vulnerabilityReport.report.vulnerabilities) {
      const cveScan = cveScans.find(element => element.CVE === vulnerability.vulnerabilityID);
      const workloadName = vulnerabilityReport.metadata.labels['trivy-operator.resource.name'];
      const workloadContainer =
        vulnerabilityReport.metadata.labels['trivy-operator.container.name'];

      if (cveScan) {
        cveScan.workloads.add(workloadName + '/' + workloadContainer);
        cveScan.images.add(getImage(vulnerabilityReport));
        cveScan.artifacts.add(vulnerability.resource + ' ' + vulnerability.installedVersion);

        cveScan.fixed = vulnerability.fixedVersion !== '';
      } else {
        const newCVEScan: CVEScan = {
          CVE: vulnerability.vulnerabilityID,
          title: vulnerability.title,
          severity: vulnerability.severity,
          score: vulnerability.score ?? 0,
          workloads: new Set<string>(),
          images: new Set<string>(),
          artifacts: new Set<string>(),
          fixed: vulnerability.fixedVersion !== '',
          primaryLink: vulnerability.primaryLink,
        };

        newCVEScan.workloads.add(workloadName + '/' + workloadContainer);
        newCVEScan.images.add(getImage(vulnerabilityReport));
        newCVEScan.artifacts.add(vulnerability.resource + ' ' + vulnerability.installedVersion);

        cveScans.push(newCVEScan);
      }
    }
  }

  return cveScans;
}

function CVEListView(props: { vulnerabilityReports: VulnerabilityReport[] }) {
  const { vulnerabilityReports } = props;

  const cveList = getCVEList(vulnerabilityReports);

  return (
    <>
      <h5>
        {vulnerabilityReports.length} workload scans, {cveList.length} CVE issues
      </h5>
      <SectionBox>
        <HeadlampTable
          data={cveList}
          columns={[
            {
              header: 'Severity',
              accessorKey: 'severity',
              Cell: ({ cell }: any) => makeSeverityLabel(cell.row.original.severity),
              gridTemplate: '0.2fr',
            },
            {
              header: 'CVE ID',
              accessorKey: 'CVE',
              Cell: ({ cell, row }: any) => {
                return <Link href={row.original.primaryLink}>{cell.getValue()}</Link>;
              },
              gridTemplate: 'auto',
            },
            {
              id: 'Score',
              header: 'CVSS',
              accessorKey: 'score',
              gridTemplate: 'min-content',
            },
            {
              header: 'Component',
              accessorKey: 'artifacts',
              Cell: ({ cell }: any) => (
                <div style={{ whiteSpace: 'pre-line' }}>
                  {Array.from(cell.getValue()).join('\n')}
                </div>
              ),
              gridTemplate: 'auto',
            },
            {
              header: 'Fixed',
              accessorKey: 'fixed',
              Cell: ({ cell }: any) => (cell.getValue() ? 'Yes' : ''),
              gridTemplate: 'min-content',
            },
            {
              header: 'Images',
              accessorFn: (item: CVEScan) => item.images.size,
              gridTemplate: 'min-content',
            },
            {
              header: 'Workloads',
              accessorFn: (item: CVEScan) => item.workloads.size,
              gridTemplate: 'min-content',
            },
            {
              header: 'Description',
              accessorKey: 'title',
              gridTemplate: 'auto',
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
    </>
  );
}
