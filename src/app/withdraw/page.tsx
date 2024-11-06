'use client';

import dynamic from 'next/dynamic';
import { DynamicLoading } from 'components/DynamicLoading';

export default dynamic(() => import('pageComponents/withdraw'), {
  ssr: false,
  loading: () => <DynamicLoading />,
});
