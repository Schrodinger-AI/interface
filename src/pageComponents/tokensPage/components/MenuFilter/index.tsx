import { useMemo } from 'react';
import { Flex } from 'antd';
import { SubTraitFilter } from 'components/SubTraitFilter';
import { FilterKeyEnum, FilterType, MenuCheckboxItemDataType, MenuCheckboxSelectType } from '../../type';

export interface IMenuFilterProps {
  label: string;
  count?: string;
}

interface IMenuCheckboxItemProps {
  itemKey: FilterKeyEnum;
  parentLabel: string;
  parentValue: string;
  value: MenuCheckboxItemDataType[];
  onChange: (value: { [x: string]: MenuCheckboxSelectType }) => void;
}

function MenuCheckboxItem({ itemKey, parentLabel, parentValue, value, onChange }: IMenuCheckboxItemProps) {
  const selectValues = useMemo(
    () => value.find((i) => i.value === parentValue)?.values?.map((i) => i.value) || [],
    [parentValue, value],
  );

  return (
    <SubTraitFilter
      traitType={parentValue}
      selectValues={selectValues}
      onChange={(checkedValues) => {
        const otherData = value.filter((i) => i.value !== parentValue);
        onChange({
          [itemKey]: {
            type: FilterType.MenuCheckbox,
            data: [
              ...otherData,
              {
                label: parentLabel,
                value: parentValue,
                values: checkedValues.map((i) => ({ label: i, value: i })),
              },
            ],
          },
        });
      }}
    />
  );
}

interface IMenuFilterComponent extends React.FC<IMenuFilterProps> {
  child: typeof MenuCheckboxItem;
}

const MenuFilter: IMenuFilterComponent = ({ label, count }) => {
  return (
    <Flex justify="space-between">
      <span>{label}</span>
      <span>{count ?? '0'}</span>
    </Flex>
  );
};

MenuFilter.child = MenuCheckboxItem;

export default MenuFilter;
