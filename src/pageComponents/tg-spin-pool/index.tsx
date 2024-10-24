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

export default function TgHome() {
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
    </div>
  );
}
