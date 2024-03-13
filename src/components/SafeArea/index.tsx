import useSafeAreaHeight from 'hooks/useSafeAreaHeight';
import React from 'react';

export default function SafeArea({ children }: { children: React.ReactNode }) {
  const { topSafeHeight } = useSafeAreaHeight();
  return (
    <div className="h-full" style={{ paddingTop: topSafeHeight }}>
      {children}
    </div>
  );
}
