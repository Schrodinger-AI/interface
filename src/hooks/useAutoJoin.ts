import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NotNeedAutoJoinPath = ['/invitee'];

export default function useAutoJoin() {
  const [notAutoJoin, setNotAutoJoin] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const path = '/' + pathname.split('/')[1];
    setNotAutoJoin(NotNeedAutoJoinPath.includes(path));
  }, [pathname]);

  return [notAutoJoin];
}
