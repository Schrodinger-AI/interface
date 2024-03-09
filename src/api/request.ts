import request, { cmsRequest, tokenRequest } from './axios';
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

export const getPoints = async (params: IGetPointsParams): Promise<IGetPointsData> => {
  return request.get('/app/my/points', { params });
};
