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

export type TagItemType = {
  label: string;
  type: string;
  value?: string | number;
  disabled?: boolean;
};

export const getTagList = (filterSelect: IFilterSelect, search: string) => {
  const result: TagItemType[] = [];
  for (const [key, value] of Object.entries(filterSelect)) {
    const { data, type } = value;
    if (type === FilterType.Checkbox) {
      data.forEach((element: SourceItemType) => {
        if (!element.disabled) {
          result.push({
            type: key,
            ...element,
          });
        }
      });
    }
  }
  if (search) {
    result.push({
      type: 'search',
      label: search,
    });
  }

  return result;
};
