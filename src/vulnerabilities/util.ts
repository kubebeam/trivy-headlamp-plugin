import { VulnerabilityReport } from '../types/VulnerabilityReport';

export function getImage(vulnerabilityReport: VulnerabilityReport): string {
  const registry =
    vulnerabilityReport.report.registry?.server === 'index.docker.io'
      ? ''
      : vulnerabilityReport.report.registry?.server + '/';

  return `${registry}${vulnerabilityReport.report.artifact.repository}:${vulnerabilityReport.report.artifact.tag}`;
}
