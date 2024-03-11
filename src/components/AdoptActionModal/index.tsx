import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import Balance from 'components/Balance';
import CommonModal from 'components/CommonModal';
import InfoCard, { IInfoCard } from 'components/InfoCard';
import SGRAmountInput, { ISGRAmountInputInterface, ISGRAmountInputProps } from 'components/SGRAmountInput';
import { DEFAULT_TOKEN_SYMBOL } from 'constants/assets';
import { ZERO } from 'constants/misc';
import { useTokenPrice, useTxFee } from 'hooks/useAssets';
import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { ReactComponent as InfoSVG } from 'assets/img/icons/info.svg';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import { useCmsInfo } from 'redux/hooks';
import { Tooltip } from 'antd';

export type TBalanceItem = {
  amount: string;
  suffix: string;
  usd: string;
};

export type TAdoptActionModalProps = {
  title?: string;
  modalTitle?: string;
  info: IInfoCard;
  buttonConfig?:
    | {
        btnText?: string;
        onConfirm?: Function;
      }[]
    | false;
  onClose?: <T>(params?: T) => void;
  onConfirm?: (amount: string) => void;
  content?: {
    title?: string | ReactNode;
    content?: string | string[] | ReactNode;
  };
  balanceList?: TBalanceItem[];
  inputProps?: ISGRAmountInputProps;
  isReset?: boolean;
  receiveTokenName: string;
};

function AdoptActionModal(params: TAdoptActionModalProps) {
  const modal = useModal();
  const {
    modalTitle,
    title,
    info,
    buttonConfig,
    onClose,
    onConfirm: onConfirmProps,
    content,
    balanceList,
    inputProps,
    isReset = false,
  } = params;
  const sgrAmountInputRef = useRef<ISGRAmountInputInterface>();

  const onCancel = () => {
    if (onClose) {
      onClose();
      return;
    }
    modal.hide();
  };

  const { txFee } = useTxFee();
  const { tokenPrice } = useTokenPrice();
  const cmsInfo = useCmsInfo();
  const adoptRuleUrl = useMemo(() => cmsInfo?.adoptRuleUrl, [cmsInfo]);

  const [isInvalid, setIsInvalid] = useState(true);
  const isInvalidRef = useRef(isInvalid);
  isInvalidRef.current = isInvalid;
  const onConfirm = useCallback(() => {
    if (isInvalidRef.current) return;
    const sgrAmountInput = sgrAmountInputRef.current;
    if (!sgrAmountInput) return;
    const amount = sgrAmountInput.getAmount();
    onConfirmProps && onConfirmProps(amount);
  }, [onConfirmProps]);

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
    return ZERO.plus(txFee).multipliedBy(tokenPrice).toFixed(2);
  }, [tokenPrice, txFee]);

  const rateValue = useMemo(() => {
    if (isReset) return `1 ${info.name} Adopt 1 ${params.receiveTokenName}`;
    return `1 ${info.name} Adopt 0.95 ${params.receiveTokenName}`;
  }, [info.name, isReset, params.receiveTokenName]);

  const inputTitle = useMemo(() => {
    if (isReset) return 'Enter the item amount you want to Reset';
    return 'Enter the item amount you want to consume to adopt';
  }, [isReset]);

  const inputDescription = useMemo(() => {
    if (isReset) return 'You can only reset back to SGR';
    return 'The more adopt amount you enter, the more images will be peeked.';
  }, [isReset]);

  const confirmBtn = useMemo(
    () => (
      <Button className="md:w-[356px]" disabled={isInvalid} onClick={() => onConfirm && onConfirm()} type="primary">
        {isReset ? 'Reset' : 'Adopt'}
      </Button>
    ),
    [isInvalid, isReset, onConfirm],
  );

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
            Adopt releases the next generation Item with more Tarits.{' '}
            {adoptRuleUrl && (
              <a href={adoptRuleUrl} target="_blank" rel="noreferrer">
                Adopt rules
              </a>
            )}
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
        {...inputProps}
      />
      <div className="flex justify-between mb-[16px]">
        <span className="text-neutralSecondary">Ets. Receive Token</span>
        <span className="text-neutralTitle">{receiveToken}</span>
      </div>
      <div className="flex justify-between mb-[16px]">
        <span className="text-neutralSecondary flex items-center gap-[8px]">
          Rate
          <Tooltip color="black" title={'rate'} overlayInnerStyle={{ color: 'white' }}>
            <QuestionSVG />
          </Tooltip>
        </span>
        <span className="text-neutralTitle">{rateValue}</span>
      </div>
      {!isReset && (
        <div className="flex justify-between mb-[16px]">
          <span className="text-neutralSecondary">Adopt Fee</span>
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
