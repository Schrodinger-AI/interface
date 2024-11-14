import { ReactComponent as QuestionSVG } from 'assets/img/telegram/battle/icon_question.svg';
import { ReactComponent as QuestionLightSVG } from 'assets/img/breed/icon_question.svg';
import Countdown from 'antd/es/statistic/Countdown';
import { useMemo } from 'react';
import styles from './index.module.css';
import { ReactComponent as SGRSVG } from 'assets/img/telegram/breed/sgr.svg';
import clsx from 'clsx';

import { useModal } from '@ebay/nice-modal-react';
import RulesModal from '../RulesModal';
import { TModalTheme } from 'components/CommonModal';
import ScrollAlert from 'components/ScrollAlert';

function Rewards({
  countdown,
  onFinish,
  sgrAmount,
  usdtAmount,
  isOver = false,
  theme = 'light',
}: {
  countdown?: number;
  sgrAmount?: number | string;
  usdtAmount?: number | string;
  isOver?: boolean;
  onFinish?: () => void;
  theme?: TModalTheme;
}) {
  const rulesModal = useModal(RulesModal);
  const deadline = useMemo(() => {
    return countdown ? Date.now() + countdown * 1000 : 0;
  }, [countdown]);

  const format = useMemo(
    () =>
      countdown
        ? countdown > 60 * 60 * 24 * 2
          ? 'D [Days] HH:mm:ss'
          : countdown > 60 * 60 * 24
          ? 'D [Day] HH:mm:ss'
          : 'HH:mm:ss'
        : '--',
    [countdown],
  );

  const isDark = useMemo(() => theme === 'dark', [theme]);

  return (
    <div className="relative z-50 px-[16px]">
      <div className="w-full h-[32px] flex justify-center items-center relative px-[40px]">
        <span
          className={clsx(
            'text-base font-black',
            isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle flex items-center',
          )}>
          Prize Pool
          {isDark ? null : (
            <QuestionLightSVG
              className="ml-[8px]"
              onClick={() =>
                rulesModal.show({
                  theme,
                })
              }
            />
          )}
        </span>
        {isDark ? (
          <QuestionSVG
            className="absolute top-0 bottom-0 my-auto right-0 w-[32px] h-[32px]"
            onClick={() =>
              rulesModal.show({
                theme,
              })
            }
          />
        ) : null}
      </div>
      <div
        className={clsx(
          'mt-[7px] w-full p-[12px]',
          isDark ? 'shadow-tgModalShadow rounded-[8px]' : 'rounded-[12px] border border-solid border-neutralDivider',
          isDark ? styles['dark-card-bg'] : 'bg-white',
        )}>
        <ScrollAlert
          data={[
            {
              text: 'The first to own Gold III wins the entire Prize Pool!',
            },
          ]}
          theme={theme}
          type={isDark ? 'info' : 'notice'}
        />
        <div className="relative w-full flex justify-center items-center mt-[12px]">
          <span className={clsx('text-[38px]', isDark ? 'black-title' : 'text-neutralTitle')}>
            {sgrAmount ? sgrAmount : '--'}
          </span>
          {isDark ? (
            <SGRSVG className="absolute bottom-0 right-0" />
          ) : (
            <span className="absolute top-0 right-0 text-neutralPrimary font-medium text-sm h-full flex justify-center items-center">
              SGR
            </span>
          )}
        </div>
        <div className="mt-[10px] flex justify-between items-center">
          <div className="flex items-center">
            <span
              className={clsx(
                'text-xs font-semibold mr-[4px]',
                isDark ? 'text-pixelsWhiteBg' : 'text-neutralSecondary',
              )}>
              {isOver ? 'Ended' : 'Ends in:'}
            </span>
            {isOver ? null : (
              <Countdown
                className={clsx(styles.countdown, isDark ? styles['dark-countdown'] : '')}
                value={deadline}
                format={format}
                onFinish={() => onFinish?.()}
              />
            )}
          </div>

          <span className={clsx('text-xs font-semibold', isDark ? 'text-pixelsWhiteBg' : 'text-neutralSecondary')}>
            USDT value: {usdtAmount ? usdtAmount : '--'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Rewards;
