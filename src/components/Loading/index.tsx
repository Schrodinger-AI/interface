import { useLottie } from 'lottie-react';
import LoadingAnimation from 'assets/img/loading-animation.json';
import LoadingAnimationBlue from 'assets/img/loading-animation-blue.json';

interface IProps {
  color?: 'white' | 'blue';
}

export default function Loading({ color = 'blue' }: IProps) {
  const loadingImg = {
    white: LoadingAnimation,
    blue: LoadingAnimationBlue,
  };
  const Animation = () => {
    const options = {
      animationData: loadingImg[color],
      loop: true,
      autoplay: true,
    };

    const { View } = useLottie(options, { width: '40px', height: '40px' });

    return View;
  };

  return <Animation />;
}
