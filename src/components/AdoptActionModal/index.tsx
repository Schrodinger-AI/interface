import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import Balance from 'components/Balance';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import InfoCard, { IInfoCard } from 'components/InfoCard';
import { ISGRAmountInputProps } from 'components/SGRAmountInput';
import { DEFAULT_TOKEN_SYMBOL } from 'constants/assets';
import { ONE, ZERO } from 'constants/misc';
import { useTokenPrice, useTxFee } from 'hooks/useAssets';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import {
  ADOPT_NEXT_MIN,
  ADOPT_NEXT_RATE,
  DIRECT_ADOPT_GEN9_INIT,
  DIRECT_ADOPT_GEN9_MIN,
  DIRECT_ADOPT_GEN9_RATE,
} from 'constants/common';
import { getOriginSymbol } from 'utils';
import { renameSymbol } from 'utils/renameSymbol';
import { clsx } from 'clsx';
import message from 'antd/lib/message';
import BigNumber from 'bignumber.js';

export type TBalanceItem = {
  amount: string;
  suffix: string;
  usd: string;
};

export type TAdoptActionModalProps = {
  modalTitle?: string;
  modalSubTitle?: string;
  isDirect?: boolean;
  disableInput?: boolean;
  info: IInfoCard;
  onClose?: <T>(params?: T) => void;
  onConfirm?: (amount: string) => void;
  balanceList?: TBalanceItem[];
  inputProps?: ISGRAmountInputProps;
  isReset?: boolean;
  theme?: TModalTheme;
  isBlind?: boolean;
};

