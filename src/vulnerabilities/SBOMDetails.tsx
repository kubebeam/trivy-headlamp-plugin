import {
  NameValueTable,
  SectionBox,
  Table as HeadlampTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { useState } from 'react';
import { getURLSegments } from '../common/url';
import { sbomreportClass } from '../model';
import { SbomReport } from '../types/SbomReport';
import { SbomReportReportComponentsComponents } from '../types/SbomReportReportComponentsComponents';

export function SbomReportDetails() {
  const [name, namespace] = getURLSegments(-1, -2);

  const [sbomReportObject, setSbomReportObject] = useState<KubeObject>(null);

  sbomreportClass.useApiGet(setSbomReportObject, name, namespace);

  if (!sbomReportObject) {
    return <div></div>;
  }

  const sbomReport: SbomReport = sbomReportObject.jsonData;

  return (
    <>
      <SectionBox title="SBOM">
        <NameValueTable
          rows={[
            {
              name: 'Name',
              value: sbomReport.metadata.name,
            },
            {
              name: 'Digest',
              value: sbomReport.report?.artifact.digest,
            },
            {
              name: 'Repository',
              value: sbomReport.report?.artifact.repository,
            },
            {
              name: 'Tag',
              value: sbomReport.report?.artifact.tag,
            },
            {
              name: 'Registry',
              value: sbomReport.report?.registry?.server,
            },
            {
              name: 'Components',
              value: String(sbomReport.report.summary.componentsCount),
            },
          ]}
        />
      </SectionBox>
      <Components sbomReport={sbomReport} />
    </>
  );
}

function Components(props: { sbomReport: SbomReport }) {
  const { sbomReport } = props;

  return (
    <>
      <SectionBox title="Components">
        <HeadlampTable
          data={sbomReport.report.components.components}
          columns={[
            {
              header: 'Package',
              accessorKey: 'purl',
            },
            {
              header: 'Name',
              accessorKey: 'name',
            },
            {
              header: 'Version',
              accessorKey: 'version',
            },
            {
              header: 'Type',
              accessorKey: 'type',
            },
            {
              header: 'Language',
              accessorKey: 'language',
            },
            {
              header: 'Licenses',
              accessorFn: (component: SbomReportReportComponentsComponents) => {
                return component.licenses?.map(element => element.license?.name).join(', ');
              },
              gridTemplate: 0.5,
            },
          ]}
        />
      </SectionBox>
    </>
  );
}
