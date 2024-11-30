'use client';

import dynamic from 'next/dynamic';
import { DynamicLoading } from 'components/DynamicLoading';

export default dynamic(() => import('pageComponents/merge-tutorial'), {
  ssr: false,
  loading: () => <DynamicLoading />,
});