function AdoptActionModal(params: TAdoptActionModalProps) {
  const modal = useModal();
  const {
    modalTitle,
    modalSubTitle,
    info,
    onClose,
    isDirect,
    onConfirm: onConfirmProps,
    balanceList,
    inputProps,
    isReset = false,
    theme = 'light',
    isBlind = false,
  } = params;

  const onCancel = useCallback(() => {
    if (onClose) {
      onClose();
      return;
    }
    modal.hide();
  }, [modal, onClose]);

  const { txFee } = useTxFee();
  const { tokenPrice } = useTokenPrice();
  const [amount] = useState<string>(isBlind ? `${inputProps?.max}` : isDirect ? `${DIRECT_ADOPT_GEN9_MIN}` : '');

  const onConfirm = useCallback(() => {
    if (inputProps?.max && BigNumber(amount).gt(inputProps?.max)) {
      message.warning(
        `Insufficient Funds, you have less than ${DIRECT_ADOPT_GEN9_MIN} $SGR. Please go back to the homepage and deposit more SGR to continue.`,
      );
      return;
    }

    if (inputProps?.max && BigNumber(amount).eq(inputProps?.max)) {
      if (isDirect && !isReset && DIRECT_ADOPT_GEN9_RATE.times(amount).lt(ONE)) {
        message.warning(
          `Insufficient balance, you need at least ${DIRECT_ADOPT_GEN9_MIN} $SGR to adopt 1 9th-Gen cat, `,
        );
        return;
      }
      if (!isReset && ADOPT_NEXT_RATE.times(amount).lt(ONE)) {
        message.warning(`Insufficient balance, you need at least ${ADOPT_NEXT_MIN} $SGR to adopt 1 next-Gen cat, `);
        return;
      }
    }

    if (isDirect && !isReset && DIRECT_ADOPT_GEN9_RATE.times(amount).lt(ONE)) {
      message.warning(
        `Please enter at least ${DIRECT_ADOPT_GEN9_MIN} SGR to ensure you can receive 1 9th-gen cat with one click.`,
      );
      return;
    }

    if (!isReset && ADOPT_NEXT_RATE.times(amount).lt(ONE)) {
      message.warning(`Please enter at least ${ADOPT_NEXT_MIN} to ensure you can receive at least 1 next-gen cat.`);
      return;
    }

    onConfirmProps && onConfirmProps(amount);
  }, [amount, inputProps?.max, isDirect, isReset, onConfirmProps]);

  const receiveToken = useMemo(() => {
    if (amount === '') return '--';
    const amountNumber = ZERO.plus(amount);
    if (amountNumber.eq(ZERO)) return '--';
    if (isReset) return amount;
    const rate = isDirect ? DIRECT_ADOPT_GEN9_RATE : ADOPT_NEXT_RATE;
    return ZERO.plus(amountNumber.multipliedBy(rate).toFixed(8)).toFixed();
  }, [amount, isDirect, isReset]);

  const priceAmount = useMemo(() => {
    if (!tokenPrice) return '0';
    return ZERO.plus(txFee).multipliedBy(tokenPrice).toFixed(4);
  }, [tokenPrice, txFee]);

  const rateValue = useMemo(() => {
    if (isReset) return `Reroll 1 ${info.name} receive 0.5 ${renameSymbol(getOriginSymbol(info.name))}`;
    return isDirect
      ? `Consume ${DIRECT_ADOPT_GEN9_INIT} - ${DIRECT_ADOPT_GEN9_MIN} $SGR to adopt one 9th-Gen cat`
      : `Consume ${ADOPT_NEXT_MIN} ${info.name} to adopt 1 next-gen cat `;
  }, [info.name, isDirect, isReset]);

  const inputTitle = useMemo(() => {
    if (isReset) return 'Reroll Amount';
    return 'Consume Amount';
  }, [isReset]);

  const rateLabel = useMemo(() => {
    if (isReset) return 'Rate';
    return 'Adoption Fee Rate';
  }, [isReset]);

  const receiveLabel = useMemo(() => {
    if (isReset) return 'Ets. Receive Token';
    return 'Amount to Be Received';
  }, [isReset]);

  const confirmBtn = useMemo(
    () => (
      <Button
        className={clsx('md:w-[356px]', theme === 'dark' ? '!primary-button-dark' : '')}
        onClick={() => onConfirm?.()}
        type="primary">
        {isReset ? 'Reroll' : 'Adopt'}
      </Button>
    ),
    [isReset, onConfirm, theme],
  );

  const renderList = useCallback(
    ({ title, content, children }: { title: string; content?: string; children?: ReactNode }) => {
      return (
        <div className="flex flex-col lg:flex-row justify-between mb-[16px]">
          <span className={clsx(theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary')}>{title}</span>
          {content ? (
            <span className={clsx('mt-[4px] lg:mt-0', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
              {content}
            </span>
          ) : null}
          {children ? children : null}
        </div>
      );
    },
    [theme],
  );

  return (
    <CommonModal
      title={modalTitle}
      open={modal.visible}
      onOk={() => onConfirmProps?.(amount)}
      onCancel={onCancel}
      afterClose={modal.remove}
      theme={theme}
      footer={confirmBtn}>
      {modalSubTitle ? (
        <div className={clsx('mb-[16px] text-sm', theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
          {modalSubTitle}
        </div>
      ) : null}
      <InfoCard {...info} theme={theme} />
      <div className="h-[32px]" />
      {renderList({
        title: inputTitle,
        content: isBlind ? `${inputProps?.max}` : isDirect ? `${DIRECT_ADOPT_GEN9_MIN}` : '',
      })}
      {renderList({
        title: receiveLabel,
        content: receiveToken,
      })}
      {renderList({
        title: rateLabel,
        content: rateValue,
      })}
      {!isReset &&
        renderList({
          title: 'Adoption Fee to Be Charged',
          content: '0.3 - 1.1 $SGR',
        })}

      {renderList({
        title: 'Transaction Fee',
        children: (
          <div className="flex flex-col items-start lg:items-end  mt-[4px] lg:mt-0">
            <span className={clsx(theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
              {txFee} {DEFAULT_TOKEN_SYMBOL}
            </span>
            {tokenPrice && (
              <span className={clsx('mt-[4px]', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralSecondary')}>
                $ {priceAmount}
              </span>
            )}
          </div>
        ),
      })}

      {balanceList && balanceList.length && <Balance theme={theme} items={balanceList} className="mt-[32px]" />}
    </CommonModal>
  );
}

export default NiceModal.create(AdoptActionModal);
