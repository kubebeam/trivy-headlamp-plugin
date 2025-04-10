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
import { RoutingPath } from '../index';
import { VulnerabilityReport } from '../types/VulnerabilityReport';
import { VulnerabilityReportReportVulnerabilities } from '../types/VulnerabilityReportReportVulnerabilities';

interface ImageScan {
  metadata: {
    name?: string;
    namespace?: string;
    creationTimestamp?: string | undefined;
  };
  artifact: string;
  workloads: VulnerabilityReport[];
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
              accessorKey: 'artifact',
            },
            {
              header: 'Workloads',
              accessorFn: (imageScan: ImageScan) => {
                return (
                  <Stack spacing={1}>
                    {imageScan.workloads.map((workload, indx) => (
                      <Box key={indx}>
                        <HeadlampLink
                          routeName={RoutingPath.TrivyVulnerabilityReportDetails}
                          params={{
                            name: workload.metadata.name,
                            namespace: workload.metadata.namespace ?? '-',
                          }}
                        >
                          {workload.metadata.name}
                        </HeadlampLink>
                      </Box>
                    ))}
                  </Stack>
                );
              },
            },
            {
              header: 'Namespaces',
              accessorFn: (imageScan: ImageScan) => {
                const namespaces = [
                  ...new Set(imageScan.workloads.map(workload => workload.metadata.namespace)),
                ];

                return (
                  <Stack spacing={1}>
                    {Array.from(namespaces).map((namespace, indx) => (
                      <Box key={indx}>{namespace}</Box>
                    ))}
                  </Stack>
                );
              },
              gridTemplate: 'max-content',
            },
            {
              header: 'Last scan',
              accessorFn: (imageScan: ImageScan) => (
                <DateLabel date={imageScan.metadata.creationTimestamp ?? ''} />
              ),
              gridTemplate: 'max-content',
            },
            {
              header: 'Vulnerabilities',
              accessorFn: (imageScan: ImageScan) => resultStack(imageScan),
            },
            {
              header: 'SBOM',
              Cell: ({ row }: any) => (
                <HeadlampLink
                  routeName={RoutingPath.SbomReportDetail}
                  params={{
                    name: row.original.metadata.namespace
                      ? row.original.metadata.name
                      : row.original.metadata.labels['trivy-operator.resource.name'],
                    namespace: row.original.metadata.namespace ?? '-',
                  }}
                >
                  SBOM
                </HeadlampLink>
              ),
              gridTemplate: 'min-content',
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

    if (imageScan) {
      imageScan.workloads.push(report);
    } else {
      imageScans.set(artifact, {
        metadata: report.metadata,
        artifact: artifact,
        workloads: [report],
      });
    }
  });

  return Array.from(imageScans.values());
}

function resultStack(imageScan: ImageScan) {
  const vulnerabilitiesMap = new Map<string, VulnerabilityReportReportVulnerabilities>();
  for (const v of imageScan.workloads.flatMap(r => r.report.vulnerabilities)) {
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
          <Box>
            {
              vulnerabilities.filter(v => v.severity.toLowerCase() === severity.toLowerCase())
                .length
            }
          </Box>
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

function cveList(vulnerabilities: VulnerabilityReportReportVulnerabilities[], severity: string) {
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
              <div key={cve}>{cve} </div>
            ))}
          </Stack>
        </div>
      </>
    );
  }
}
