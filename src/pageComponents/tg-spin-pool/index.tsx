/* eslint-disable @next/next/no-img-element */
'use client';

import { Flex } from 'antd';
import { getSpinPrizesPool } from 'api/request';
import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import { ReactComponent as SuperRareSVG } from 'assets/img/telegram/spin-pool/SuperRare.svg';
import { ReactComponent as RareSVG } from 'assets/img/telegram/spin-pool/Rare.svg';
import { ReactComponent as CommonSVG } from 'assets/img/telegram/spin-pool/Common.svg';
import { useCallback, useEffect, useState } from 'react';
import PoolModule from './components/PoolModule';
import TgModal from 'components/TgModal';
import { ResultModule } from './components/ResultModule';

export default function TgHome() {
  const [isOpen, setIsOpen] = useState(true);
  const [rareSuper, setRareSuper] = useState<RareItem>();
  const [rareGold, setRareGold] = useState<RareItem>();
  const [rareSilver, setRareSilver] = useState<RareItem>();
  const [rareBronze, setRareBronze] = useState<RareItem>();
  const [rareCommon, setRareCommon] = useState<RareItem>();

  const getDataSource = useCallback(async () => {
    try {
      const { data } = await getSpinPrizesPool();
      const { rareSuper, rareGold, rareSilver, rareCommon, rareBronze } = data;
      setRareSuper(rareSuper);
      setRareGold(rareGold);
      setRareSilver(rareSilver);
      setRareBronze(rareBronze);
      setRareCommon(rareCommon);
    } catch (error) {
      /* empty */
    }
  }, []);

  useEffect(() => {
    getDataSource();
  }, [getDataSource]);

  return (
    <div className={clsx('max-w-[2560px] w-full min-h-screen p-[16px] bg-neutralTitle')}>
      <BackCom className="w-full" theme="dark" />
      <h4 className="leading-[24px] text-[16px] font-black text-pixelsWhiteBg mt-[16px] mb-[24px]">
        All cat rarity box
      </h4>

      <PoolModule
        data={rareSuper?.data || []}
        title={<SuperRareSVG />}
        className="shadow-boxPurpleTitleShadow bg-pixelsPrimaryPurpleBg"
        subTitle={<p className="text-pixelsTextPurple text-[12px] font-bold">{rareSuper?.rate}</p>}
      />

      <Flex gap={15}>
        <div>
          <PoolModule
            row={1}
            data={rareGold?.data || []}
            title={<RareSVG />}
            className="shadow-boxWorningTitleShadow bg-pixelsPrimaryWorningBg"
            subTitle={<p className="text-pixelsTextWorning text-[12px] font-bold">{rareGold?.rate}</p>}
          />
        </div>
        <div>
          <PoolModule
            row={1}
            data={rareSilver?.data || []}
            title={<RareSVG />}
            className="shadow-boxInfoTitleShadow bg-pixelsPrimaryInfoBg"
            subTitle={<p className="text-pixelsTextInfo text-[12px] font-bold">{rareSilver?.rate}</p>}
          />
        </div>
      </Flex>

      <Flex gap={15}>
        <div>
          <PoolModule
            row={1}
            data={rareBronze?.data || []}
            title={<RareSVG />}
            className="shadow-boxDeepWorningTitleShadow bg-pixelsDeepWorningBg"
            subTitle={<p className="text-pixelsTextDeepWorning text-[12px] font-bold">{rareBronze?.rate}</p>}
          />
        </div>
        <div>
          <PoolModule
            row={1}
            data={rareCommon?.data || []}
            title={<CommonSVG />}
            className="shadow-boxGrayTitleShadow bg-pixelsPrimaryGrayBg"
            subTitle={<p className="text-pixelsTextGray text-[12px] font-bold">{rareCommon?.rate}</p>}
          />
        </div>
      </Flex>

      {/* <TgModal
        title="Notice"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div className="p-[8px]">
          <p className="text-center text-white text-[12px] font-medium">
            Oh no, you do not have enough $Fish. Complete tasks to get more $Fish!
          </p>
          <TGButton type="success" className="w-full mt-[24px]">
            <GoSVG />
          </TGButton>
        </div>
      </TgModal>

      <TgModal
        title="Notice"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div className="p-[8px]">
          <Flex align="center" gap={24} vertical>
            <p className="text-center text-white leading-[22px] text-[14px] font-medium">You won n* $Fish!</p>
            <img
              src={require('assets/img/telegram/spin/prize.png').default.src}
              alt=""
              className="w-[96px] h-[96px] rounded-[8px] z-10"
            />
            <p className="text-center text-white text-[12px] font-medium">Ready for your next spin?</p>
          </Flex>
          <TGButton type="success" className="w-full mt-[24px]">
            <SpinSVG />
          </TGButton>
        </div>
      </TgModal>

      <TgModal
        title="REWARD"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div className="p-[8px]">
          <Flex align="center" gap={24} vertical>
            <p className="text-center text-white text-[12px] font-medium">
              You won n* <br />
              S-CAT Voucher!
            </p>
            <img
              src={require('assets/img/telegram/spin/ticket.png').default.src}
              alt=""
              className="w-[140px] h-[140px] rounded-[8px] z-10"
            />
            <p className="text-center leading-[20px] text-white text-[12px] font-medium">
              Use your voucher to adopt a GEN9 cat for free! You get to keep Rare GEN9 cats, but be aware that Common
              GEN9 cats will run off and disappear.
            </p>
            <p className="text-center leading-[20px] text-white text-[12px] font-medium">Good luck!</p>
          </Flex>
          <TGButton type="success" className="w-full mt-[24px]">
            <AdoptSVG />
          </TGButton>
        </div>
      </TgModal>

      <TgModal
        title="DETAILS"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div className="p-[8px]">
          <Flex align="center" gap={24} vertical>
            <img
              src={require('assets/img/telegram/spin/ticket.png').default.src}
              alt=""
              className="w-[140px] h-[140px] rounded-[8px] z-10"
            />
            <Flex gap={4} align="center" vertical>
              <VoucherSVG />
              <p className="text-center text-white text-[14px] font-semibold">Quantity: XX</p>
            </Flex>
            <p className="text-center leading-[20px] text-white text-[12px] font-medium">
              Use your voucher to adopt a GEN9 cat for free! You get to keep Rare GEN9 cats, but be aware that Common
              GEN9 cats will run off and disappear.
            </p>
            <p className="text-center leading-[20px] text-white text-[12px] font-medium">Good luck!</p>
          </Flex>
          <TGButton type="success" className="w-full mt-[24px]">
            <AdoptSVG />
          </TGButton>
        </div>
      </TgModal>

      <TgModal
        title="DETAILS"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div className="p-[8px]">
          <Flex align="center" gap={24} vertical>
            <img
              src={require('assets/img/loading-cat-white.gif').default.src}
              alt=""
              className="w-[120px] h-[120px] rounded-[8px] z-10"
            />
            <Flex align="stretch" gap={16} className="p-[16px] bg-pixelsModalTextBg rounded-[8px]">
              <div className="flex items-center w-[20px] shrink">
                <InfoSVG />
              </div>
              <p className="text-white leading-[22px] text-[14px] font-medium ">
                Please do not close this window until adoption is completed
              </p>
            </Flex>
          </Flex>
        </div>
      </TgModal> */}

      <TgModal
        title="DETAILS"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <ResultModule data={rareSuper?.data?.[0]} />
      </TgModal>
    </div>
  );
}
