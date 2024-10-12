import {
  NameValueTable,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { useState } from 'react';
import { getURLSegments } from '../common/url';
import { exposedsecretreportClass } from '../model';
import { ExposedSecretReport } from '../types/ExposedSecretReport';

export function ExposedSecretDetails() {
  const [name, namespace] = getURLSegments(-1, -2);

  const [exposedSecretObject, setExposedSecretObject] = useState<KubeObject>(null);

  exposedsecretreportClass.useApiGet(setExposedSecretObject, name, namespace);

  if (!exposedSecretObject) {
    return <div></div>;
  }

  const exposedSecretReport: ExposedSecretReport = exposedSecretObject.jsonData;

  return (
    <>
      <SectionBox title="Exposed Secret">
        <NameValueTable
          rows={[
            {
              name: 'Name',
              value: exposedSecretReport.metadata.labels['trivy-operator.resource.name'],
            },
            {
              name: 'Container',
              value: exposedSecretReport.metadata.labels['trivy-operator.container.name'],
            },
            {
              name: 'Kind',
              value: exposedSecretReport.metadata.labels['trivy-operator.resource.kind'],
            },
            {
              name: 'Namespace',
              value: exposedSecretReport.metadata.labels['trivy-operator.resource.namespace'],
            },
            {
              name: 'Report',
              value: exposedSecretReport.metadata.name,
            },
            {
              name: 'Digest',
              value: exposedSecretReport.report?.artifact.digest,
            },
            {
              name: 'Repository',
              value: exposedSecretReport.report?.artifact.repository,
            },
            {
              name: 'Tag',
              value: exposedSecretReport.report?.artifact.tag,
            },
            {
              name: 'Registry',
              value: exposedSecretReport.report?.registry?.server,
            },
          ]}
        />
      </SectionBox>
      <Secrets exposedSecretReport={exposedSecretReport} />
    </>
  );
}

function Secrets(props: { exposedSecretReport: ExposedSecretReport }) {
  const { exposedSecretReport } = props;

  return (
    <>
      <SectionBox title="Secrets">
        <HeadlampTable
          data={exposedSecretReport.report.secrets}
          columns={[
            {
              header: 'Rule ID',
              accessorKey: 'ruleID',
            },
            {
              header: 'Category',
              accessorKey: 'category',
            },
            {
              header: 'Severity',
              accessorKey: 'severity',
              gridTemplate: 'min-content',
            },
            {
              header: 'Target',
              accessorKey: 'target',
            },
            {
              header: 'Title',
              accessorKey: 'title',
            },
          ]}
        />
      </SectionBox>
    </>
  );
}
