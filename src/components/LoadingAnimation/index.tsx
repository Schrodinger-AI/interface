import { useLottie } from 'lottie-react';
import LoadingAnimationJson from 'assets/img/loading-animation.json';

const LoadingAnimation = () => {
  const options = {
    animationData: LoadingAnimationJson,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, { width: '40px', height: '40px' });

  return View;
};

export default LoadingAnimation;
