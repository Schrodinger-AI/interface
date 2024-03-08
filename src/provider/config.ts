import { ThemeConfig } from 'antd';

export const AELFDProviderTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2A4BF0',
    colorPrimaryHover: '#4564FF',
    colorPrimaryActive: '#2242E3',
  },
  components: {
    Input: {
      borderRadius: 12,
    },
    Table: {
      headerColor: 'var(--neutral-secondary)',
      headerSplitColor: 'var(--neutral-white-bg)',
      headerBg: 'var(--neutral-white-bg)',
    },
    Layout: {
      bodyBg: 'var(--neutral-white-bg)',
    },
    Tooltip: {
      colorBgSpotlight: 'var(--fill-mask-1)',
      colorTextLightSolid: 'var(--neutral-white-bg)',
      borderRadius: 4,
    },
    Button: {
      borderColorDisabled: 'var(--neutral-hover-bg)',
      colorTextDisabled: 'var(--neutral-disable)',
      colorBgContainerDisabled: 'var(--neutral-hover-bg)',
    },
  },
};
