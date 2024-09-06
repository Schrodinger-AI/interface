'use client';

import dynamic from 'next/dynamic';
import { DynamicLoading } from 'components/DynamicLoading';

export default dynamic(() => import('pageComponents/awaken-swap'), {
  ssr: false,
  loading: () => <DynamicLoading />,
});
