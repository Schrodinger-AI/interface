'use client';

import dynamic from 'next/dynamic';
import { DynamicLoading } from 'components/DynamicLoading';

export default dynamic(() => import('pageComponents/tg-weekly-activity-rankings'), {
  ssr: false,
  loading: () => <DynamicLoading />,
});
