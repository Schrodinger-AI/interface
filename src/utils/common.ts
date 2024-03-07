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
