'use client';

import dynamic from 'next/dynamic';
import { DynamicLoading } from 'components/DynamicLoading';

export default dynamic(() => import('pageComponents/activity-detail-portkey'), {
  ssr: false,
  loading: () => <DynamicLoading />,
});
