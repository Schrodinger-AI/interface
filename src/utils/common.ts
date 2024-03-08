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
  const mainDomain = 'schrodingernft.ai';
  const hostname = window?.location.hostname || '';
  if (!hostname || hostname === mainDomain) return '';
  return hostname.split('.')[0];
}
