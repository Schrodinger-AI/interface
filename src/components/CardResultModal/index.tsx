import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import CommonModal from 'components/CommonModal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useResponsive } from 'hooks/useResponsive';
import { Button } from 'aelf-design';
import { ReactComponent as SuccessIcon } from 'assets/img/icons/success.svg';
import { ReactComponent as FailedIcon } from 'assets/img/icons/failed.svg';
import { ReactComponent as ExportOutlined } from 'assets/img/icons/exportOutlined.svg';
import { getAdoptErrorMessage } from 'hooks/Adopt/getErrorMessage';
import { singleMessage } from '@portkey/did-ui-react';
import { isMobile } from 'react-device-detect';
import styles from './index.module.css';
import clsx from 'clsx';
import SkeletonImage from 'components/SkeletonImage';
import { formatTokenPrice } from 'utils/format';
import { getDescriptionCom } from 'components/ResultModal';
import Lottie from 'lottie-react';
import light from 'assets/lottie/light.json';
import scrap from 'assets/lottie/scrap.json';
import { useCmsInfo } from 'redux/hooks';
import { useJumpToPage } from 'hooks/useJumpToPage';

export enum Status {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
  INFO = 'info',
}

function CardList({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-row justify-between items-center mt-2 w-full overflow-hidden">
      <div className="w-[110px] text-sm text-neutralSecondary">{title}</div>
      <div className="flex-1 text-right text-sm text-neutralTitle font-medium truncate">{value}</div>
    </div>
  );
}

interface IProps {
  modalTitle?: string;
  title?: string;
  description?: string | ReactNode | string[];
  status?: Status;
  amount?: number | string;
  hideButton?: boolean;
  buttonInfo?: {
    btnText?: string;
    openLoading?: boolean;
    onConfirm?: () => void | Promise<any>;
  };
  image?: string;
  info?: {
    name?: string;
    symbol?: string;
    generation?: string | number;
    rank?: string | number;
    points?: string;
    levelInfo?: ILevelInfo;
  };
  showScrap?: boolean;
  showLight?: boolean;
  link?: {
    text?: string;
    href?: string;
  };
  onCancel?: <T, R>(params?: T) => R | void;
}

