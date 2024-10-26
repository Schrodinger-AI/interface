'use client';

import { DynamicLoading } from 'components/DynamicLoading';
import dynamic from 'next/dynamic';

export default dynamic(() => import('pageComponents/tg-bags'), {
  ssr: false,
  loading: () => <DynamicLoading />,
});
