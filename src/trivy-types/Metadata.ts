export interface StringDict {
  [key: string]: string;
}

export interface Metadata {
  creationTimestamp: string;
  name: string;
  namespace: string;
  annotations: StringDict;
  labels: StringDict;

  ownerReferences: OwnerReference[];
}

export interface OwnerReference {
  apiVersion: string;
  kind: string;
  name: string;
}
