import request, { tokenRequest } from './axios';
import qs from 'qs';

export const fetchEtherscan = async (): Promise<any> => {
  return request.get('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YourApiKeyToken');
};

export const checkDomain = async (): Promise<any> => {
  return request.get('/app/domain/check');
};

export const fetchToken = async (data: ITokenParams) => {
  return tokenRequest.post<
    ITokenParams,
    {
      access_token: string;
      expires_in: number;
    }
  >('/token', qs.stringify(data) as any);
};

export const fetchCmsConfigInfo = async (): Promise<any> => {
  return request.get('/app/config');
};

export const fetchInscriptionDetail = async (): Promise<any> => {
  // return request.get('/app/config');

  return {
    data: {
      name: 'string',
      symbol: 'string',
      image: 'string',
      amount: 'string',
      generation: 'string',
      blockTime: 'string',
      traits: 'string',
    },
  };
};

export const fetchSchrodingerImagesByAdoptId = async ({
  adoptId,
}: {
  adoptId: string;
}): Promise<ISchrodingerImages> => {
  // return request.get(`/api/app/schrodinger/images?adoptId=${adoptId}`);
  console.log(adoptId, 'adoptId==');
  return {
    items: [
      {
        generation: 1,
        traits: [
          {
            traitType: '',
            value: '',
            percent: 11.11,
          },
        ],
      },
    ],
    images: [
      {
        name: '',
        value: '',

        traits: [{ traitType: '', value: '' }],
        image: '',
        waterMarkImage: '',
        secretImage: '',
        secretWaterMarkImage: '',
      },
    ],
    extraData: {},
  };
};
