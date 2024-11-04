export const NEED_JOIN_PAGE = ['/referral'];

export const NEED_LOGIN_PAGE = [
  '/points',
  '/stray-cats',
  '/assets',
  '/referral',
  '/my-cats',
  // '/etransfer',
  '/etransfer-history',
  '/awaken-swap',
  '/?pageState=1',
  '/?pageState=5',
];

export const TG_NEED_LOGIN_PAGE = ['/stray-cats', '/assets', '/referral', '/my-cats', '/?pageState=1', '/?pageState=5'];

export const NOT_NEED_AUTO_JOIN_PAGE = ['/invitee'];

export const SHOW_RANKING_ENTRY = ['/'];

export const HIDE_MAIN_PADDING = ['/', '/rare-cats', '/my-cats'];

export const BUY_SGR_URL = '/etransfer?type=Deposit&tokenSymbol=USDT&depositToToken=SGR-1&depositFromNetwork=TRX';
export const BUY_ELF_URL = '/etransfer?type=Deposit&tokenSymbol=USDT&depositToToken=ELF&depositFromNetwork=TRX';
export const SELL_SGR_URL = '/withdraw?type=Withdraw&tokenSymbol=SGR-1&withdrawToToken=USDT&withdrawFromNetwork=TRX';
export const SELL_ELF_URL = '/withdraw?type=Withdraw&tokenSymbol=ELF&withdrawToToken=USDT&withdrawFromNetwork=TRX';
export const SWAP_BUY_SGR_URL = '/awaken-swap?selectTokenInSymbol=ELF&selectTokenOutSymbol=SGR-1';
export const SWAP_BUY_ELF_URL = '/awaken-swap?selectTokenInSymbol=SGR-1&selectTokenOutSymbol=ELF';
