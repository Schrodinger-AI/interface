import { memo, useCallback, useMemo } from 'react';
import {
  FilterKeyEnum,
  FilterType,
  ItemsSelectSourceType,
  SourceItemType,
  IFilterSelect,
  TagItemType,
} from '../../type';
import styles from './style.module.css';
import { ReactComponent as CloseIcon } from 'assets/img/close.svg';
import { Ellipsis } from 'antd-mobile';
import clsx from 'clsx';
import { OmittedType, getOmittedStr } from 'utils';

function FilterTags({
  filterSelect,
  onchange,
  tagList,
  clearAll,
  clearSearchChange,
}: {
  tagList: TagItemType[];
  filterSelect: IFilterSelect;
  onchange?: (result: ItemsSelectSourceType) => void;
  clearSearchChange?: () => void;
  clearAll?: () => void;
}) {
  const closeChange = useCallback(
    (tag: TagItemType) => {
      if (tag.type === 'search') {
        clearSearchChange && clearSearchChange();
      } else {
        const filter = filterSelect[tag.type as FilterKeyEnum];
        if (filter.type === FilterType.Checkbox) {
          const data = filter.data as SourceItemType[];
          const result = {
            [tag.type]: {
              ...filter,
              data: data.filter((item) => item.value !== tag.value),
            },
          };
          onchange && onchange(result);
        }
      }
    },
    [filterSelect, onchange, clearSearchChange],
  );
  const clearAllDom = useMemo(() => {
    return (
      <div className={styles.filter__button} onClick={clearAll}>
        Clear All
      </div>
    );
  }, [clearAll]);
  return tagList.length ? (
    <div className={clsx(styles['filter-tags'])}>
      <div className={styles['filter-tags-container']}>
        {tagList.map((tag, index) => {
          return (
            <div key={`${tag.label}_${index}`} className={styles['tag-item']}>
              {tag.type === 'search' ? (
                <div>
                  <Ellipsis
                    className={clsx(styles['tag-label'], 'break-words')}
                    direction="middle"
                    content={getOmittedStr(tag.label, OmittedType.CUSTOM, { prevLen: 7, endLen: 6, limitLen: 13 })}
                  />
                </div>
              ) : (
                <span className={styles['tag-label']}>{tag.label}</span>
              )}
              <CloseIcon
                className={clsx(styles['tag-close'], tag.disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
                onClick={() => {
                  if (tag.disabled) return;
                  closeChange(tag);
                }}
              />
            </div>
          );
        })}
        {tagList.length && clearAllDom}
      </div>
    </div>
  ) : (
    <></>
  );
}

export default memo(FilterTags);
