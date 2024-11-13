import breedBg from 'assets/img/telegram/breed/breed-bg.png';
import Image from 'next/image';
import SelectCard from '../SelectCard';
import { ReactComponent as CatPaw } from 'assets/img/telegram/breed/cat-paw.svg';
import TGButton from 'components/TGButton';
import { ReactComponent as QuestionSVG } from 'assets/img/telegram/battle/icon_question.svg';
import { useMemo, useState } from 'react';
import { TSGRItem } from 'types/tokens';
import { useModal } from '@ebay/nice-modal-react';
import Notice from '../Notice';
import CatSelections from '../CatSelections';
import { useCmsInfo } from 'redux/hooks';
import { catCombine } from 'api/request';
import { Breed } from 'contract/schrodinger';
import ResultModal from '../ResultModal';
import { fetchTraitsAndImages } from 'hooks/Adopt/AdoptStep';
import ProtoInstance from 'utils/initializeProto';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { IContractError } from 'types';
import { message } from 'antd';
import { getCatsRankProbability } from 'utils/getCatsRankProbability';
import { TModalTheme } from 'components/CommonModal';
import { Button } from 'aelf-design';
import TGAdoptLoading from 'components/TGAdoptLoading';
import { sleep } from '@portkey/utils';
import KittenOnTheGrassAnimation from '../KittenOnTheGrassAnimation';

export interface IBredAdoptInfo {
  adoptId: string;
  symbol: string;
}

export interface IBredInfo {
  tick: string;
  adoptIdA: string;
  adoptIdB: string;
  amountA: number;
  amountB: number;
  adoptInfo: IBredAdoptInfo;
}

