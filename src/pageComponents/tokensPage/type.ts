import { ChainId } from '@portkey/types';
import CheckBoxGroups, { CheckboxChoiceProps } from './components/CheckBoxGroups';

export enum FilterType {
  Checkbox = 'Checkbox',
}

export type SourceItemType = {
  value: string | number;
  label: string;
  disabled?: boolean;
  count?: string;
};

export enum FilterKeyEnum {
  Chain = 'Chain',
  Traits = 'Traits',
  Generation = 'Generation',
}

export const DEFAULT_FILTER_OPEN_KEYS = [FilterKeyEnum.Chain, FilterKeyEnum.Generation];

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
    {
      key: FilterKeyEnum.Traits,
      title: FilterKeyEnum.Traits,
      type: FilterType.Checkbox,
      data: [],
    },
    {
      key: FilterKeyEnum.Generation,
      title: FilterKeyEnum.Generation,
      type: FilterType.Checkbox,
      // TODO: adjust the data
      data: [
        {
          value: '1',
          label: '1',
          count: '444,444,444',
        },
        {
          value: '2',
          label: '2',
          count: '444,444,444',
        },
        {
          value: '3',
          label: '3',
          count: '444,444,444',
        },
        {
          value: '4',
          label: '4',
          count: '444,444,444',
        },
        {
          value: '5',
          label: '5',
          count: '444,444,444',
        },
        {
          value: '6',
          label: '6',
          count: '444,444,444',
        },
        {
          value: '7',
          label: '7',
          count: '444,444,444',
        },
        {
          value: '8',
          label: '8',
          count: '444,444,444',
        },
        {
          value: '9',
          label: '9',
          count: '444,444,444',
        },
      ],
    },
  ];
  return filterList;
};

export interface IFilterSelect {
  [FilterKeyEnum.Chain]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.Traits]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.Generation]: {
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
    [FilterKeyEnum.Traits]: {
      type: FilterType.Checkbox,
      data: [],
    },
    [FilterKeyEnum.Generation]: {
      type: FilterType.Checkbox,
      data: [],
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
  onChange: (val: ItemsSelectSourceType) => void;
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
    generations: filterSelect.Generation.data.map((item) => item.value),
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
          let label = element.label;
          if (key === FilterKeyEnum.Generation) {
            label = `Gen-${element.value}`;
          }
          result.push({
            type: key,
            ...element,
            label,
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
