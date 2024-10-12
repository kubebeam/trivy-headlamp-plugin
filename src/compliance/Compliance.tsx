import { Tabs as HeadlampTabs } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { ClusterComplianceReportList } from './ClusterComplianceList';
import { ConfigAuditReportList } from './ConfigAuditList';
import { ExposedSecretList } from './ExposedSecretList';
import { InfraAssessmentReportList } from './InfraAssessmentList';
import { RbacAssessmentReportList } from './RbacAssessmentList';

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
            label: 'Infra',
            component: <InfraAssessmentReportList />,
          },
          {
            label: 'Resources',
            component: <ConfigAuditReportList />,
          },
          {
            label: 'RBAC',
            component: <RbacAssessmentReportList />,
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
