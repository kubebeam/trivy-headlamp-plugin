import { Link as HeadlampLink } from '@kinvolk/headlamp-plugin/lib/CommonComponents';

export function makeNamespaceLink(namespace: string) {
  return (
    <HeadlampLink
      routeName="namespace"
      params={{
        name: namespace,
      }}
    >
      {namespace}
    </HeadlampLink>
  );
}
