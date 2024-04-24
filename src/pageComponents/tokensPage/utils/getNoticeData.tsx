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
        text: (
          <span>
            ELF_rA2p...NHXF_tDVW <span className="text-warning600">100</span> SGRTEST-8425GEN9 with{' '}
            <span className="text-warning600">300ELF</span>
          </span>
        ),
        handle: () => onJump('SGRTEST-7536', cmsInfo),
      },
      {
        text: (
          <span>
            ELF_rA2p...NHXF_tDVW <span className="text-warning600">200</span> SGRTEST-8425GEN9 with{' '}
            <span className="text-warning600">300ELF</span>
          </span>
        ),
        handle: () => onJump('SGRTEST-7536', cmsInfo),
      },
      {
        text: (
          <span>
            ELF_rA2p...NHXF_tDVW <span className="text-warning600">300</span> SGRTEST-8425GEN9 with{' '}
            <span className="text-warning600">300ELF</span>
          </span>
        ),
        handle: () => onJump('SGRTEST-7536', cmsInfo),
      },
      {
        text: (
          <span>
            ELF_rA2p...NHXF_tDVW <span className="text-warning600">400</span> SGRTEST-8425GEN9 with{' '}
            <span className="text-warning600">300ELF</span>
          </span>
        ),
        handle: () => onJump('SGRTEST-7536', cmsInfo),
      },
    ];
  } catch (error) {
    return [];
  }
};
