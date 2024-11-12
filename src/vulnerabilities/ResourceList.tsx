/* 
  Show workload configuration scans. This view is part of the main Vulnerabilities page.  
*/
import {
  DateLabel,
  Link as HeadlampLink,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Box, Stack, Tooltip } from '@mui/material';
import { makeNamespaceLink } from '../common/NamespaceLink';
import { RoutingPath } from '../index';
import { VulnerabilityReport } from '../types/VulnerabilityReport';
import { getImage } from './util';

export default function ResourceView(props: { vulnerabilityReports: VulnerabilityReport[] }) {
  const { vulnerabilityReports } = props;

  return (
    <SectionBox sx={{pt: 1}}>
      <HeadlampTable
        data={vulnerabilityReports}
        columns={[
          {
            header: 'Name',
            Cell: ({ cell }: any) => (
              <HeadlampLink
                routeName={RoutingPath.TrivyVulnerabilityReportDetails}
                params={{
                  name: cell.row.original.metadata.name,
                  namespace: cell.row.original.metadata.namespace ?? '-',
                }}
              >
                {cell.getValue()}
              </HeadlampLink>
            ),
            accessorFn: (r: VulnerabilityReport) =>
              r.metadata.labels['trivy-operator.resource.name'],
            gridTemplate: 'auto',
          },
          {
            header: 'Container',
            accessorFn: (r: VulnerabilityReport) =>
              r.metadata.labels['trivy-operator.container.name'],
            gridTemplate: 'auto',
          },
          {
            header: 'Kind',
            accessorFn: (r: VulnerabilityReport) =>
              r.metadata.labels['trivy-operator.resource.kind'],
            gridTemplate: 'min-content',
          },
          {
            header: 'Namespace',
            accessorFn: (r: VulnerabilityReport) => r.metadata.namespace,
            Cell: ({ cell }: any) => makeNamespaceLink(cell.getValue()),
            gridTemplate: 'auto',
          },
          {
            header: 'Image',
            accessorFn: (r: VulnerabilityReport) => getImage(r),
          },
          {
            header: 'CVE',
            accessorFn: (r: VulnerabilityReport) => resultStack(r),
          },
          {
            header: 'Age',
            accessorFn: (r: VulnerabilityReport) => (
              <DateLabel date={r.metadata.creationTimestamp ?? ''} />
            ),
            gridTemplate: 'min-content',
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
  );
}

function resultStack(vulnerabilityReport: VulnerabilityReport) {
  function box(color: string, severity: string) {
    const count = vulnerabilityReport.report.vulnerabilities.filter(
      v => v.severity.toUpperCase() === severity.toUpperCase()
    ).length;

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
        <Tooltip title={severity}><Box>{count}</Box></Tooltip>
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
