import { Tabs as HeadlampTabs } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { TrivySessionSettings, useSessionStorage } from '../common/sessionStorage';
import { ClusterComplianceReportList } from './ClusterComplianceList';
import { ConfigAuditReportList } from './ConfigAuditList';
import { ExposedSecretList } from './ExposedSecretList';
import { InfraAssessmentReportList } from './InfraAssessmentList';
import { RbacAssessmentReportList } from './RbacAssessmentList';

export function Compliance() {
  const [selectedTab, setSelectedTab] = useSessionStorage<number>(
    TrivySessionSettings.ComplianceTab,
    0
  );
  return (
    <>
      <h1>Compliance</h1>
      <HeadlampTabs
        defaultIndex={selectedTab}
        onTabChanged={tabIndex => setSelectedTab(tabIndex)}
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
