'use client';

import dynamic from 'next/dynamic';
export default dynamic(() => import('pageComponents/tg-rules'), { ssr: false });