function BreedModule({ theme = 'light', updateRank }: { theme?: TModalTheme; updateRank?: () => void }) {
  const [selectedLeft, setSelectedLeft] = useState<TSGRItem>();
  const [selectedRight, setSelectedRight] = useState<TSGRItem>();
  const catSelections = useModal(CatSelections);
  const resultModal = useModal(ResultModal);
  const tgAdoptLoading = useModal(TGAdoptLoading);
  const cmsInfo = useCmsInfo();
  const { walletInfo } = useConnectWallet();

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const notice = useModal(Notice);

  const getProbability = (describe?: string) => {
    if (!describe || !cmsInfo?.detailedSynthesisProbability) return '';
    const rarity = describe.split(',');
    return cmsInfo.detailedSynthesisProbability[`${rarity[0]}${rarity[2]}`] || '';
  };

  const toCatCombine = async () => {
    try {
      if (!selectedLeft?.symbol || !selectedRight?.symbol || !walletInfo?.address) return;
      tgAdoptLoading.show();
      const res = await catCombine({
        symbols: [selectedLeft.symbol, selectedRight?.symbol],
      });
      await sleep(2000); // TODO: mock Breed
      // const { TransactionId, TransactionResult } = await Breed({
      //   adoptIdA: res.adoptIds[0],
      //   adoptIdB: res.adoptIds[1],
      //   level: res.level,
      //   signature: res.signature,
      // });
      // const contractAddress = cmsInfo?.schrodingerSideAddress;

      // if (!contractAddress) {
      //   tgAdoptLoading.hide();
      //   return;
      // }

      // const logs = await ProtoInstance.getLogEventResult<IBredInfo>({
      //   contractAddress,
      //   logsName: 'Bred',
      //   TransactionResult,
      // });
      // if (!logs) {
      //   tgAdoptLoading.hide();
      //   return;
      // }

      // const catInfo = await fetchTraitsAndImages({
      //   adoptId: logs.adoptInfo.adoptId,
      //   transactionHash: TransactionId,
      //   adoptOnly: true,
      //   address: walletInfo.address,
      // });

      // const catsRankProbability = await getCatsRankProbability({
      //   symbol: logs.adoptInfo.symbol,
      // });

      // const describe = catsRankProbability ? catsRankProbability.levelInfo?.describe : '';
      const isSuccess = true;
      // const isSuccess = describe !== selectedLeft.describe;
      tgAdoptLoading.hide();
      updateRank && updateRank();
      resultModal.show({
        type: isSuccess ? 'success' : 'fail',
        catInfo: {
          // describe: describe,
          // inscriptionImageUri: catInfo.adoptImageInfo.boxImage,
          describe: selectedLeft.describe || '', // TODO: mock Breed
          inscriptionImageUri: selectedLeft.inscriptionImageUri, // TODO: mock Breed
        },
        onConfirm: () => {
          resultModal.hide();
        },
      });
      setSelectedLeft(undefined);
      setSelectedRight(undefined);
    } catch (error) {
      tgAdoptLoading.hide();
      if (typeof error === 'string') {
        message.error(error);
      } else {
        const resError = error as IContractError;
        message.error(resError.errorMessage?.message);
      }
    }
  };

  const showNoticeMergeInvalid = () => {
    notice.show({
      status: true,
      hideCancel: true,
      tips: 'Merge two cats of the same rarity!',
      theme,
      title: 'Alert',
    });
  };

  const onBreed = () => {
    if (!selectedRight || !selectedLeft || selectedRight?.describe !== selectedLeft?.describe) {
      showNoticeMergeInvalid();
      return;
    }
    const probability = getProbability(selectedLeft.describe);
    notice.show({
      status: true,
      catInfo: [
        {
          amount: probability ? probability.success : '',
          describe: selectedLeft.describe || '',
          inscriptionImageUri: selectedLeft.inscriptionImageUri,
        },
        {
          amount: probability ? probability.fail : '',
          describe: selectedRight.describe || '',
          inscriptionImageUri: selectedRight.inscriptionImageUri,
        },
      ],
      tips: 'Merge these 2 cats?',
      onConfirm: () => {
        notice.hide();
        toCatCombine();
      },
      theme,
    });
  };

  const showCompositionRules = () => {
    if (!selectedRight || !selectedLeft || selectedRight?.describe !== selectedLeft?.describe) {
      showNoticeMergeInvalid();
      return;
    }

    const probability = getProbability(selectedLeft.describe);

    notice.show({
      status: false,
      catInfo: [
        {
          amount: probability ? probability.success : '',
          describe: selectedLeft.describe || '',
          inscriptionImageUri: selectedLeft.inscriptionImageUri,
        },
        {
          amount: probability ? probability.fail : '',
          describe: selectedRight.describe || '',
          inscriptionImageUri: selectedRight.inscriptionImageUri,
        },
      ],
      onConfirm: toCatCombine,
      theme,
    });
  };

  const showCatSelections = (type: string, catData?: TSGRItem) => {
    catSelections.show({
      currentSymbol: catData?.symbol,
      onConfirm: (data) => {
        if (type === 'left') {
          setSelectedLeft(data);
        } else {
          setSelectedRight(data);
        }
        catSelections.hide();
      },
      theme,
    });
  };

  return (
    <div className="relative z-20 w-full -mt-[70px] overflow-hidden pt-[112px]">
      {isDark ? <Image src={breedBg} className="absolute z-10 top-0 w-full left-0" alt={''} /> : null}

      <div className="relative z-20 px-[10px] w-full flex justify-between items-center">
        <SelectCard
          imageUrl={selectedLeft?.inscriptionImageUri}
          describe={selectedLeft?.describe}
          onClick={() => showCatSelections('left', selectedRight)}
        />
        <CatPaw />
        <SelectCard
          describe={selectedRight?.describe}
          imageUrl={selectedRight?.inscriptionImageUri}
          onClick={() => showCatSelections('right', selectedLeft)}
        />
      </div>
      <div className="relative z-20 px-[80px] w-full pb-[39px]">
        <div className="w-full relative h-[72px] border border-pixelsBorder border-t-0 border-solid rounded-b-[5px]">
          <div className="w-full flex justify-center items-center flex-col !absolute -bottom-[25px] left-0 right-0 mx-auto">
            {selectedLeft && selectedRight ? (
              <QuestionSVG className="w-[32px] h-[32px] mb-[2px]" onClick={() => showCompositionRules()} />
            ) : null}
            {isDark ? (
              <TGButton size="large" className="w-[168px]" onClick={onBreed}>
                Merge!
              </TGButton>
            ) : (
              <Button size="large" type="primary" className="w-[168px] !rounded-[12px]" onClick={onBreed}>
                Merge!
              </Button>
            )}
          </div>
        </div>
      </div>
      {isDark ? <KittenOnTheGrassAnimation /> : null}
    </div>
  );
}

export default BreedModule;
