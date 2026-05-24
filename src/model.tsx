import { makeCustomResourceClass } from '@kinvolk/headlamp-plugin/lib/k8s/crd';

const apiAquaGroupVersion = [{ group: 'aquasecurity.github.io', version: 'v1alpha1' }];

export const clustercompliancereportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clustercompliancereport',
  pluralName: 'clustercompliancereports',
  kind: 'ClusterComplianceReport',
  customResourceDefinition: undefined as any,
});

export const clusterconfigauditreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clusterconfigauditreport',
  pluralName: 'clusterconfigauditreports',
  kind: 'ClusterConfigAuditReport',
  customResourceDefinition: undefined as any,
});

export const clusterinfraassessmentreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clusterinfraassessmentreport',
  pluralName: 'clusterinfraassessmentreports',
  kind: 'ClusterInfraAssessmentReport',
  customResourceDefinition: undefined as any,
});

export const clusterrbacassessmentreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clusterrbacassessmentreport',
  pluralName: 'clusterrbacassessmentreports',
  kind: 'ClusterRbacAssessmentReport',
  customResourceDefinition: undefined as any,
});

export const clustersbomreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clustersbomreport',
  pluralName: 'clustersbomreports',
  kind: 'ClusterSbomReport',
  customResourceDefinition: undefined as any,
});

export const clustervulnerabilityreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clustervulnerabilityreport',
  pluralName: 'clustervulnerabilityreports',
  kind: 'ClusterVulnerabilityReport',
  customResourceDefinition: undefined as any,
});

export const configauditreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'configauditreport',
  pluralName: 'configauditreports',
  kind: 'ConfigAuditReport',
  customResourceDefinition: undefined as any,
});

export const exposedsecretreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'exposedsecretreport',
  pluralName: 'exposedsecretreports',
  kind: 'ExposedSecretReport',
  customResourceDefinition: undefined as any,
});

export const infraassessmentreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'infraassessmentreport',
  pluralName: 'infraassessmentreports',
  kind: 'InfraAssessmentReport',
  customResourceDefinition: undefined as any,
});

export const rbacassessmentreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'rbacassessmentreport',
  pluralName: 'rbacassessmentreports',
  kind: 'RbacAssessmentReport',
  customResourceDefinition: undefined as any,
});

export const sbomreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'sbomreport',
  pluralName: 'sbomreports',
  kind: 'SbomReport',
  customResourceDefinition: undefined as any,
});

export const vulnerabilityreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'vulnerabilityreport',
  pluralName: 'vulnerabilityreports',
  kind: 'VulnerabilityReport',
  customResourceDefinition: undefined as any,
});
