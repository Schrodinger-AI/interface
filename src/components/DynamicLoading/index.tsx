import clsx from 'clsx';
import Loading from 'components/Loading';
import useTelegram from 'hooks/useTelegram';

export const DynamicLoading = () => {
  const { isInTG } = useTelegram();
  return (
    <div className="z-[100000] bg-fillMask1 absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
      <div
        className={clsx(
          'w-[240px] h-[106px] flex flex-col justify-center items-center',
          isInTG ? 'bg-pixelsPageBg rounded-none' : 'bg-white rounded-[8px]',
        )}>
        <Loading color={isInTG ? 'purple' : 'blue'} />
        <span
          className={clsx(
            'mt-[12px] text-[14px] leading-[20px] font-normal text-center',
            isInTG ? 'text-pixelsWhiteBg' : 'text-[#1A1A1A]',
          )}>
          loading...
        </span>
      </div>
    </div>
  );
};
