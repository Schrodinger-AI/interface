import { useMemo } from 'react';
import useResponsive from './useResponsive';

export default function useColumns(collapsed: boolean) {
  const { isMin, isSM, isMD, isLG, is2XL, is3XL } = useResponsive();
  const columns = useMemo(() => {
    let result = 0;
    if (isMin) {
      result = 2;
    } else if (isSM) {
      result = 3;
    } else if (isMD) {
      result = 4;
    } else if (isLG) {
      result = 5;
    } else if (is2XL) {
      result = 6;
    } else if (is3XL) {
      result = 7;
    } else {
      result = 8;
    }
    if (!isLG && collapsed) {
      result -= 2;
    }
    return result;
  }, [isMin, isSM, isMD, isLG, is2XL, is3XL, collapsed]);

  return columns;
}
