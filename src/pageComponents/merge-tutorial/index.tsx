/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import MobileBackNav from 'components/MobileBackNav';
import RewardsCard from 'pageComponents/tg-home/components/RewardsCard';
import styles from './style.module.css';
import cat from 'assets/img/telegram/breed/cat.png';
import Image from 'next/image';
import TgCard from 'components/TgCard';
import { useCmsInfo } from 'redux/hooks';

function MergeTutorial() {
  const cmsInfo = useCmsInfo();

  return (
    <div className={clsx('w-full h-full p-[16px] max-w-[668px] mx-auto', styles['merge-tutorial-wrap'])}>
      <div className={clsx('block')}>
        <MobileBackNav theme={'dark'} />
      </div>
      {cmsInfo?.mergeTutorial?.pageTitle ? (
        <div className="flex justify-center items-center mb-[16px]">
          <span className="text-base text-pixelsWhiteBg font-black">🐱</span>
          <span className="text-base black-title text-pixelsWhiteBg font-black mx-[12px]">
            {cmsInfo.mergeTutorial.pageTitle}
          </span>
          <span className="text-base text-pixelsWhiteBg font-black">🐱</span>
        </div>
      ) : null}

      <RewardsCard theme="dark" />
      <div className="mt-[16px]">
        <TgCard>
          <p className="w-full text-pixelsWhiteBg text-center black-title text-lg font-black">
            {cmsInfo?.mergeTutorial?.title}
          </p>

          {cmsInfo?.mergeTutorial?.list?.map((item) => {
            return (
              <div key={item.id} className="flex items-center mt-[24px]">
                <div className=" w-[88px] h-[88px] bg-[#2F2C89] rounded-[8px] flex justify-center items-center">
                  <img src={item.icon} className="w-[48px] h-[48px]" alt="" />
                </div>
                <div className="flex-1 ml-[16px]">
                  <h2 className="text-base black-title text-pixelsWhiteBg font-black">{item.title}</h2>
                  <p className="text-xs text-botBrand">{item.describe}</p>
                </div>
              </div>
            );
          })}
        </TgCard>
      </div>
    </div>
  );
}

export default MergeTutorial;
