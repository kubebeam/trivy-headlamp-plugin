import { registerRoute, registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';

export namespace RoutingPath {
  export const TrivyVulnerabilityReportDetails = '/trivy/vulnerabilityreports/:namespace/:name';
}

// Trivy main sidebar
registerSidebarEntry({
  parent: null,
  name: 'trivy',
  label: 'Trivy',
  icon: 'mdi:yeast',
  url: '/trivy/vulnerabilities',
});

registerSidebarEntry({
  parent: 'trivy',
  name: 'trivy-vulnerabilities',
  label: 'Vulnerabilities',
  url: '/trivy/vulnerabilities',
});

import TrivyVulnerabilityList from './vulnerabilities/Vulnerabilities';

registerRoute({
  path: '/trivy/vulnerabilities',
  parent: 'trivy',
  sidebar: 'trivy-vulnerabilities',
  component: () => <TrivyVulnerabilityList />,
  exact: true,
  name: 'Vulnerabilities',
});

import TrivyVulnerabilityReportDetails from './vulnerabilities/WorkloadDetails';

registerRoute({
  path: RoutingPath.TrivyVulnerabilityReportDetails,
  parent: 'trivy',
  sidebar: 'trivy-vulnerabilities',
  component: () => <TrivyVulnerabilityReportDetails />,
  exact: true,
  name: 'Vulnerability Report',
});
