import { makeCustomResourceClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/crd';

const apiAquaGroupVersion = [{ group: 'aquasecurity.github.io', version: 'v1alpha1' }];

export const vulnerabilityReportClass = makeCustomResourceClass({
  apiInfo: apiAquaGroupVersion,
  isNamespaced: true,
  singularName: 'vulnerabilityreport',
  pluralName: 'vulnerabilityreports',
});
