import { useLocation } from 'react-router';

export function getURLSegments(...indexes: number[]): string[] {
  const location = useLocation();
  const segments = location.pathname.split('/');

  return indexes.map(index => segments[segments.length + index]);
}

export function getLastURLSegment(): string {
  return getURLSegments(-1)[0];
}
