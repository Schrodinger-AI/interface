/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';

interface ITagProps {
  className?: string;
  text?: string;
  textClassName?: string;
}

const Tag = ({ text, className, textClassName }: ITagProps) => {
  return (
    <div className={clsx('absolute w-[40px] h-[40px]', className)}>
      <img className="w-[40px] h-[40px] object-contain" src={require('assets/img/tag-bg.png').default.src} alt="Tag" />
      {text && (
        <span
          className={clsx(
            'absolute top-[3px] right-[-2px] inline-block w-[30px] text-[9px] font-bold leading-[24px] text-center text-white overflow-hidden whitespace-nowrap text-ellipsis rotate-45',
            textClassName,
          )}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Tag;
