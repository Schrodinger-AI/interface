import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { PageFrom } from './types';

export function usePageForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || PageFrom.ALL;

  const fromListAll = useMemo(() => {
    if (from !== PageFrom.ALL && from !== PageFrom.MY) {
      return true;
    }
    return from === PageFrom.ALL;
  }, [from]);

  return [fromListAll];
}
