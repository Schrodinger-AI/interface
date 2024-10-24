/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

const rotateY = plugin(function ({ addUtilities }) {
  addUtilities({
    '.rotate-y-180': {
      transform: 'rotateY(180deg)',
    },
    '.primary-button-dark': {
      backgroundColor: 'var(--pixels-card-bg)',
      border: '1px dashed var(--pixels-primary-text-purple)',
      borderRadius: '0',
      color: 'var(--pixels-white-bg)',
      boxShadow: '4px 4px 4px 0 #262284',
    },
    '.primary-button-disabled-dark': {
      backgroundColor: '#0F0D2E',
      border: '1px dashed #2F1965',
      borderRadius: '0',
      color: '#57566D',
      boxShadow: '4px 4px 4px 0 #161445',
    },
    '.default-button-dark': {
      backgroundColor: 'var(--pixels-page-bg)',
      border: '1px dashed var(--pixels-primary-text-purple)',
      borderRadius: '0',
      color: 'var(--pixels-white-bg)',
      boxShadow: '4px 4px 4px 0 #262284',
    },
    '.dark-title': {
      color: 'var(--pixels-white-bg)',
      textShadow: '2px 2px 0 var(--pixels-primary-text-pink)',
    },
    '.dark-sub-title': {
      color: 'var(--pixels-white-bg)',
      textShadow: '2px 2px 0 var(--pixels-dash-purple)',
    },
    '.tg-card-border': {
      border: '2px dashed var(--pixels-primary-text-purple)',
    },
    '.tg-card-shadow': {
      boxShadow: '4px 4px 4px 0 #262284',
    },
    '.dark-btn-font': {
      color: 'var(--pixels-white-bg)',
      textShadow: '2px 2px 0 #000000',
    },
  });
});

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brandDefault: 'var(--brand-default)',
        brandHover: 'var(--brand-hover)',
        brandPressed: 'var(--brand-pressed)',
        brandDisable: 'var(--brand-disable)',
        brandEnable: 'var(--brand-enable)',
        brandBg: 'var(--brand-bg)',
        neutralTitle: 'var(--neutral-title)',
        neutralPrimary: 'var(--neutral-primary)',
        neutralSecondary: 'var(--neutral-secondary)',
        neutralTertiary: 'var(--neutral-tertiary)',
        neutralDisable: 'var(--neutral-disable)',
        neutralBorder: 'var(--neutral-border)',
        neutralDivider: 'var(--neutral-divider)',
        neutralDefaultBg: 'var(--neutral-default-bg)',
        neutralHoverBg: 'var(--neutral-hover-bg)',
        neutralWhiteBg: 'var(--neutral-white-bg)',
        functionalSuccess: 'var(--functional-success)',
        functionalWarning: 'var(--functional-warning)',
        functionalSuccessBg: 'var(--functional-success-bg)',
        functionalWarningBg: 'var(--functional-warning-bg)',
        functionalError: 'var(--functional-error)',
        functionalErrorBg: 'var(--functional-error-bg)',
        functionalErrorHover: 'var(--functional-error-hover)',
        functionalErrorPressed: 'var(--functional-error-pressed)',
        functionalYellowSub: 'var(--functional-yellow-sub)',
        fillMask1: 'var(--fill-mask-1)',
        fillMask2: 'var(--fill-mask-2)',
        fillMask3: 'var(--fill-mask-3)',
        fillMask20: 'var(--fill-mask-20)',
        rarityPlatinum: 'var(--rarity-platinum)',
        rarityBronze: 'var(--rarity-bronze)',
        raritySilver: 'var(--rarity-silver)',
        rarityGold: 'var(--rarity-gold)',
        rarityHalcyon: 'var(--rarity-halcyon)',
        rarityDiamond: 'var(--rarity-diamond)',
        fillMask5: 'var(--fill-mask-5)',
        warning100: 'var(--warning-100)',
        warning500: 'var(--warning-500)',
        warning600: 'var(--warning-600)',

        transparentWhite30: 'var(--transparent-white-30)',
        transparentWhite20: 'var(--transparent-white-20)',
        transparentWhite10: 'var(--transparent-white-10)',

        rarityOrange: 'var(--rarity-orange)',

        pixelsModalBg: 'var(--pixels-modal-bg)',
        pixelsPrimaryTextPurple: 'var(--pixels-primary-text-purple)',
        pixelsPrimaryTextPink: 'var(--pixels-primary-text-pink)',
        pixelsSecondaryTextPurple: 'var(--pixels-secondary-text-purple)',
        pixelsSecondaryTextPink: 'var(--pixels-secondary-text-pink)',
        pixelsTertiaryTextPurple: 'var(--pixels-tertiary-text-purple)',
        pixelsTertiaryTextPink: 'var(--pixels-tertiary-text-pink)',
        pixelsDivider: 'var(--pixels-divider)',
        pixelsBorder: 'var(--pixels-border)',
        pixelsPageBg: 'var(--pixels-page-bg)',
        pixelsCardBg: 'var(--pixels-card-bg)',
        pixelsPinkContainer: 'var(--pixels-pink-container)',
        pixelsWarning: 'var(--pixels-warning)',
        pixelsComplete: 'var(--pixels-complete)',
        pixelsPaleYellow: 'var(--pixels-pale-yellow)',
        pixelsDashPurple: 'var(--pixels-dash-purple)',
        pixelsDashPurple60: 'var(--pixels-dash-purple-60)',
        pixelsWhiteBg: 'var(--pixels-white-bg)',
        pixelsHover: 'var(--pixels-hover)',
        pixelsButtonWarning: 'var(--pixels-button-warning)',
        pixelsButtonSuccess: 'var(--pixels-button-success)',
        pixelsLightPurple: 'var(--pixels-light-purple)',
        pixelsLighterPurple: 'var(--pixels-lighter-purple)',
        pixelsdeepPurple: 'var(--pixels-deep-purple)',
        pixelsGrayPurple: 'var(--pixels-gray-purple)',
        pixelsPrimaryPurpleBg: 'var(--pixels-primary-purple-bg)',
        pixelsPrimaryWorningBg: 'var(--pixels-primary-warning-bg)',
        pixelsDeepWorningBg: 'var(--pixels-deep-warning-bg)',
        pixelsPrimaryInfoBg: 'var(--pixels-primary-info-bg)',
        pixelsPrimaryGrayBg: 'var(--pixels-primary-gray-bg)',
        pixelsTextPurple: 'var(--pixels-text-purple)',
        pixelsTextWorning: 'var(--pixels-text-warning)',
        pixelsTextDeepWorning: 'var(--pixels-text-deep-warning)',
        pixelsTextInfo: 'var(--pixels-text-info)',
        pixelsTextGray: 'var(--pixels-text-gray)',
        pixelsModalTextBg: 'var(--pixels-modal-text-bg)',
        tgSubCyan: 'var(--tg-sub-cyan)',
      },
      fontSize: {
        xxs: ['10px', '16px'],
        xs: ['12px', '20px'],
        sm: ['14px', '22px'],
        base: ['16px', '24px'],
        lg: ['18px', '26px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['28px', '36px'],
        '4xl': ['32px', '40px'],
        '5xl': ['40px', '48px'],
        '6xl': ['48px', '56px'],
      },
      boxShadow: {
        selectShadow: '0px 0px 8px 0px var(--fill-mask-4)',
        cardShadow: '0px 0px 12px 0px rgb(27 63 116 / 8%)',
        cardShadow2: '0px 4px 12px 0px rgb(27 63 116 / 8%)',
        radioShadow: '0px 2px 8px 0px rgb(0 0 0 / 5%)',
        darkPixelsShadow: '4px 4px 4px 0 #262284',
        floatingButtonsShadow: '0px 2px 0px 0px #6D68FF inset, 0px 2px 0px 0px rgb(0 0 0 / 10%)',
        tgModalShadow: '0px 2px 0px 0px #6D68FF inset, 0px -4px 0px 0px #2F2C89 inset',
        btnShadow: '0px 2px 0px 0px rgb(0 0 0 / 25%)',
        compareRightShadow: '0px 2px 0px 0px #FA5961 inset, 0px -2px 0px 0px rgb(0 0 0 / 40%) inset',
        compareLeftShadow: '0px 2px 0px 0px #485EC9 inset, 0px -2px 0px 0px rgb(0 0 0 / 40%) inset',
        modalContentShadow: '0px 24px 12px 5px rgb(0 0 0 / 40%)',
        boxPurpleTitleShadow: '0px 2px 0px 0px #FFFFFF33 inset, 0px -4px 0px 0px #8F55E6 inset',
        boxWorningTitleShadow: '0px 2px 0px 0px #FFFFFF4D inset, 0px -4px 0px 0px #E8BB1D inset',
        boxInfoTitleShadow: '0px 2px 0px 0px #FFFFFF4D inset, 0px -4px 0px 0px #84BBE5 inset',
        boxDeepWorningTitleShadow: '0px 2px 0px 0px #FFFFFF4D inset, 0px -4px 0px 0px #D28A4F inset',
        boxGrayTitleShadow: '0px 2px 0px 0px #FFFFFF4D inset, 0px -4px 0px 0px #A1AEAA inset',
      },
      keyframes: {
        loading: {
          '0%': { transform: 'rotate(0)' },
          '50%': { transform: 'rotate(-180deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      backgroundImage: {
        inviteCardBg: 'linear-gradient(180deg, #DFECFE 0%, #FFFFFF 50.18%)',
        floatingButtonsBg: 'linear-gradient(0deg, #4743C5 0%, #1D1A74 95.83%)',
        tgModalBg: 'radial-gradient(50% 50% at 50% 50%, #4C48D9 0%, #3C38AF 100%)',
        successBtnBg: 'linear-gradient(180deg, #50D500 0%, #36B027 48.96%, #47CB19 111.78%)',
        defaultBtnBg: 'linear-gradient(180deg, #615DF4 0%, #544FE1 48.96%, #625DFD 111.78%)',
        dangerBtnBg: 'linear-gradient(180deg, #EB4951 0%, #CE2C34 48.96%, #EB4951 111.78%)',
        battaleBg:
          'radial-gradient(125.45% 50% at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%), radial-gradient(50% 34.26% at 50% 50%, #2F2C89 0%, #25236C 100%)',
        compareLeftBg: 'linear-gradient(90deg, #485EC9 0%, #657FFC 100%)',
        compareRightBg: 'linear-gradient(90deg, #EB4951 50.15%, #D7353D 100%)',
      },
      animation: {
        loading: 'loading 800ms linear infinite',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
      },
    },
    screens: {
      xs: '532px',
      sm: '641px',
      md: '769px',
      lg: '1025px',
      xl: '1280px',
      '2xl': '1536px',
      large: '2560px',
      main: '1441px',
    },
  },
  plugins: [rotateY],
  corePlugins: {
    preflight: false,
  },
};
