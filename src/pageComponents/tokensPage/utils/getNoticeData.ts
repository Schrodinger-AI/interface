import { IScrollAlertItem } from 'components/ScrollAlert';
import { TCustomizationItemType, TGlobalConfigType } from 'redux/types/reducerTypes';
import { openExternalLink } from 'utils/openlink';

const onJump = (symbol: string, cmsInfo?: TCustomizationItemType & TGlobalConfigType) => {
  const forestUrl = cmsInfo?.forestUrl || '';

  openExternalLink(`${forestUrl}/detail/buy/${cmsInfo?.curChain}-${symbol}/${cmsInfo?.curChain}`, '_blank');
};

export const getNoticeData: (cmsInfo?: TCustomizationItemType & TGlobalConfigType) => IScrollAlertItem[] = (
  cmsInfo?: TCustomizationItemType & TGlobalConfigType,
) => {
  try {
    return [
      {
        text: 'ELF_rA2p...NHXF_tDVW 100 SGRTEST-8425GEN9 with 300ELF',
        handle: () => onJump('SGRTEST-7536', cmsInfo),
      },
      {
        text: 'ELF_rA2p...NHXF_tDVW 200 SGRTEST-8425GEN9 with 300ELF',
        handle: () => onJump('SGRTEST-7536', cmsInfo),
      },
      {
        text: 'ELF_rA2p...NHXF_tDVW 300 SGRTEST-8425GEN9 with 300ELF',
        handle: () => onJump('SGRTEST-7536', cmsInfo),
      },
      {
        text: 'ELF_rA2p...NHXF_tDVW 400 SGRTEST-8425GEN9 with 300ELF',
        handle: () => onJump('SGRTEST-7536', cmsInfo),
      },
    ];
  } catch (error) {
    return [];
  }
};
