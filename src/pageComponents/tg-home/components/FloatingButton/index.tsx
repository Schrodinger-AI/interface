import { ReactComponent as CommunityIcon } from 'assets/img/telegram/community-icon.svg';
import { useCallback } from 'react';
import { useCmsInfo } from 'redux/hooks';

export default function FloatingButton() {
  const { tgCommunityUrl } = useCmsInfo() || {};

  const handleCommunity = useCallback(() => {
    tgCommunityUrl && window.open(tgCommunityUrl);
  }, [tgCommunityUrl]);

  return (
    <div
      className="fixed bottom-[140px] right-0 w-[34px] h-[34px] z-10 flex justify-center items-center"
      onClick={handleCommunity}>
      <CommunityIcon />
    </div>
  );
}
