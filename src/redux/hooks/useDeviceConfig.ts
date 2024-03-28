import { useEffect, useState } from 'react';
import { TCustomizationType, TCustomizationItemType } from 'redux/types/reducerTypes';
import isMobile from 'utils/isMobile';
import { useCmsInfo } from '.';
import { jsonParse } from 'utils/common';

export default function useDeviceCmsConfig() {
  const { customization = '{}' } = useCmsInfo() || {};
  const [parsedResult, setParsedResult] = useState<TCustomizationItemType>();

  useEffect(() => {
    try {
      const parsed: TCustomizationType = jsonParse(customization);

      if (isMobile().android.device) {
        setParsedResult(parsed.android);
      } else if (isMobile().apple.device) {
        setParsedResult(parsed.ios);
      } else {
        setParsedResult(parsed.pc);
      }
    } catch (e) {
      console.error(e, 'parse routerItems failed');
    }
  }, [customization]);

  return parsedResult;
}
