import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import styles from './index.module.css';
import { useCmsInfo } from 'redux/hooks';
import SkeletonImage from 'components/SkeletonImage';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useResponsive } from 'hooks/useResponsive';

function SpecialCatActivityTipsModal({
  closable = false,
  theme = 'light',
  onCancel,
}: {
  closable?: boolean;
  theme?: TModalTheme;
  onCancel?: () => void;
}) {
  const modal = useModal();
  const router = useRouter();
  const cmsInfo = useCmsInfo();
  const { isLG } = useResponsive();
  const { banner, title, description, link } = cmsInfo?.specialCatActivity || {};

  const onClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      modal.hide();
    }
  };

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const toDetails = () => {
    link && router.push(link);
    modal.hide();
  };

  return (
    <CommonModal
      centered
      open={modal.visible}
      closable={closable}
      maskClosable={true}
      onCancel={onClose}
      afterClose={modal.remove}
      theme={theme}
      disableMobileLayout={true}
      hideHeader={true}
      width={668}
      wrapClassName={styles['special-catActivity-tips-modal-wrap']}
      className={clsx(
        styles['special-catActivity-tips-modal'],
        isDark && styles['special-catActivity-tips-modal-dark'],
      )}
      footer={null}>
      <div className={clsx('cursor-pointer', isDark ? 'tg-card-border tg-card-shadow' : '')} onClick={toDetails}>
        {banner ? (
          <SkeletonImage
            img={banner}
            width={668}
            height={468}
            imageClassName={clsx(isDark ? '!rounded-none' : '!rounded-bl-none !rounded-br-none')}
            className={clsx('w-full h-auto', isDark ? '!rounded-none' : '!rounded-bl-none !rounded-br-none')}
          />
        ) : null}
        {title || description ? (
          <div
            className={clsx(
              'px-[24px]',
              isLG ? 'py-[24px]' : 'py-[32px]',
              isDark ? '!rounded-none bg-pixelsModalBg' : '!rounded-bl-lg !rounded-br-lg bg-white',
            )}>
            {title ? (
              <p
                className={clsx(
                  'font-semibold',
                  isLG ? 'text-lg' : 'text-2xl',
                  isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
                )}>
                {title}
              </p>
            ) : null}
            {description ? (
              <p
                className={clsx(
                  isLG ? 'text-sm' : 'text-base',
                  isDark ? 'text-pixelsDivider' : 'text-neutralSecondary',
                  title && (isDark ? 'mt-[8px]' : 'mt-[16px]'),
                )}>
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      <div
        className={clsx('mx-auto cursor-pointer', isLG ? 'w-[32px] h-[32px] mt-[16px]' : 'w-[48px] h-[48px] mt-[32px]')}
        onClick={() => modal.hide()}>
        <CloseCircleOutlined
          className={clsx(
            isDark ? 'text-pixelsDivider' : 'text-neutralSecondary',
            isLG ? 'text-[26px]' : 'text-[39px]',
          )}
        />
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(SpecialCatActivityTipsModal);
