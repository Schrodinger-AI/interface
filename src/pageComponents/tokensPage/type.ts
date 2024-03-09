import { ChainId } from '@portkey/types';
import CheckBoxGroups, { CheckboxChoiceProps } from './components/CheckBoxGroups';

export enum FilterType {
  Checkbox = 'Checkbox',
}

export type SourceItemType = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

export enum FilterKeyEnum {
  Chain = 'Chain',
}

export type CheckboxItemType = {
  key: FilterKeyEnum;
  title: string;
  type: FilterType.Checkbox;
  data: SourceItemType[];
};

export const getFilterList = (ChainId: string): Array<CheckboxItemType> => {
  const filterList = [
    {
      key: FilterKeyEnum.Chain,
      title: FilterKeyEnum.Chain,
      type: FilterType.Checkbox,
      data: [{ value: ChainId, label: `SideChain ${ChainId}`, disabled: true }],
    },
  ];
  return filterList;
};

export interface IFilterSelect {
  [FilterKeyEnum.Chain]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
}

export const getDefaultFilter = (ChainId: string): IFilterSelect => {
  return {
    [FilterKeyEnum.Chain]: {
      type: FilterType.Checkbox,
      data: [{ value: ChainId, label: `SideChain ${ChainId}`, disabled: true }],
    },
  };
};

export type FilterItemType = CheckboxItemType;
export type ItemsSelectSourceType = { [x: string]: CheckboxSelectType };
export type CheckboxSelectType = {
  type: FilterType.Checkbox;
  data: SourceItemType[];
};

export interface ICompProps {
  dataSource: FilterItemType;
  defaultValue?: SourceItemType[];
}

export const getComponentByType = (type: FilterType) => {
  const map: {
    [FilterType.Checkbox]: React.FC<CheckboxChoiceProps>;
  } = {
    [FilterType.Checkbox]: CheckBoxGroups,
  };
  return map[type] as React.FC<ICompProps>;
};

export const getFilter = (filterSelect: IFilterSelect) => {
  return {
    chainId: filterSelect.Chain.data[0].value as ChainId,
  };
};
