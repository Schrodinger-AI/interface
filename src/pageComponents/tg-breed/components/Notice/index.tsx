/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Button, Flex } from 'antd';
import SkeletonImage from 'components/SkeletonImage';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
import { ReactComponent as InfoSVG } from 'assets/img/icons/info.svg';

function Notice({
  status = false,
  hideCancel = false,
  catInfo,
  tips,
  onConfirm,
  onClose,
  theme = 'light',
  title,
}: {
  title?: string;
  onConfirm?: (v?: string) => void;
  onClose?: () => void;
  status?: boolean;
  hideCancel?: boolean;
  catInfo?: {
    amount: string;
    describe: string;
    inscriptionImageUri: string;
  }[];
  tips?: string;
  theme?: TModalTheme;
}) {
  const modal = useModal();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      modal.remove();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      modal.remove();
    }
  };

  const modalContent = (theme: TModalTheme) => {
    const isDark = theme === 'dark';
    return (
      <>
        {catInfo?.length ? (
          <Flex className={clsx('w-full', tips ? 'mb-[24px]' : '')} gap={16}>
            {catInfo?.map((item, index) => (
              <div
                key={index}
                className={clsx(
                  'relative flex-1 border-[2px] border-solid',
                  isDark
                    ? 'border-neutralWhiteBg rounded-[8px] shadow-selectBoxShadow'
                    : 'border-neutralBorder rounded-[12px]',
                )}>
                <SkeletonImage
                  img={item.inscriptionImageUri}
                  rarity={item.describe}
                  imageSizeType="contain"
                  className="rounded-b-none"
                  imageClassName="rounded-b-none"
                  tagPosition="small"
                />

                <Flex className="w-full p-[12px]" justify="space-between">
                  {index % 2 !== 0 ? (
                    <span
                      className={clsx(
                        'text-sm font-black',
                        isDark ? 'text-pixelsWhiteBg black-title' : 'text-neutralPrimary',
                      )}>
                      Success
                    </span>
                  ) : (
                    <span
                      className={clsx(
                        'text-sm font-black',
                        isDark ? 'text-pixelsWhiteBg black-title' : 'text-neutralPrimary',
                      )}>
                      Failure
                    </span>
                  )}
                  <div className={clsx('text-xs font-black', isDark ? 'text-neutralWhiteBg' : 'text-neutralPrimary')}>
                    {item.amount}
                  </div>
                </Flex>
              </div>
            ))}
          </Flex>
        ) : null}

        {!status ? (
          <Flex
            align="stretch"
            gap={16}
            className={clsx(
              'mt-[16px] p-[16px]',
              isDark ? 'rounded-[8px] bg-pixelsModalTextBg' : 'rounded-[12px] bg-brandBg',
            )}>
            <div className="flex flex-none items-center w-[20px]">
              {isDark ? (
                <img src={require('assets/img/info.png').default.src} alt="" className="w-[20px] h-[20px] z-10" />
              ) : (
                <InfoSVG className="w-[20px] h-[20px] z-10" />
              )}
            </div>
            <p
              className={clsx(
                'flex-auto leading-[22px] text-[14px] font-medium',
                isDark ? 'text-white' : 'text-neutralTitle',
              )}>
              0.25 SGR will be added to the Prize Pool on every merge, successful or not!
            </p>
          </Flex>
        ) : (
          <p
            className={clsx(
              'whitespace-pre-wrap font-semibold text-center',
              isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
            )}>
            {tips}
          </p>
        )}
      </>
    );
  };

  if (theme === 'dark') {
    return (
      <TgModal
        title={title || 'Notice'}
        open={modal.visible}
        hideHeader={false}
        maskClosable={true}
        onClose={handleClose}
        afterClose={handleClose}
        onOk={() => modal.hide()}
        onCancel={() => modal.hide()}
        footer={
          <Flex className="w-full" gap={8}>
            {hideCancel ? null : (
              <TGButton size="large" className="w-full" onClick={() => modal.hide()}>
                {status ? 'cancel' : 'I understand'}
              </TGButton>
            )}

            {status ? (
              <TGButton type="success" size="large" className="w-full" onClick={handleConfirm}>
                Confirm
              </TGButton>
            ) : null}
          </Flex>
        }>
        {modalContent(theme)}
      </TgModal>
    );
  } else {
    return (
      <CommonModal
        title={title || 'Notice'}
        theme="light"
        open={modal.visible}
        hideHeader={false}
        maskClosable={true}
        disableMobileLayout={true}
        onClose={handleClose}
        afterClose={handleClose}
        onOk={() => modal.hide()}
        onCancel={() => modal.hide()}
        footer={
          <Flex className="w-full" gap={8}>
            {hideCancel ? null : (
              <Button
                type={status ? 'default' : 'primary'}
                size="large"
                className="w-full"
                onClick={() => modal.remove()}>
                {status ? 'cancel' : 'I understand'}
              </Button>
            )}

            {status ? (
              <Button type="primary" size="large" className="w-full" onClick={handleConfirm}>
                Confirm
              </Button>
            ) : null}
          </Flex>
        }>
        {modalContent(theme)}
      </CommonModal>
    );
  }
}

export default NiceModal.create(Notice);
