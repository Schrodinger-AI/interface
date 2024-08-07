import { Checkbox } from 'antd';
import {
  useGetSubAllTraits,
  useGetSubTraits,
  TGetSubAllTraitsResult,
  TGetSubTraitsResult,
  TGetSubTraitsParams,
  TGetSubAllTraitsParams,
} from 'graphqlServer';
import { useWalletService } from 'hooks/useWallet';
import { ChangeEvent, useCallback, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import { useCmsInfo } from 'redux/hooks';
import { TFilterSubTrait } from 'types/trait';
import Loading from 'components/Loading';
import { ZERO } from 'constants/misc';
import CommonSearch from 'components/CommonSearch';
import styles from './style.module.css';
import { ListTypeEnum } from 'types';
import { useSearchParams } from 'next/navigation';
import { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';

type TSubTraitItem = Omit<TFilterSubTrait, 'amount'> & {
  amount: string;
};

export interface ISubTraitFilterProps {
  traitType: string;
  selectValues?: string[];
  defaultValue?: string[];
  theme?: TModalTheme;
  onChange?: (checkedValue: string[]) => void;
}

export interface ISubTraitFilterInstance {
  clearSearch: () => void;
}

export const SubTraitFilter = forwardRef(
  ({ traitType, selectValues = [], defaultValue = [], theme = 'light', onChange }: ISubTraitFilterProps, ref) => {
    const cmsInfo = useCmsInfo();
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();

    const getSubTraits = useGetSubTraits();
    const getSubAllTraits = useGetSubAllTraits();
    const { wallet } = useWalletService();
    const [list, setList] = useState<TSubTraitItem[]>([]);

    const curViewListType: ListTypeEnum = useMemo(
      () => (Number(searchParams.get('pageState')) as ListTypeEnum) || ListTypeEnum.All,
      [searchParams],
    );

    const getSubTraitList = useCallback(async () => {
      setIsLoading(true);
      const requestApi = curViewListType === ListTypeEnum.My ? getSubTraits : getSubAllTraits;
      const reqParams: {
        chainId: string;
        traitType: string;
        address?: string;
      } = {
        chainId: cmsInfo?.curChain || '',
        address: wallet.address || '',
        traitType,
      };
      if (curViewListType !== ListTypeEnum.My) {
        delete reqParams.address;
      }
      try {
        const { data } = await requestApi({
          input: reqParams,
        } as TGetSubAllTraitsParams & TGetSubTraitsParams);

        const { traitsFilter: traitsList } =
          curViewListType === ListTypeEnum.My
            ? (data as TGetSubTraitsResult).getTraits
            : (data as TGetSubAllTraitsResult).getAllTraits;

        const trait = traitsList[0];
        const list: TSubTraitItem[] = trait.values
          .filter((item) => {
            return ZERO.plus(item.amount).gt(0);
          })
          .map((item) => ({
            ...item,
            amount: ZERO.plus(item.amount).toFormat(),
          }));

        setList(list);
      } catch (error) {
        console.log('getSubTraitList error', error);
      }

      setIsLoading(false);
    }, [cmsInfo?.curChain, curViewListType, getSubAllTraits, getSubTraits, traitType, wallet.address]);

    useEffectOnce(() => {
      console.log('traitType', traitType, selectValues);
      getSubTraitList();
    });

    const [searchValue, setSearchValue] = useState('');
    const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    }, []);

    const clearSearch = useCallback(() => {
      setSearchValue('');
    }, []);

    useImperativeHandle(ref, () => ({
      clearSearch,
    }));

    const options = useMemo(() => {
      let _list = list;
      const _searchValue = searchValue.toLocaleUpperCase();
      if (searchValue) {
        _list = list.filter((item) => item.value.toLocaleUpperCase() === _searchValue);
      }

      return _list.map((item) => {
        return {
          label: (
            <div className="flex justify-between h-[44px] items-center gap-4">
              <span className={clsx('truncate', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralPrimary')}>
                {item.value}
              </span>
              <span className={clsx('flex-none', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralPrimary')}>
                {item.amount}
              </span>
            </div>
          ),
          value: item.value,
        };
      });
    }, [list, searchValue, theme]);

    return (
      <div className={styles.subTraitFilter}>
        <div className={styles.searchWrapper}>
          <CommonSearch size="small" value={searchValue} theme={theme} placeholder="Search" onChange={onSearchChange} />
        </div>

        <Checkbox.Group
          value={selectValues}
          className={clsx('w-full flex-col', styles['checkbox-dark'])}
          onChange={onChange}
          defaultValue={defaultValue}
          options={options}>
          {isLoading ? (
            <div className="h-[184px] flex items-center justify-center w-full">
              <Loading color={theme === 'dark' ? 'purple' : 'blue'} />
            </div>
          ) : (
            !options.length && (
              <div
                className={clsx(
                  'pl-4 pr-5 leading-[44px]',
                  theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralPrimary',
                )}>
                No corresponding results found
              </div>
            )
          )}
        </Checkbox.Group>
      </div>
    );
  },
);
