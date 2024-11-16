import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import Balance from 'components/Balance';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import InfoCard, { IInfoCard } from 'components/InfoCard';
import SGRAmountInput, { ISGRAmountInputInterface, ISGRAmountInputProps } from 'components/SGRAmountInput';
import { DEFAULT_TOKEN_SYMBOL } from 'constants/assets';
import { ONE, ZERO } from 'constants/misc';
import { useTokenPrice, useTxFee } from 'hooks/useAssets';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as InfoSVG } from 'assets/img/icons/info.svg';
import { ReactComponent as ExclamationCircleSVG } from 'assets/img/pixelsIcon/exclamationCircle.svg';
import BigNumber from 'bignumber.js';
import AdoptRulesModal from 'components/AdoptRulesModal';
import { ADOPT_NEXT_MIN, ADOPT_NEXT_RATE, DIRECT_ADOPT_GEN9_MIN, DIRECT_ADOPT_GEN9_RATE } from 'constants/common';
import { getOriginSymbol } from 'utils';
import { renameSymbol } from 'utils/renameSymbol';
import { clsx } from 'clsx';

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
  const adoptRulesModal = useModal(AdoptRulesModal);
  const {
    modalTitle,
    modalSubTitle,
    info,
    onClose,
    isDirect,
    disableInput = false,
    onConfirm: onConfirmProps,
    balanceList,
    inputProps,
    isReset = false,
    theme = 'light',
    isBlind = false,
  } = params;
  const sgrAmountInputRef = useRef<ISGRAmountInputInterface>();

  const onCancel = useCallback(() => {
    if (onClose) {
      onClose();
      return;
    }
    modal.hide();
  }, [modal, onClose]);

  const { txFee } = useTxFee();
  const { tokenPrice } = useTokenPrice();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showBuy, setShowBuy] = useState<boolean>(false);

  const [isInvalid, setIsInvalid] = useState(true);
  const isInvalidRef = useRef(isInvalid);
  isInvalidRef.current = isInvalid;
  const onConfirm = useCallback(() => {
    if (isInvalidRef.current) return;
    const sgrAmountInput = sgrAmountInputRef.current;
    if (!sgrAmountInput) return;
    const amount = sgrAmountInput.getAmount();

    if (inputProps?.max && BigNumber(amount).gt(inputProps?.max)) {
      setErrorMessage('Insufficient funds. ');
      setShowBuy(true);
      return;
    }

    if (inputProps?.max && BigNumber(amount).eq(inputProps?.max)) {
      if (isDirect && !isReset && DIRECT_ADOPT_GEN9_RATE.times(amount).lt(ONE)) {
        setErrorMessage(
          `Insufficient balance, you need at least ${DIRECT_ADOPT_GEN9_MIN} $SGR to adopt 1 9th-Gen cat, `,
        );
        setShowBuy(true);
        return;
      }
      if (!isReset && ADOPT_NEXT_RATE.times(amount).lt(ONE)) {
        setErrorMessage(`Insufficient balance, you need at least ${ADOPT_NEXT_MIN} $SGR to adopt 1 next-Gen cat, `);
        setShowBuy(true);
        return;
      }
    }

    setShowBuy(false);

    if (isDirect && !isReset && DIRECT_ADOPT_GEN9_RATE.times(amount).lt(ONE)) {
      setErrorMessage(
        `Please enter at least ${DIRECT_ADOPT_GEN9_MIN} SGR to ensure you can receive 1 9th-gen cat with one click.`,
      );
      return;
    }

    if (!isReset && ADOPT_NEXT_RATE.times(amount).lt(ONE)) {
      setErrorMessage(`Please enter at least ${ADOPT_NEXT_MIN} to ensure you can receive at least 1 next-gen cat.`);
      return;
    }

    onConfirmProps && onConfirmProps(amount);
  }, [inputProps?.max, isDirect, isReset, onConfirmProps]);

  const [amount, setAmount] = useState<string>('');
  const receiveToken = useMemo(() => {
    if (amount === '') return '--';
    const amountNumber = ZERO.plus(amount);
    if (amountNumber.eq(ZERO)) return '--';
    if (isReset) return amount;
    const rate = isDirect ? DIRECT_ADOPT_GEN9_RATE : ADOPT_NEXT_RATE;
    return ZERO.plus(amountNumber.multipliedBy(rate).toFixed(8)).toFixed();
  }, [amount, isDirect, isReset]);

  const adoptFee = useMemo(() => {
    if (isReset) return '--';
    if (amount === '') return '--';
    const amountNumber = ZERO.plus(amount);
    if (amountNumber.eq(ZERO)) return '--';
    const rerollLoss = ZERO.plus(receiveToken).multipliedBy(0.5);

    return ZERO.plus(amountNumber).minus(receiveToken).plus(rerollLoss).toFixed();
  }, [amount, isReset, receiveToken]);

  const priceAmount = useMemo(() => {
    if (!tokenPrice) return '0';
    return ZERO.plus(txFee).multipliedBy(tokenPrice).toFixed(4);
  }, [tokenPrice, txFee]);

  const rateValue = useMemo(() => {
    if (isReset) return `Reroll 1 ${info.name} receive 0.5 ${renameSymbol(getOriginSymbol(info.name))}`;
    return isDirect
      ? `Consume ${DIRECT_ADOPT_GEN9_MIN} $SGR to adopt one 9th-Gen cat`
      : `Consume ${ADOPT_NEXT_MIN} ${info.name} to adopt 1 next-gen cat `;
  }, [info.name, isDirect, isReset]);

  const inputTitle = useMemo(() => {
    if (isReset) return 'Reroll Amount';
    return 'Consume Amount';
  }, [isReset]);

  const inputDescription = useMemo(() => {
    if (isReset)
      return `By rerolling, your cat will be reverted back to its original status (Gen0) and you will receive ${renameSymbol(
        getOriginSymbol(info.name),
      )}.`;
    return '';
  }, [info.name, isReset]);

  const inputPlaceholder = useMemo(() => {
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
        disabled={isInvalid}
        onClick={() => onConfirm && onConfirm()}
        type="primary">
        {isReset ? 'Reroll' : 'Adopt'}
      </Button>
    ),
    [isInvalid, isReset, onConfirm, theme],
  );

  useEffect(() => {
    setErrorMessage('');
    setShowBuy(false);
  }, [amount]);

  const onAdoptRulesClick = useCallback(() => {
    adoptRulesModal.show({
      theme,
    });
  }, [adoptRulesModal, theme]);

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
      onOk={() => onConfirm && onConfirm()}
      onCancel={onCancel}
      afterClose={modal.remove}
      theme={theme}
      footer={confirmBtn}>
      {modalSubTitle ? (
        <div className={clsx('mb-[16px] text-sm', theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
          {modalSubTitle}
        </div>
      ) : null}
      {!isReset && (
        <div
          className={clsx(
            'flex py-[14px] px-[16px] mb-[24px] md:mb-[32px]',
            theme === 'dark' ? 'rounded-none bg-pixelsPageBg' : 'rounded-md bg-brandBg',
          )}>
          {theme === 'dark' ? (
            <ExclamationCircleSVG className="flex-shrink-0" />
          ) : (
            <InfoSVG className="flex-shrink-0" />
          )}

          <span className={clsx('ml-[8px]', theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralPrimary')}>
            Learn more about the{' '}
            <span
              className={clsx(
                'cursor-pointer',
                theme === 'dark' ? 'text-pixelsSecondaryTextPurple' : 'text-brandDefault',
              )}
              onClick={onAdoptRulesClick}>
              adoption rules
            </span>
            .
          </span>
        </div>
      )}
      <InfoCard {...info} theme={theme} />
      <SGRAmountInput
        ref={sgrAmountInputRef}
        title={inputTitle}
        disableInput={disableInput || isBlind}
        theme={theme}
        tips={
          isReset
            ? undefined
            : [
                '1. Use SGR to instantly adopt Gen9 cats through the power of AI. Each adoption generates new, unpredictable traits that make your cat uniquely valuable.',
                '2. The required minimum for adopting a cat NFT is 1.6 SGR. Out of this, 0.55 SGR is charged as an evolution tax, and another 0.55 SGR is added to a bonus prize pool. The remaining 0.5 SGR can be rerolled back into SGR token.',
                '3. Feel the thrill of unboxing Rare Cats with special rarity badges. These rare cats come with unique perks and hold additional value within the Schrodinger ecosystem.',
              ]
        }
        description={inputDescription}
        className="mt-[32px] mb-[32px]"
        onInvalidChange={setIsInvalid}
        onChange={setAmount}
        status={errorMessage ? 'error' : ''}
        errorMessage={errorMessage}
        showBuy={showBuy && info.tag === 'GEN 0'}
        placeholder={inputPlaceholder}
        defaultValue={isBlind ? `${inputProps?.max}` : isDirect ? `${DIRECT_ADOPT_GEN9_MIN}` : ''}
        {...inputProps}
      />
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
          content: adoptFee,
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
