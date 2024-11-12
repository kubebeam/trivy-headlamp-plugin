/* 
  Build a horizontack stack with seperate cells for critical, high, medium, low, none and unknown. 
*/
import { Box, Stack, Tooltip } from '@mui/material';
import { VulnerabilityReport } from '../types/VulnerabilityReport';

export function getCVESummary(vulnerabilityReport: VulnerabilityReport) {
  const summary = vulnerabilityReport.report.summary;

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
      {box('darkgray', 'None', summary.noneCount ?? 0)}
      {box('lightgray', 'Unknown', summary.unknownCount)}
    </Stack>
  );
}
