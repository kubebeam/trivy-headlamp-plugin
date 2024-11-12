/* 
  Build a horizontack stack with seperate cells for critical, high, medium, low, none and unknown. 
*/
import { Box, Stack, Tooltip } from '@mui/material';
import { ConfigAuditReportReportSummary } from '../types/ConfigAuditReportReportSummary';

export function getControlSummary(summary: ConfigAuditReportReportSummary | undefined) {
  if (!summary) {
    return;
  }
  function box(color: string, severity: string, countScan: number) {
    return (
      <Box
        sx={{
          borderLeft: 2,
          borderTop: 1,
          borderRight: 1,
          borderBottom: 1,
          borderColor: `gray gray gray ${color}`,
          textAlign: 'center',
          width: 100,
        }}
      >
        <Tooltip title={severity}>
          <Box>
          {countScan} {severity}
          </Box>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Stack direction="row" spacing={1}>
      {box('purple', 'Critical', summary.criticalCount)}
      {box('red', 'High', summary.highCount)}
      {box('orange', 'Medium', summary.mediumCount)}
      {box('yellow', 'Low', summary.lowCount)}
    </Stack>
  );
}
