import { Tabs as HeadlampTabs } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { ClusterComplianceReportList } from './ClusterComplianceList';
import { ConfigAuditReportList } from './ConfigAuditList';
import { ExposedSecretList } from './ExposedSecretList';

export function Compliance() {
  return (
    <>
      <h1>Compliance</h1>
      <HeadlampTabs
        tabs={[
          {
            label: 'Cluster',
            component: <ClusterComplianceReportList />,
          },
          {
            label: 'Resources',
            component: <ConfigAuditReportList />,
          },
          {
            label: 'Secrets',
            component: <ExposedSecretList />,
          },
        ]}
        ariaLabel="Navigation Tabs"
      />
    </>
  );
}
