import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { Button } from 'aelf-design';
import { TBuyType } from 'hooks/useBuyToken';
import { useRouter } from 'next/navigation';
import { BUY_ELF_URL, BUY_SGR_URL, SWAP_BUY_ELF_URL, SWAP_BUY_SGR_URL } from 'constants/router';
import { useCmsInfo } from 'redux/hooks';

function PurchaseMethodModal({
  type,
  closable = true,
  theme = 'light',
  sgrBalance = '',
  elfBalance = '',
  hideSwap = false,
  hideTutorial = false,
  defaultDescription = [],
  onCancel,
  onConfirmCallback,
}: {
  type: TBuyType;
  closable?: boolean;
  theme?: TModalTheme;
  sgrBalance?: string;
  elfBalance?: string;
  hideSwap?: boolean;
  hideTutorial?: boolean;
  defaultDescription?: string[];
  onCancel?: () => void;
  onConfirmCallback?: () => void;
}) {
  const modal = useModal();
  const router = useRouter();
  const cmsInfo = useCmsInfo();

  const { buyTokenModal } = cmsInfo || {};

  const curText = useMemo(() => {
    if (buyTokenModal) {
      return buyTokenModal[type];
    }
    return undefined;
  }, [buyTokenModal, type]);

  const onETransferClick = useCallback(() => {
    modal.hide();
    router.push(type === 'buySGR' ? BUY_SGR_URL : BUY_ELF_URL);
    onConfirmCallback && onConfirmCallback();
  }, [modal, onConfirmCallback, router, type]);

  const onSwapClick = useCallback(() => {
    modal.hide();
    router.push(type === 'buySGR' ? SWAP_BUY_SGR_URL : SWAP_BUY_ELF_URL);
    onConfirmCallback && onConfirmCallback();
  }, [modal, onConfirmCallback, router, type]);

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const confirmBtn = useMemo(
    () => (
      <div className="w-full flex justify-center">
        <Button
          className={clsx(
            'flex-1 lg:flex-none lg:w-[187px] !rounded-lg border-brandDefault text-brandDefault',
            isDark
              ? 'default-button-dark !rounded-none hover:!bg-pixelsPageBg hover:!text-pixelsWhiteBg hover:!border-pixelsPrimaryTextPurple  active:!bg-pixelsPageBg active:!text-pixelsWhiteBg active:!border-pixelsPrimaryTextPurple'
              : '',
          )}
          onClick={onETransferClick}
          type="default">
          Deposit USDT
        </Button>
        {!hideSwap ? (
          <Button
            className={clsx(
              'flex-1 lg:flex-none lg:w-[187px] !rounded-lg  ml-[16px]',
              isDark
                ? 'primary-button-dark !rounded-none hover:!bg-pixelsCardBg hover:!text-pixelsWhiteBg hover:!border-pixelsPrimaryTextPurple active:!bg-pixelsCardBg active:!text-pixelsWhiteBg active:!border-pixelsPrimaryTextPurple'
                : '',
            )}
            onClick={onSwapClick}
            type="primary">
            {type === 'buyELF' ? 'Swap from $SGR' : 'Swap from $ELF'}
          </Button>
        ) : null}
      </div>
    ),
    [hideSwap, isDark, onETransferClick, onSwapClick, type],
  );

  const onClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      modal.hide();
    }
  };

  const description = useMemo(() => {
    if (defaultDescription && defaultDescription.length) {
      return defaultDescription;
    } else {
      return curText?.description;
    }
  }, [curText?.description, defaultDescription]);

  return (
    <CommonModal
      centered
      open={modal.visible}
      closable={closable}
      maskClosable={true}
      onCancel={onClose}
      width={438}
      afterClose={modal.remove}
      theme={theme}
      disableMobileLayout={true}
      title={curText?.title}
      footer={confirmBtn}>
      <div>
        {description?.length
          ? description.map((item, index) => {
              return (
                <p
                  key={index}
                  className={clsx('text-sm mb-[4px] last:mb-0', isDark ? 'text-pixelsDivider' : 'text-neutralPrimary')}>
                  {item}
                </p>
              );
            })
          : null}
        {!hideTutorial && curText?.tutorial ? (
          <div className="mt-[24px]">
            <p className={clsx('text-sm', isDark ? 'text-pixelsTertiaryTextPurple' : 'text-neutralPrimary')}>
              {curText.tutorial.title}
            </p>
            {curText.tutorial.rules.length ? (
              <div className="mt-[4px]">
                {curText.tutorial.rules.map((item, index) => {
                  return (
                    <div className="flex mt-[4px]" key={index}>
                      <div className="p-[3px]">
                        <span
                          className={clsx(
                            'flex items-center justify-center text-xs font-semibold w-[16px] h-[16px] rounded-md mr-[10px]',
                            isDark
                              ? 'text-pixelsTertiaryTextPurple bg-pixelsPrimaryTextPurple'
                              : 'text-brandDefault bg-brandBg',
                          )}>
                          {index + 1}
                        </span>
                      </div>

                      <p
                        key={index}
                        className={clsx(
                          'flex-1 text-sm mb-[4px] last:mb-0',
                          isDark ? 'text-pixelsTertiaryTextPurple' : 'text-neutralPrimary',
                        )}>
                        {item}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        <div
          className={clsx(
            'mt-[24px] p-[16px] flex justify-between text-base font-medium',
            isDark
              ? 'rounded-none bg-pixelsPageBg text-pixelsWhiteBg'
              : 'rounded-lg bg-neutralHoverBg text-neutralTitle',
          )}>
          <p>Balance</p>
          <div>
            <p className="text-right">{sgrBalance} SGR</p>
            <p className="mt-[8px] text-right">{elfBalance} ELF</p>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(PurchaseMethodModal);
