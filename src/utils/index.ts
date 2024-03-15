export const sleep = (time: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export function isPortkeyApp() {
  const ua = navigator.userAgent;
  return ua.indexOf('Portkey did Mobile') !== -1;
}
