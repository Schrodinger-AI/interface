import { message } from 'antd';
import useSafeAreaHeight from 'hooks/useSafeAreaHeight';
import { useEffect } from 'react';

export default function SafeArea({ children }: { children: React.ReactNode }) {
  const { topSafeHeight } = useSafeAreaHeight();

  useEffect(() => {
    message.config({
      top: 8 + Number(topSafeHeight || 0),
    });
  }, [topSafeHeight]);

  return (
    <div className="h-full" style={{ paddingTop: topSafeHeight }}>
      {children}
    </div>
  );
}
