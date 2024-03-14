import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import Balance from 'components/Balance';
import CommonModal from 'components/CommonModal';
import InfoCard, { IInfoCard } from 'components/InfoCard';
import SGRAmountInput, { ISGRAmountInputInterface, ISGRAmountInputProps } from 'components/SGRAmountInput';
import { DEFAULT_TOKEN_SYMBOL } from 'constants/assets';
import { ZERO } from 'constants/misc';
import { useTokenPrice, useTxFee } from 'hooks/useAssets';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as InfoSVG } from 'assets/img/icons/info.svg';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import { useCmsInfo } from 'redux/hooks';
import { Tooltip } from 'antd';
import BigNumber from 'bignumber.js';
import AdoptRulesModal from 'components/AdoptRulesModal';

export type TBalanceItem = {
  amount: string;
  suffix: string;
  usd: string;
};

export type TAdoptActionModalProps = {
  modalTitle?: string;
  info: IInfoCard;
  onClose?: <T>(params?: T) => void;
  onConfirm?: (amount: string) => void;
  balanceList?: TBalanceItem[];
  inputProps?: ISGRAmountInputProps;
  isReset?: boolean;
};

function AdoptActionModal(params: TAdoptActionModalProps) {
  const modal = useModal();
  const adoptRulesModal = useModal(AdoptRulesModal);
  const { modalTitle, info, onClose, onConfirm: onConfirmProps, balanceList, inputProps, isReset = false } = params;
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
  const cmsInfo = useCmsInfo();
  const [errorMessage, setErrorMessage] = useState<string>();

  const [isInvalid, setIsInvalid] = useState(true);
  const isInvalidRef = useRef(isInvalid);
  isInvalidRef.current = isInvalid;
  const onConfirm = useCallback(() => {
    if (isInvalidRef.current) return;
    const sgrAmountInput = sgrAmountInputRef.current;
    if (!sgrAmountInput) return;
    const amount = sgrAmountInput.getAmount();

    if (inputProps?.max && BigNumber(amount).gt(inputProps?.max)) {
      setErrorMessage('Insufficient cat to consume. ');
      return;
    }

    onConfirmProps && onConfirmProps(amount);
  }, [inputProps?.max, onConfirmProps]);

  const [amount, setAmount] = useState<string>('');
  const receiveToken = useMemo(() => {
    if (amount === '') return '--';
    const amountNumber = ZERO.plus(amount);
    if (amountNumber.eq(ZERO)) return '--';
    if (isReset) return amount;
    return ZERO.plus(amountNumber.multipliedBy(0.95).toFixed(8)).toFixed();
  }, [amount, isReset]);

  const adoptFee = useMemo(() => {
    if (isReset) return '--';
    if (amount === '') return '--';
    const amountNumber = ZERO.plus(amount);
    if (amountNumber.eq(ZERO)) return '--';
    return ZERO.plus(amountNumber).minus(receiveToken).toFixed();
  }, [amount, isReset, receiveToken]);

  const priceAmount = useMemo(() => {
    if (!tokenPrice) return '0';
    return ZERO.plus(txFee).multipliedBy(tokenPrice).toFixed(4);
  }, [tokenPrice, txFee]);

  const rateValue = useMemo(() => {
    if (isReset) return `Reroll 1 ${info.name} receive 1 SGR-1`;
    return `Consume 1 ${info.name} adopt 0.95 next-gen cat`;
  }, [info.name, isReset]);

  const inputTitle = useMemo(() => {
    if (isReset) return 'Enter the amount of cats you want to reroll back to SGR-1.';
    return 'Enter the amount of cats you want to consume to adopt next-gen cats';
  }, [isReset]);

  const inputDescription = useMemo(() => {
    if (isReset)
      return 'By rerolling, your cat will be reverted back to its original status (gen0) and you will receive SGR-1.';
    return 'After adoption, cats with new random trait will be generated. You can preview the new cats and select from the two options the one you prefer.';
  }, [isReset]);

  const inputPlaceholder = useMemo(() => {
    if (isReset) return 'Consume Amount';
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
      <Button className="md:w-[356px]" disabled={isInvalid} onClick={() => onConfirm && onConfirm()} type="primary">
        {isReset ? 'Reroll' : 'Adopt'}
      </Button>
    ),
    [isInvalid, isReset, onConfirm],
  );

  useEffect(() => {
    setErrorMessage('');
  }, [amount]);

  const onAdoptRulesClick = useCallback(() => {
    adoptRulesModal.show();
  }, [adoptRulesModal]);

  return (
    <CommonModal
      title={modalTitle}
      open={modal.visible}
      onOk={() => onConfirm && onConfirm()}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={confirmBtn}>
      {!isReset && (
        <div className="flex bg-brandBg py-[14px] px-[16px] rounded-md mb-[24px] md:mb-[32px]">
          <InfoSVG className="flex-shrink-0" />
          <span className="ml-[8px] text-neutralPrimary">
            Learn more about the{' '}
            <span className="text-brandDefault cursor-pointer" onClick={onAdoptRulesClick}>
              adoption rules
            </span>
            .
          </span>
        </div>
      )}
      <InfoCard {...info} />
      <SGRAmountInput
        ref={sgrAmountInputRef}
        title={inputTitle}
        description={inputDescription}
        className="mt-[32px] mb-[32px]"
        onInvalidChange={setIsInvalid}
        onChange={setAmount}
        status={errorMessage ? 'error' : ''}
        errorMessage={errorMessage}
        placeholder={inputPlaceholder}
        {...inputProps}
      />
      <div className="flex justify-between mb-[16px]">
        <span className="text-neutralSecondary">{receiveLabel}</span>
        <span className="text-neutralTitle">{receiveToken}</span>
      </div>
      <div className="flex justify-between mb-[16px]">
        <span className="text-neutralSecondary flex items-center gap-[8px]">
          {rateLabel}
          <Tooltip color="black" title={'rate'} overlayInnerStyle={{ color: 'white' }}>
            <QuestionSVG />
          </Tooltip>
        </span>
        <span className="text-neutralTitle">{rateValue}</span>
      </div>
      {!isReset && (
        <div className="flex justify-between mb-[16px]">
          <span className="text-neutralSecondary">Adoption Fee to Be Charged</span>
          <span className="text-neutralTitle">{adoptFee}</span>
        </div>
      )}

      <div className="flex justify-between mb-[16px]">
        <span className="text-neutralSecondary">Transaction Fee</span>
        <div className="flex flex-col items-end">
          <span className="text-neutralTitle">
            {txFee} {DEFAULT_TOKEN_SYMBOL}
          </span>
          {tokenPrice && <span className="text-neutralSecondary mt-[4px]">$ {priceAmount}</span>}
        </div>
      </div>

      {balanceList && balanceList.length && <Balance items={balanceList} className="mt-[32px]" />}
    </CommonModal>
  );
}

export default NiceModal.create(AdoptActionModal);
