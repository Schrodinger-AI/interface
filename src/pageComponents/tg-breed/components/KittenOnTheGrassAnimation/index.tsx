import grassland from 'assets/img/telegram/breed/grassland.png';
import clsx from 'clsx';
import Image from 'next/image';
import Lottie from 'lottie-react';
import breedingCat from 'assets/animations/breeding_pagejson_cat.json';

function KittenOnTheGrassAnimation({ className }: { className?: string }) {
  return (
    <div className={clsx('w-full', className)}>
      <div className="w-full">
        <div className="relative z-10">
          <div className="w-[full] h-[54px] overflow-hidden flex justify-end items-end">
            <Lottie animationData={breedingCat} autoPlay={true} loop={true} />
          </div>
        </div>
      </div>
      <Image src={grassland} className="w-full" alt="" />
    </div>
  );
}

export default KittenOnTheGrassAnimation;
