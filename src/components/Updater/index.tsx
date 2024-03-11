import { useInitData } from 'hooks/useInitData';

export const Updater = ({ children }: { children: React.ReactNode }) => {
  useInitData();

  return <>{children}</>;
};
