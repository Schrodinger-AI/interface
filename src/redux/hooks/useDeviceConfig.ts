import { useEffect, useState } from 'react';
import { TCustomizationType, TCustomizationItemType } from 'redux/types/reducerTypes';
import { useCmsInfo } from '.';
import { jsonParse } from 'utils/common';
import { MethodType, SentryMessageType, captureMessage } from 'utils/captureMessage';

export default function useDeviceCmsConfig() {
  const { customization = '{}' } = useCmsInfo() || {};
  const [parsedResult, setParsedResult] = useState<TCustomizationItemType>();

  useEffect(() => {
    const { platform } = window?.portkeyShellApp?.deviceEnv ?? {};
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
      console.error(e, 'parse globalConfig failed');
      captureMessage({
        type: SentryMessageType.ERROR,
        params: {
          name: 'jsonParseFailed',
          method: MethodType.NON,
          description: e,
        },
      });
    }
  }, [customization]);

  return parsedResult;
}
