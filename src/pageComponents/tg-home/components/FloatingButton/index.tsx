import { ReactComponent as CommunityIcon } from 'assets/img/community-icon.svg';
import { useCallback } from 'react';
import { useCmsInfo } from 'redux/hooks';

export default function FloatingButton() {
  const { tgCommunityUrl } = useCmsInfo() || {};

  const handleCommunity = useCallback(() => {
    tgCommunityUrl && window.open(tgCommunityUrl);
  }, [tgCommunityUrl]);

  return (
    <div
      className="fixed bottom-[88px] right-0 w-[42px] h-[32px] rounded-l-full bg-pixelsCardBg border border-dashed border-pixelsDashPurple z-10 tg-card-shadow flex justify-center items-center"
      onClick={handleCommunity}>
      <CommunityIcon />
    </div>
  );
}
