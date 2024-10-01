/* 
  Overview page for vulnerability issues, workloads and images. 
*/
import {
  Link as HeadlampLink,
  SectionBox,
  Table as HeadlampTable,
  Tabs as HeadlampTabs,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { MRT_Cell } from '@mui/material';
import { useState } from 'react';
import makeSeverityLabel from '../common/SeverityLabel';
import { vulnerabilityReportClass } from '../model';
import { VulnerabilityReport } from '../trivy-types/VulnerabilityReport';
import ImageListView from './ImageList';
import ResourceView from './ResourceList';
import { getImage } from './util';

export default function TrivyVulnerabilityList() {
  const [vulnerabilityReportObjects, setvulnerabilityReports] = useState<KubeObject>(null);

  vulnerabilityReportClass.useApiList(setvulnerabilityReports);

  if (!vulnerabilityReportObjects) {
    return <div></div>;
  }

  const vulnerabilityReports = vulnerabilityReportObjects.map(
    (object: KubeObject) => object.jsonData
  );
  return (
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
          score: vulnerability.score,
          workloads: new Set<string>(),
          images: new Set<string>(),
          artifacts: new Set<string>(),
          fixed: vulnerability.fixedVersion !== '',
        };

        newCVEScan.workloads.add(workloadName + '/' + workloadContainer);
        newCVEScan.images.add(getImage(vulnerabilityReport));
        newCVEScan.artifacts.add(vulnerability.resource + ' ' + vulnerability.installedVersion);

        cveScans.push(newCVEScan);
      }
    }
  }

  // default sort on score
  cveScans.sort((a, b) => {
    return b.score - a.score;
  });

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
              header: 'CVE ID',
              accessorFn: (item: CVEScan) => {
                return (
                  <HeadlampLink
                    routeName={''}
                    params={{
                      cve: item.CVE,
                    }}
                  >
                    {item.CVE}
                  </HeadlampLink>
                );
              },
              gridTemplate: 'auto',
            },
            {
              header: 'Severity',
              Cell: ({ cell }: { cell: MRT_Cell }) => makeSeverityLabel(cell.row.original.severity),
              accessorFn: (item: CVEScan) => item.severity,
              gridTemplate: '0.2fr',
            },
            {
              header: 'CVSS',
              accessorFn: (item: CVEScan) => item.score,
              gridTemplate: 'min-content',
            },
            {
              header: 'Component',
              accessorFn: (item: CVEScan) => (
                <div style={{ whiteSpace: 'pre-line' }}>
                  {Array.from(item.artifacts).join('\n')}
                </div>
              ),
              gridTemplate: 'auto',
            },
            {
              header: 'Fixed',
              accessorFn: (item: CVEScan) => (item.fixed ? 'Yes' : ''),
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
              accessorFn: (item: CVEScan) => item.title,
              gridTemplate: 'auto',
            },
          ]}
        />
      </SectionBox>
    </>
  );
}
