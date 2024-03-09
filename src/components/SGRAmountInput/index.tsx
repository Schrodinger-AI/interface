import React from 'react';

function SGRAmountInput(props: { title?: string; description?: string; className?: string }) {
  const { title, description, className } = props;
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-neutralPrimary text-lg">{title}</span>
      <span className="mt-[4px] text-neutralSecondary text-base">{description}</span>
    </div>
  );
}

export default React.memo(SGRAmountInput);
