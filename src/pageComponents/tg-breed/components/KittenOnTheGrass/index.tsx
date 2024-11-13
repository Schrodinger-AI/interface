import grassland from 'assets/img/telegram/breed/grassland.png';
import cat from 'assets/img/telegram/breed/cat.png';
import bubblesBummer from 'assets/img/telegram/breed/bubbles-bummer.png';
import bubblesCongrats from 'assets/img/telegram/breed/bubbles-congrats.png';
import clsx from 'clsx';
import Image from 'next/image';

function KittenOnTheGrass({ className, hasWinner }: { className?: string; hasWinner?: boolean }) {
  return (
    <div className={clsx('w-full', className)}>
      <div className="w-full">
        <div className="ml-[60%] relative z-10">
          <Image
            src={hasWinner ? bubblesCongrats : bubblesBummer}
            className={clsx('w-[111px] absolute -top-[38px]', hasWinner ? ' -left-[50px]' : ' -left-[90px]')}
            alt=""
          />
          <Image src={cat} className="w-[72px]" alt="" />
        </div>
      </div>
      <Image src={grassland} className="w-full" alt="" />
    </div>
  );
}

export default KittenOnTheGrass;
