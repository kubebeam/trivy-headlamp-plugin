import { Link as HeadlampLink } from '@kinvolk/headlamp-plugin/lib/CommonComponents';

export function makeNamespaceLink(namespace: string) {
  if (namespace && namespace.length > 0)
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