function CardResultModal({
  modalTitle,
  description,
  status = Status.INFO,
  amount,
  buttonInfo,
  hideButton = false,
  image,
  info,
  link,
  showScrap = false,
  showLight = false,
  onCancel,
}: IProps) {
  const modal = useModal();
  const { isLG } = useResponsive();
  const cmsInfo = useCmsInfo();
  const { jumpToPage } = useJumpToPage();

  const [loading, setLoading] = useState<boolean>(false);
  const [animationEnds, setAnimationEnds] = useState<boolean>(false);
  const [scrapComplete, setScrapComplete] = useState<boolean>(false);

  const onClick = useCallback(async () => {
    if (buttonInfo?.onConfirm) {
      if (buttonInfo.openLoading) {
        setLoading(true);
      }
      try {
        await buttonInfo.onConfirm();
        setLoading(false);
      } catch (error) {
        console.log(error, 'error==');
        const _error = getAdoptErrorMessage(error);
        console.log(_error, 'errorMessage');

        singleMessage.error(_error);
      } finally {
        setLoading(false);
      }

      return;
    }
    modal.hide();
    return;
  }, [buttonInfo, modal]);

  const Icon = useMemo(() => {
    return {
      [Status.ERROR]: <FailedIcon className="w-[32px] h-[32px]" />,
      [Status.SUCCESS]: <SuccessIcon className="w-[32px] h-[32px]" />,
      [Status.WARNING]: '',
      [Status.INFO]: '',
    }[status];
  }, [status]);

  const aProps = useMemo(() => (isMobile ? {} : { target: '_blank', rel: 'noreferrer' }), []);

  const modalFooter = useMemo(() => {
    return (
      <div className="flex flex-1 lg:flex-none flex-col justify-center items-center">
        {!hideButton ? (
          <div className={clsx('w-full flex flex-col items-center', styles['button-wrapper'])}>
            <Button
              type="primary"
              size="ultra"
              loading={loading}
              className={`${isLG ? 'w-full' : '!w-[256px]'}`}
              onClick={onClick}>
              {buttonInfo?.btnText || 'View'}
            </Button>
          </div>
        ) : null}

        {link && (
          <div className="flex items-center mt-[16px]">
            <a href={link.href} {...aProps} className="flex items-center">
              <span className="text-brandDefault font-medium text-base mr-[8px]">
                {link.text || 'View on aelf Explorer'}
              </span>
              <span>
                <ExportOutlined width={20} height={20} />
              </span>
            </a>
          </div>
        )}
      </div>
    );
  }, [aProps, buttonInfo?.btnText, hideButton, isLG, link, loading, onClick]);

  return (
    <>
      <CommonModal
        title={
          modalTitle ? (
            <p className="flex flex-nowrap">
              <span className="mr-[8px] lg:mr-[12px] lg:mb-0">{Icon}</span>
              <span className="text-neutralTitle font-semibold text-xl lg:text-2xl">{modalTitle}</span>
            </p>
          ) : null
        }
        wrapClassName={styles['card-result-modal-wrap']}
        className={clsx('relative', styles['card-result-modal'])}
        disableMobileLayout={true}
        open={modal.visible}
        onOk={modal.hide}
        onCancel={onCancel || modal.hide}
        afterClose={modal.remove}
        afterOpenChange={(open) => {
          setAnimationEnds(open);
        }}
        footer={modalFooter}>
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start">
          {image || amount ? (
            <div className="flex flex-col items-center w-max">
              {image ? (
                <SkeletonImage
                  generation={info?.generation}
                  level={info?.levelInfo?.level}
                  rarity={info?.levelInfo?.describe}
                  img={image}
                  rank={info?.rank}
                  className="w-[180px] h-[180px]"
                />
              ) : null}
            </div>
          ) : null}
          {info ? (
            <div className="flex flex-col w-full overflow-hidden flex-none lg:flex-1 mt-[16px] lg:mt-[0px] border border-solid border-neutralDivider rounded-lg lg:ml-[24px] p-[16px]">
              <div className="flex flex-row justify-between items-center">
                <div className="text-neutralTitle font-medium text-base">Info</div>
              </div>
              {!!info.name && <CardList title="Name" value={info.name} />}
              {!!info.symbol && <CardList title="Symbol" value={info.symbol} />}
              {!!amount && <CardList title="Adopt amount" value={formatTokenPrice(amount)} />}
              {!!info.points && <CardList title="Points" value={info.points} />}
              {!!info.points && cmsInfo?.ecoEarn && (
                <div className="w-full flex items-center justify-end">
                  <span
                    className="w-max flex items-center cursor-pointer"
                    onClick={() =>
                      jumpToPage({
                        link: cmsInfo.ecoEarn,
                        linkType: 'externalLink',
                      })
                    }>
                    <span className="text-xs font-medium text-brandDefault">
                      View the SGR reward from point staking
                    </span>
                    <ExportOutlined className="scale-[0.6]" />
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </div>
        {description ? (
          <div className="mt-[16px] lg:mt-[24px] text-center text-sm font-medium text-neutralSecondary">
            {getDescriptionCom(description)}
          </div>
        ) : null}
      </CommonModal>
      {animationEnds && showLight && modal.visible ? (
        <div className="fixed w-screen h-screen z-[1001] left-0 top-0 overflow-hidden">
          <div className="relative w-[938px] h-[938px] lg:w-[1280px] lg:h-[1280px] top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
            <Lottie animationData={light} autoPlay={true} loop={true} className="w-full" />
          </div>
        </div>
      ) : null}

      {animationEnds && showScrap && !scrapComplete && modal.visible ? (
        <div className="fixed w-screen h-screen z-[1005] left-0 top-0 overflow-hidden">
          <div className="relative w-[160%] lg:w-[938px] lg:h-[938px] aspect-square lg:aspect-auto top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
            <Lottie
              animationData={scrap}
              onComplete={() => setScrapComplete(true)}
              autoPlay={true}
              loop={false}
              className="w-full"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default NiceModal.create(CardResultModal);
