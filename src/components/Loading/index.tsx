import Lottie from 'lottie-react';
import LoadingAnimation from 'assets/img/loading-animation.json';
import LoadingAnimationBlue from 'assets/img/loading-animation-blue.json';
import { useMemo } from 'react';
import React from 'react';

const loadingImg = {
  white: LoadingAnimation,
  blue: LoadingAnimationBlue,
};

const sizeStyle = {
  default: 'w-[40px] h-[40px]',
  small: 'w-[24px] h-[24px]',
};

interface IProps {
  color?: 'white' | 'blue';
  size?: 'default' | 'small';
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
