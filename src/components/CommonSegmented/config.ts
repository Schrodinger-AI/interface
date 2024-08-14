import { ThemeConfig } from 'antd';

export const themeSegmentedConfig: ThemeConfig = {
  components: {
    Segmented: {
      itemSelectedBg: '#fff',
      itemActiveBg: '#fff',
      itemColor: 'var(--neutral-disable)',
      itemSelectedColor: 'var(--neutral-title)',
      itemHoverColor: 'var(--neutral-disable)',
    },
  },
};

export const themeDarkSegmentedConfig: ThemeConfig = {
  components: {
    Segmented: {
      itemSelectedBg: 'var(--pixels-card-bg)',
      itemActiveBg: 'var(--pixels-card-bg)',
      itemColor: 'var(--pixels-white-bg)',
      itemSelectedColor: 'var(--pixels-white-bg)',
      itemHoverColor: 'var(--pixels-card-bg)',
    },
  },
};
