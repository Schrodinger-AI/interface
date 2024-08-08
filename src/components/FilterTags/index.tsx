import { memo, useCallback, useMemo } from 'react';
import { FilterType, ItemsSelectSourceType, IFilterSelect, TagItemType, SEARCH_TAG_ITEM_TYPE } from 'types/tokensPage';
import styles from './style.module.css';
import { ReactComponent as CloseIcon } from 'assets/img/close.svg';
import { Ellipsis } from 'antd-mobile';
import clsx from 'clsx';
import { OmittedType, getOmittedStr } from 'utils/addressFormatting';
import { TModalTheme } from 'components/CommonModal';

function FilterTags({
  filterSelect,
  onchange,
  tagList,
  theme,
  clearAll,
  clearSearchChange,
}: {
  tagList: TagItemType[];
  filterSelect: IFilterSelect;
  theme?: TModalTheme;
  onchange?: (result: ItemsSelectSourceType) => void;
  clearSearchChange?: () => void;
  clearAll?: () => void;
}) {
  const closeChange = useCallback(
    (tag: TagItemType) => {
      if (tag.type === SEARCH_TAG_ITEM_TYPE) {
        clearSearchChange && clearSearchChange();
      } else {
        const filter = filterSelect[tag.type];
        if (filter.type === FilterType.Checkbox) {
          const data = filter.data;
          const result = {
            [tag.type]: {
              ...filter,
              data: data.filter((item) => item.value !== tag.value),
            },
          };
          onchange && onchange(result);
        } else if (filter.type === FilterType.MenuCheckbox) {
          const data = filter.data;
          const result = {
            [tag.type]: {
              ...filter,
              data: data.map((item) => {
                if (item.value === tag.parentValue) {
                  return {
                    ...item,
                    values: item.values?.filter((subItem) => subItem.value !== tag.subValue),
                  };
                }
                return item;
              }),
            },
          };
          onchange && onchange(result);
        }
      }
    },
    [filterSelect, onchange, clearSearchChange],
  );

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const clearAllDom = useMemo(() => {
    return (
      <div
        className={clsx(styles.filter__button, isDark ? 'text-pixelsTertiaryTextPurple' : 'text-brandDefault')}
        onClick={clearAll}>
        Clear All
      </div>
    );
  }, [clearAll, isDark]);

  return tagList.length ? (
    <div className={clsx(styles['filter-tags'], isDark && 'bg-pixelsPageBg')}>
      <div className={styles['filter-tags-container']}>
        {tagList.map((tag, index) => {
          return (
            <div
              key={`${tag.label}_${index}`}
              className={clsx(
                styles['tag-item'],
                isDark && styles['tag-item-dark'],
                isDark ? 'rounded-none bg-pixelsModalBg' : 'rounded-lg bg-neutralDefaultBg',
              )}>
              {tag.type === SEARCH_TAG_ITEM_TYPE ? (
                <div>
                  <Ellipsis
                    className={clsx(
                      styles['tag-label'],
                      'break-words',
                      isDark ? 'text-pixelsDivider' : 'text-neutralPrimary',
                    )}
                    direction="middle"
                    content={getOmittedStr(tag.label, OmittedType.CUSTOM, { prevLen: 7, endLen: 6, limitLen: 13 })}
                  />
                </div>
              ) : (
                <span className={clsx(styles['tag-label'], isDark ? 'text-pixelsDivider' : 'text-neutralPrimary')}>
                  {tag.label}
                </span>
              )}
              <CloseIcon
                className={clsx(
                  styles['tag-close'],
                  tag.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                  isDark ? 'text-pixelsDivider' : 'text-neutralTitle',
                )}
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
