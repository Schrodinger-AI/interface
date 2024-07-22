import { Flex } from 'antd';
import { ReactComponent as BackSVG } from 'assets/img/telegram/back-left.svg';
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
      <BackSVG className="text-base leading-4" />
      <span className="text-sm font-medium text-neutralTitle">Back</span>
    </Flex>
  );
}
