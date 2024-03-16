import { useInitData } from 'hooks/useInitData';
import { useRedirect } from 'hooks/useRedirect';

export const Updater = ({ children }: { children: React.ReactNode }) => {
  useInitData();
  useRedirect();
  return <>{children}</>;
};
