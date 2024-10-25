'use client';

import { DynamicLoading } from 'components/DynamicLoading';
import dynamic from 'next/dynamic';

export default dynamic(() => import('pageComponents/lucky-spin'), {
  ssr: false,
  loading: () => <DynamicLoading />,
});
