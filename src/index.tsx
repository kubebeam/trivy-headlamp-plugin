import { registerRoute, registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';

export namespace RoutingPath {
  export const TrivyVulnerabilityReportDetails = '/trivy/vulnerabilityreports/:namespace/:name';
  export const Compliance = '/trivy/compliance';
  export const ClusterComplianceReportDetail = '/trivy/clustercompliance/:name';
  export const ConfigAuditReportList = '/trivy/configaudit';
  export const ConfigAuditReportDetail = '/trivy/configaudit/:namespace/:name';
  export const SbomReportList = '/trivy/sbom';
  export const SbomReportDetail = '/trivy/sbom/:namespace/:name';
  export const ExposedSecretDetails = '/trivy/secrets/:namespace/:name';
  export const ExposedSecretList = '/trivy/secrets';
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
  name: 'trivy-compliance',
  label: 'Compliance',
  url: RoutingPath.Compliance,
});

registerSidebarEntry({
  parent: 'trivy',
  name: 'trivy-vulnerabilities',
  label: 'Vulnerabilities',
  url: '/trivy/vulnerabilities',
});

import { Compliance } from './compliance/Compliance';

registerRoute({
  path: RoutingPath.Compliance,
  parent: 'trivy',
  sidebar: 'trivy-compliance',
  component: () => <Compliance />,
  exact: true,
  name: 'Compliance',
});

import { VulnerabilityList } from './vulnerabilities/Vulnerabilities';

registerRoute({
  path: '/trivy/vulnerabilities',
  parent: 'trivy',
  sidebar: 'trivy-vulnerabilities',
  component: () => <VulnerabilityList />,
  exact: true,
  name: 'Vulnerabilities',
});

import { VulnerabilityReportDetails } from './vulnerabilities/WorkloadDetails';

registerRoute({
  path: RoutingPath.TrivyVulnerabilityReportDetails,
  parent: 'trivy',
  sidebar: 'trivy-vulnerabilities',
  component: () => <VulnerabilityReportDetails />,
  exact: true,
  name: 'Vulnerability Report',
});

import { ClusterComplianceDetails } from './compliance/ClusterComplianceDetails';

registerRoute({
  path: RoutingPath.ClusterComplianceReportDetail,
  parent: 'trivy',
  sidebar: 'trivy-compliance',
  component: () => <ClusterComplianceDetails />,
  exact: true,
  name: 'Cluster Compliance',
});

import { ConfigAuditReportDetails } from './compliance/ConfigAuditDetails';

registerRoute({
  path: RoutingPath.ConfigAuditReportDetail,
  parent: 'trivy',
  sidebar: 'trivy-configaudit',
  component: () => <ConfigAuditReportDetails />,
  exact: true,
  name: 'Config Audit',
});

import { SbomReportDetails } from './vulnerabilities/SBOMDetails';

registerRoute({
  path: RoutingPath.SbomReportDetail,
  parent: 'trivy',
  sidebar: 'trivy-sbom',
  component: () => <SbomReportDetails />,
  exact: true,
  name: 'SBOM list',
});

import { ExposedSecretDetails } from './compliance/ExposedSecretDetails';

registerRoute({
  path: RoutingPath.ExposedSecretDetails,
  parent: 'trivy',
  sidebar: 'trivy-sbom',
  component: () => <ExposedSecretDetails />,
  exact: true,
  name: 'Exposed Secret',
});
