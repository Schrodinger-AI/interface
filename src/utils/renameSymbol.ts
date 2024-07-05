export const renameSymbol = (symbol?: string) => {
  const env = process.env.NEXT_PUBLIC_APP_ENV;
  if (env === 'test' && (symbol === 'SGRTEST-1' || symbol === 'SGR-1')) {
    return 'SGRTEST';
  }
  if (env === 'production' && symbol === 'SGR-1') {
    return 'SGR';
  }

  return symbol;
};
