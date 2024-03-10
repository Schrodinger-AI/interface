import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import CommonModal from 'components/CommonModal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import InfoCard, { IInfoCard } from 'components/InfoCard';
import { useResponsive } from 'hooks/useResponsive';
import { Button } from 'aelf-design';
import { ReactComponent as SuccessIcon } from 'assets/img/icons/success.svg';
import { ReactComponent as FailedIcon } from 'assets/img/icons/failed.svg';
import { ReactComponent as ExportOutlined } from 'assets/img/icons/exportOutlined.svg';
import { getAdoptErrorMessage } from 'hooks/Adopt/getErrorMessage';
import { message } from 'antd';

export enum Status {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
  INFO = 'info',
}

interface IProps {
  modalTitle?: string;
  title?: string;
  description?: string | ReactNode | string[];
  status?: Status;
  hideButton?: boolean;
  buttonInfo?: {
    btnText?: string;
    openLoading?: boolean;
    isRetry?: boolean;
    onConfirm?: () => void | Promise<any>;
  };
  info: IInfoCard;
  card?: {
    title?: string | ReactNode;
    description?: string | ReactNode | string[];
  };
  link?: {
    text?: string;
    href?: string;
  };
  onCancel?: <T, R>(params?: T) => R | void;
}

function ResultModal({
  modalTitle,
  title,
  description,
  status = Status.INFO,
  buttonInfo,
  hideButton = false,
  info,
  card,
  link,
  onCancel,
}: IProps) {
  const modal = useModal();
  const { isLG } = useResponsive();

  const [loading, setLoading] = useState<boolean>(false);

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
        console.log(_error, 'error==');

        message.error(_error);
        if (buttonInfo.isRetry) {
          setLoading(false);
          return;
        }
      }
      setLoading(false);

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

  const modalFooter = useMemo(() => {
    return (
      <div className="flex flex-col justify-center items-center">
        {!hideButton ? (
          <div className="w-full flex flex-col items-center">
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
            <span className="text-brandDefault text-base mr-[8px]">{link.text || 'View on AELF Explorer'}</span>
            <span>
              <ExportOutlined width={20} height={20} />
            </span>
          </div>
        )}
      </div>
    );
  }, [buttonInfo?.btnText, hideButton, isLG, link, loading, onClick]);

  const getDescriptionCom = (description: string | ReactNode | string[]) => {
    if (typeof description === 'string') {
      return <p>{description}</p>;
    } else if (description instanceof Array) {
      return description.map((item, index) => {
        return <p key={index}>{item}</p>;
      });
    } else {
      return description;
    }
  };

  return (
    <CommonModal
      title={
        modalTitle ? (
          <p className="flex flex-col md:flex-row items-center">
            <span className="mb-[16px] md:mr-[16px] md:mb-0">{Icon}</span>
            <span className="text-neutralTitle font-semibold text-xl md:text-2xl text-center">{modalTitle}</span>
          </p>
        ) : null
      }
      open={modal.visible}
      onOk={modal.hide}
      onCancel={onCancel || modal.hide}
      afterClose={modal.remove}
      footer={modalFooter}>
      <div className="w-full h-full flex flex-col">
        {info ? <InfoCard {...info} layout="vertical" /> : null}
        {title || description ? (
          <div className="flex flex-col items-center mb-[24px] md:mb-[32px] mt-[24px] md:mt-[48px]">
            {title && (
              <p className="flex flex-col md:flex-row items-center justify-center">
                <span className="text-neutralTitle font-semibold text-xl md:text-2xl text-center">{title}</span>
              </p>
            )}

            <p className="text-base font-medium text-neutralSecondary mt-4 text-center">
              {getDescriptionCom(description)}
            </p>
          </div>
        ) : null}

        {card && (
          <div className="flex flex-col h-max w-full border border-solid border-neutralBorder rounded-lg p-[16px] md:p-[32px]">
            <span className="text-brandDefault font-semibold text-base md:text-xl text-center">{card.title}</span>
            {card.description ? (
              <p className="text-base font-medium text-neutralSecondary mt-[8px] text-center">
                {getDescriptionCom(card.description)}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(ResultModal);
