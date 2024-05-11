import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useCallback } from 'react';

interface IProps {
  onBack?: Function;
}

function MobileBackNav(props?: IProps) {
  const { onBack } = props || {};
  const router = useRouter();

  const toBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }, [onBack, router]);

  return (
    <div className="w-full h-[62px]">
      <div className="w-max h-full flex flex-row justify-start items-center" onClick={toBack}>
        <ArrowSVG className={clsx('size-4', { ['common-revert-90']: true })} />
        <div className="ml-[8px] font-medium text-sm w-full text-neutralTitle">Back</div>
      </div>
    </div>
  );
}

export default React.memo(MobileBackNav);
