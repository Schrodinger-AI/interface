'use client';

import dynamic from 'next/dynamic';
export default dynamic(() => import('pageComponents/tg-battle'), { ssr: false });
