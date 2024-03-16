import { useCallback } from 'react';
import { windowOpen } from 'utils/common';

export function useWindowOpen(url: string, target?: string) {
  const open = useCallback(() => windowOpen(url, target), [target, url]);
  return open;
}
