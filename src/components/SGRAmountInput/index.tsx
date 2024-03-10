import { Input } from 'aelf-design';
import { ZERO } from 'constants/misc';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { isPotentialNumber } from 'utils';

export interface ISGRAmountInputProps {
  title?: string;
  description?: string;
  className?: string;
  max?: string;
  min?: string;
  decimals?: number | string;
  onInvalidChange?: (isInvalid: boolean) => void;
}

export interface ISGRAmountInputInterface {
  getAmount: () => string;
}

export const SGRAmountInput = forwardRef(
  (
    { title, description, className, min = '0', max = '100', decimals = '8', onInvalidChange }: ISGRAmountInputProps,
    ref,
  ) => {
    const [amount, setAmount] = useState<string>('');

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
      if (max && valueNumber.gt(max)) return;
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
      if (valueNumber.lte(min) || (max && valueNumber.gt(max))) {
        onInvalidChange(true);
        return;
      }
      onInvalidChange(false);
    }, [amount, max, min, onInvalidChange]);

    const suffix = useMemo(() => {
      return (
        <span onClick={getMax} className="text-brandDefault text-lg font-medium cursor-pointer">
          MAX
        </span>
      );
    }, [getMax]);

    const getAmount = useCallback(() => {
      return amount;
    }, [amount]);

    useImperativeHandle(ref, () => ({
      getAmount,
    }));

    return (
      <div className={`flex flex-col ${className}`}>
        <span className="text-neutralPrimary text-lg">{title}</span>
        <span className="mt-[4px] text-neutralSecondary text-base">{description}</span>
        <Input className="mt-[16px]" value={amount} onChange={onChange} suffix={suffix} placeholder="Enter amount" />
      </div>
    );
  },
);

// export default React.memo(SGRAmountInput);
export default SGRAmountInput;
