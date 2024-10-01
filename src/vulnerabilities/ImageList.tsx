/* 
  Show container image scans. This view is part of the main Vulnerabilities page.  
*/
import {
  DateLabel,
  Link as HeadlampLink,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Box, Stack, Tooltip } from '@mui/material';
import { VulnerabilityReport } from '../trivy-types/VulnerabilityReport';

interface ImageScan {
  creationTimestamp: string;
  artifact: string;
  workloads: Set<string>;
  vulnerabilityReports: VulnerabilityReport[];
}

export default function ImageListView(props: { vulnerabilityReports: VulnerabilityReport[] }) {
  const { vulnerabilityReports } = props;
  if (!vulnerabilityReports) {
    return <></>;
  }

  const imageScans = getImageScans(vulnerabilityReports);
  return (
    <>
      <h5>{imageScans.length} image scans</h5>
      <SectionBox>
        <HeadlampTable
          data={imageScans}
          columns={[
            {
              header: 'Image',
              accessorFn: (imageScan: ImageScan) => imageScan.artifact,
              Cell: ({ cell }: { cell: any }) => (
                <HeadlampLink
                  routeName={''}
                  params={{
                    name: cell.getValue(),
                  }}
                >
                  {cell.getValue()}
                </HeadlampLink>
              ),
              gridTemplate: 'max-content',
            },
            {
              header: 'Workload',
              accessorFn: (imageScan: ImageScan) => {
                return (
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {Array.from(imageScan.workloads).join('\n')}
                  </div>
                );
              },
              gridTemplate: 'max-content',
            },
            {
              header: 'Last scan',
              accessorFn: (imageScan: ImageScan) => (
                <DateLabel date={imageScan.creationTimestamp} />
              ),
              gridTemplate: 'max-content',
            },
            {
              header: 'Vulnerabilities',
              accessorFn: (imageScan: ImageScan) => resultStack(imageScan),
            },
          ]}
        />
      </SectionBox>
    </>
  );
}

function getImageScans(vulnerabilityReports: VulnerabilityReport[]): ImageScan[] {
  const imageScans = new Map<string, ImageScan>();

  vulnerabilityReports.map((report: VulnerabilityReport) => {
    const artifact = `${report.report.artifact.repository}:${report.report.artifact.tag}`;
    const imageScan = imageScans.get(artifact);
    const workloadName = report.metadata.labels['trivy-operator.resource.name'];
    if (imageScan) {
      imageScan.workloads.add(workloadName);
      imageScan.vulnerabilityReports.push(report);
    } else {
      const workloads = new Set<string>();
      workloads.add(workloadName);
      imageScans.set(artifact, {
        creationTimestamp: report.metadata.creationTimestamp,
        artifact: artifact,
        workloads: workloads,
        vulnerabilityReports: [report],
      });
    }
  });

  return Array.from(imageScans.values());
}

function resultStack(imageScan: ImageScan) {
  const vulnerabilitiesMap = new Map<string, VulnerabilityReport.Vulnerability>();
  for (const v of imageScan.vulnerabilityReports.flatMap(r => r.report.vulnerabilities)) {
    vulnerabilitiesMap.set(v.vulnerabilityID, v);
  }
  const vulnerabilities = Array.from(vulnerabilitiesMap.values());

  function box(color: string, severity: string) {
    return (
      <Box
        sx={{
          borderLeft: 2,
          borderTop: 1,
          borderRight: 1,
          borderBottom: 1,
          borderColor: `gray gray gray ${color}`,
          textAlign: 'center',
          width: 25,
        }}
      >
        <Tooltip title={cveList(vulnerabilities, severity)}>
          {vulnerabilities.filter(v => v.severity.toLowerCase() === severity.toLowerCase()).length}
        </Tooltip>
      </Box>
    );
  }

  return (
    <Stack direction="row" spacing={1}>
      {box('purple', 'Critical')}
      {box('red', 'High')}
      {box('orange', 'Medium')}
      {box('yellow', 'Low')}
    </Stack>
  );
}

function cveList(vulnerabilities: VulnerabilityReport.Vulnerability[], severity: string) {
  const cves = vulnerabilities
    .filter(v => v.severity.toLowerCase() === severity.toLowerCase())
    .map(v => v.vulnerabilityID);

  if (cves.length > 0) {
    return (
      <>
        <div style={{ fontSize: 'smaller' }}>{severity}</div>
        <br />
        <div style={{ whiteSpace: 'normal', textAlign: 'left', fontSize: 'small' }}>
          <Stack spacing={1}>
            {cves.map(cve => (
              <div>{cve} </div>
            ))}
          </Stack>
        </div>
      </>
    );
  }
}
