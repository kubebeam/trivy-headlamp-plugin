import { makeCustomResourceClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/crd';

const apiAquaGroupVersion = [{ group: 'aquasecurity.github.io', version: 'v1alpha1' }];

export const clustercompliancereportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clustercompliancereport',
  pluralName: 'clustercompliancereports',
});

export const clusterconfigauditreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clusterconfigauditreport',
  pluralName: 'clusterconfigauditreports',
});

export const clusterinfraassessmentreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clusterinfraassessmentreport',
  pluralName: 'clusterinfraassessmentreports',
});

export const clusterrbacassessmentreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clusterrbacassessmentreport',
  pluralName: 'clusterrbacassessmentreports',
});

export const clustersbomreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clustersbomreport',
  pluralName: 'clustersbomreports',
});

export const clustervulnerabilityreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: false,
  singularName: 'clustervulnerabilityreport',
  pluralName: 'clustervulnerabilityreports',
});

export const configauditreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'configauditreport',
  pluralName: 'configauditreports',
});

export const exposedsecretreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'exposedsecretreport',
  pluralName: 'exposedsecretreports',
});

export const infraassessmentreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'infraassessmentreport',
  pluralName: 'infraassessmentreports',
});

export const rbacassessmentreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'rbacassessmentreport',
  pluralName: 'rbacassessmentreports',
});

export const sbomreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'sbomreport',
  pluralName: 'sbomreports',
});

export const vulnerabilityreportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'vulnerabilityreport',
  pluralName: 'vulnerabilityreports',
});
