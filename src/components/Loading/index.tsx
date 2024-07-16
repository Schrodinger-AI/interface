import Lottie from 'lottie-react';
import LoadingAnimation from 'assets/img/loading-animation.json';
import LoadingAnimationBlue from 'assets/img/loading-animation-blue.json';
import LoadingAnimationPurple from 'assets/img/loading-animation-purple.json';
import { useMemo } from 'react';
import React from 'react';

const loadingImg = {
  white: LoadingAnimation,
  blue: LoadingAnimationBlue,
  purple: LoadingAnimationPurple,
};

const sizeStyle = {
  default: 'w-[40px] h-[40px]',
  middle: 'w-[24px] h-[24px]',
  small: 'w-[18px] h-[18px]',
};

interface IProps {
  color?: 'white' | 'blue' | 'purple';
  size?: 'default' | 'middle' | 'small';
}

function Loading({ color = 'blue', size = 'default' }: IProps) {
  const options = useMemo(() => {
    return {
      animationData: loadingImg[color],
      loop: true,
      autoplay: true,
    };
  }, [color]);

  return <Lottie {...options} className={sizeStyle[size] || 'w-[40px] h-[40px]'} />;
}

export default React.memo(Loading);
