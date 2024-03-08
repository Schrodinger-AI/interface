export const sleep = (time: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export function dotString(str: string, maxLength = 16) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

export function getSecondHostName() {
  return window && window.location.hostname.split('.')[0];
}

export function forbidScale() {
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });

  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    function (event) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false,
  );

  document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
  });
}
