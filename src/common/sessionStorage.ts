import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export enum TrivySessionSettings {
  ComplianceTab = 'trivy.complianceTab',
  VulnerabilityTab = 'trivy.vulnerabilityTab',
  FailedControls = 'trivy.failedControls',
}

export function useSessionStorage<T>(
  key: string,
  defaultValue: any
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    return getSessionStorageValue(key, defaultValue);
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function getSessionStorageValue(key: string, defaultValue: any) {
  const saved = sessionStorage.getItem(key);
  if (saved) {
    return JSON.parse(saved);
  }
  return defaultValue;
}
