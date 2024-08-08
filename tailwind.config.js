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
      backgroundColor: 'var(--pixels-card-bg)',
      border: '1px dashed var(--pixels-primary-text-purple)',
      borderRadius: '0',
      color: 'rgb(255 255 255 / 30%)',
      boxShadow: '4px 4px 4px 0 #262284',
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
    '.tg-card-shadow': {
      boxShadow: '4px 4px 4px 0 #262284',
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
        fillMask1: 'var(--fill-mask-1)',
        fillMask2: 'var(--fill-mask-2)',
        fillMask3: 'var(--fill-mask-3)',
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
        pixelsWhiteBg: 'var(--pixels-white-bg)',
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
