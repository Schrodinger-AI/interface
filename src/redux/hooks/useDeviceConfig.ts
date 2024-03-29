import { useEffect, useState } from 'react';
import { TCustomizationType, TCustomizationItemType } from 'redux/types/reducerTypes';
import { useCmsInfo } from '.';
import { jsonParse } from 'utils/common';

const { platform } = window?.portkeyShellApp?.deviceEnv ?? {};

export default function useDeviceCmsConfig() {
  const { customization = '{}' } = useCmsInfo() || {};
  const [parsedResult, setParsedResult] = useState<TCustomizationItemType>();

  useEffect(() => {
    try {
      const parsed: TCustomizationType = jsonParse(customization);

      if (platform === 'android') {
        setParsedResult(parsed.android);
      } else if (platform === 'ios') {
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
