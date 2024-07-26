import { Trade, Collection, ForestProvider, useForestStore } from 'forest-ui-react';
import 'forest-ui-react/dist/assets/index.css';
import { useEffect, useState } from 'react';
import { fetchForestConfigItems } from 'api/request';

export default ({ children }: { children: React.ReactNode }) => {
  const [state, { dispatch }] = useForestStore();
  const [loading, setLoading] = useState(false);

  const fetchForestConfig = async () => {
    setLoading(true);
    try {
      const { data } = await fetchForestConfigItems();
      dispatch({
        type: 'setAelfInfo',
        payload: {
          aelfInfo: data,
        },
      });

      dispatch({
        type: 'setCurChain',
        payload: {
          chain: data.curChain,
        },
      });
    } catch (error) {
      dispatch({
        type: 'setAelfInfo',
        payload: {
          officialWebsiteOfSchrodinger: 'https://schrodingerai.com/',
          ipfsToS3ImageURL: 'https://schrodinger-testnet.s3.amazonaws.com/watermarkimage',
          ipfsToSchrodingerURL: 'https://ipfs.schrodingerai.com/ipfs',
        },
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchForestConfig();
  }, []);

  if (loading) {
    return null;
  }

  return <div>{children}</div>;
};
