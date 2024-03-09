import { Input } from 'aelf-design';
import React, { useCallback, useMemo, useState } from 'react';

function SGRAmountInput(props: { title?: string; description?: string; className?: string }) {
  const { title, description, className } = props;

  const [amount, setAmount] = useState<string>();

  const onChange = (value: string) => {
    setAmount(value);
  };

  const getMax = useCallback(() => {
    setAmount('100');
  }, []);

  const suffix = useMemo(() => {
    return (
      <span onClick={getMax} className="text-brandDefault text-lg font-medium">
        max
      </span>
    );
  }, []);

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-neutralPrimary text-lg">{title}</span>
      <span className="mt-[4px] text-neutralSecondary text-base">{description}</span>
      <Input
        type="number"
        className="mt-[16px]"
        value={amount}
        onChange={(e) => onChange(e.target.value)}
        suffix={suffix}
      />
    </div>
  );
}

export default React.memo(SGRAmountInput);
