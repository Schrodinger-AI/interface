import { Flex } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export default function BackCom({ className, url }: { className?: string; url?: string }) {
  const router = useRouter();

  return (
    <Flex
      align="center"
      gap={8}
      className={clsx('w-fit cursor-pointer', className)}
      onClick={() => {
        if (url) {
          router.replace(url);
          return;
        }
        router.back();
      }}>
      <ArrowSVG className={clsx('size-4', { ['common-revert-90']: true })} />
      <span className="font-semibold text-sm">Back</span>
    </Flex>
  );
}
