import { Input } from 'aelf-design';
import { ZERO } from 'constants/misc';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { isPotentialNumber } from 'utils';
import { ReactComponent as QuestionIcon } from 'assets/img/icons/question.svg';
import { ReactComponent as PixelsQuestionIcon } from 'assets/img/pixelsIcon/question.svg';
import { ToolTip } from 'aelf-design';
import { useCmsInfo } from 'redux/hooks';
import { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
import { useModal } from '@ebay/nice-modal-react';
import AdoptActionModal from 'components/AdoptActionModal';
import { useBuyToken } from 'hooks/useBuyToken';

export interface ISGRAmountInputProps {
  title?: string;
  tips?: string[];
  description?: string;
  className?: string;
  max?: string;
  min?: string;
  decimals?: number | string;
  onInvalidChange?: (isInvalid: boolean) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  status?: '' | 'warning' | 'error' | undefined;
  errorMessage?: string;
  showBuy?: boolean;
  defaultValue?: string;
  disableInput?: boolean;
  theme?: TModalTheme;
}

export interface ISGRAmountInputInterface {
  getAmount: () => string;
}

export const SGRAmountInput = forwardRef(
  (
    {
      title,
      tips,
      description,
      className,
      min = '0',
      max,
      decimals = '8',
      onInvalidChange,
      onChange: onChangeProps,
      placeholder,
      status = '',
      errorMessage = '',
      showBuy = false,
      defaultValue = '',
      disableInput = false,
      theme = 'light',
    }: ISGRAmountInputProps,
    ref,
  ) => {
    const [amount, setAmount] = useState<string>(defaultValue);
    const cmsInfo = useCmsInfo();
    const adoptActionModal = useModal(AdoptActionModal);
    const { checkBalanceAndJump } = useBuyToken();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '') setAmount('');
      if (!isPotentialNumber(value)) return;
      const decimalCount = value.split('.')[1]?.length || 0;

      if (ZERO.plus(decimals).lt(decimalCount)) return;

      const valueNumber = ZERO.plus(value);

      if (valueNumber.toFixed() === '0' && ZERO.plus(decimals).gt(decimalCount)) {
        setAmount(value);
        return;
      }

      if (valueNumber.lte(min)) return;
      setAmount(value);
    };

    const getMax = useCallback(() => {
      if (max) setAmount(max);
    }, [max]);

    useEffect(() => {
      if (!onInvalidChange) return;
      if (amount === '') {
        onInvalidChange(true);
        return;
      }
      const valueNumber = ZERO.plus(amount);
      if (valueNumber.lte(min)) {
        onInvalidChange(true);
        return;
      }
      onInvalidChange(false);
    }, [amount, max, min, onInvalidChange]);

    useEffect(() => {
      onChangeProps && onChangeProps(amount);
    }, [amount, onChangeProps]);

    const suffix = useMemo(() => {
      return (
        <span
          onClick={getMax}
          className={clsx(
            'font-medium cursor-pointer text-base',
            theme === 'dark' ? 'text-pixelsSecondaryTextPurple' : 'text-brandDefault',
          )}>
          Max
        </span>
      );
    }, [getMax, theme]);

    const getAmount = useCallback(() => {
      return amount;
    }, [amount]);

    const ToolTipTitle = useMemo(() => {
      if (!tips) return null;
      return (
        <div className="flex flex-col">
          {tips.map((item, index) => {
            return <span key={index}>{item}</span>;
          })}
        </div>
      );
    }, [tips]);

    useImperativeHandle(ref, () => ({
      getAmount,
    }));

    return (
      <div className={`flex flex-col ${className}`}>
        <span
          className={clsx(
            'font-medium text-lg flex items-center',
            theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralPrimary',
          )}>
          <span>{title}</span>

          {tips && (
            <ToolTip title={ToolTipTitle}>
              {theme === 'dark' ? <PixelsQuestionIcon className="ml-[8px]" /> : <QuestionIcon className="ml-[8px]" />}
            </ToolTip>
          )}
        </span>
        <span className="mt-[4px] text-neutralSecondary text-base">{description}</span>
        <Input
          className={clsx(
            'mt-[16px]',
            'hover:bg-transparent',
            theme === 'dark' &&
              'rounded-none border border-solid border-pixelsBorder !bg-pixelsPageBg text-pixelsWhiteBg',
          )}
          value={amount}
          onChange={onChange}
          suffix={disableInput ? null : suffix}
          status={status}
          disabled={disableInput}
          placeholder={placeholder || 'Enter amount'}
        />
        {errorMessage && (
          <span className="mt-[4px] text-sm text-functionalError">
            {errorMessage}
            {showBuy && cmsInfo?.buySGRFromETransfer ? (
              <span
                className={clsx(
                  'cursor-pointer',
                  theme === 'dark' ? 'text-pixelsSecondaryTextPurple' : 'text-brandDefault',
                )}
                onClick={() => {
                  adoptActionModal.hide();
                  checkBalanceAndJump({
                    type: 'buySGR',
                    theme,
                    defaultDescription: ['Insufficient funds, get more $SGR.'],
                  });
                }}>
                Get more $SGR
              </span>
            ) : null}
          </span>
        )}
      </div>
    );
  },
);

export default SGRAmountInput;
