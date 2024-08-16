'use client';

import dynamic from 'next/dynamic';
import { DynamicLoading } from 'components/DynamicLoading';

export default dynamic(() => import('pageComponents/summaryPoints'), { ssr: false, loading: () => <DynamicLoading /> });
