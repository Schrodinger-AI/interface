'use client';

import dynamic from 'next/dynamic';
export default dynamic(() => import('pageComponents/cats-leader-board'), { ssr: false });
