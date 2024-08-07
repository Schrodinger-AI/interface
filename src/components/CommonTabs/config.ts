import { ThemeConfig } from 'antd';

export const themeCommonTabsConfig: ThemeConfig = {
  components: {
    Tabs: {
      titleFontSizeSM: 16,
      horizontalItemPaddingSM: '0 0',
    },
  },
};

export const themeLightTabsConfig: ThemeConfig = {
  components: {
    Tabs: {},
  },
};

export const themeDarkTabsConfig: ThemeConfig = {
  components: {
    Tabs: {
      inkBarColor: 'var(--pixels-dash-purple)',
      itemSelectedColor: 'var(--pixels-white-bg)',
      itemColor: 'var(--pixels-border)',
    },
  },
};
