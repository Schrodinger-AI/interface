import { ICatsListData, TSGRTokenInfo } from 'types/tokens';
import {
  IActivityDetailData,
  IRankListData,
  TCustomizationItemType,
  TGlobalConfigType,
} from 'redux/types/reducerTypes';
import request, { cmsRequest, tokenRequest } from './axios';
import qs from 'qs';
import { IEventsConfig, IEventsDetailData, IEventsDetailListTable } from 'pageComponents/events-detail/types/type';

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

export const fetchSchrodingerImagesByAdoptId = async ({ adoptId }: { adoptId: string }): Promise<IAdoptImageInfo> => {
  return request.get(`/app/schrodinger/imageInfo?adoptId=${adoptId}`);
};

export const fetchWaterImageRequest = async (data: IWaterImageRequest): Promise<IWaterImage> => {
  return request.post(`/app/schrodinger/waterMarkImageInfo`, data, {
    headers: { Accept: 'text/plain;v=1.0', 'Content-Type': 'application/json' },
  });
};

export const getPoints = async (params: IGetPointsParams): Promise<IGetPointsData> => {
  return request.get('/app/my/points', { params });
};

export const checkAIService = () => request.get<boolean>('/app/schrodinger/IsOverloaded');

export const catsRankProbability = async (data: ICatsRankProbabilityParams): Promise<ICatsRankProbabilityData[]> => {
  return request.post('/app/item/level', data);
};

export const catsList = async (data: ICatsListParams): Promise<ICatsListData> => {
  return request.post('/app/cat/list', data);
};

export const catsListAll = async (data: ICatsListParams): Promise<ICatsListData> => {
  return request.post('/app/cat/all', data);
};

export const getGlobalConfig = async (): Promise<{ data: TGlobalConfigType }> => {
  return cmsRequest.get('/items/schrodingerDefaultConfig');
};

export const getDefaultCustomization = async (): Promise<{ data: TCustomizationItemType }> => {
  return cmsRequest.get('/items/schrodingerCustomization');
};

export const getAndroidCustomization = async (): Promise<{ data: TCustomizationItemType }> => {
  return cmsRequest.get('/items/schrodingerAndroidCustomization');
};

export const getIOSCustomization = async (): Promise<{ data: TCustomizationItemType }> => {
  return cmsRequest.get('/items/schrodingerIOSCustomization');
};

export const getCatDetail = async (params: ICatDetailParams): Promise<TSGRTokenInfo> => {
  return request.post('/app/cat/detail', params);
};

export const getRankList = async (): Promise<{ data: IRankListData }> => {
  return cmsRequest.get('/items/ranking_list');
};

export const getActivityDetail = async (): Promise<{ data: IActivityDetailData }> => {
  return cmsRequest.get('/items/activity_detail');
};

export const getActivityDetailPortkey = async (): Promise<{ data: IActivityDetailData }> => {
  return cmsRequest.get('/items/activity_detail_portkey');
};

export const messageUnreadCount = async (data: {
  address: string;
}): Promise<{
  count: number;
}> => {
  return request.post('/app/message/unread-count', data);
};

export const messageList = async (data: ITransactionMessageListParams): Promise<ITransactionMessageListData> => {
  return request.post('/app/message/list ', data);
};

export const bindAddress = async (data: {
  aelfAddress: string;
  evmAddress: string;
  signature: string;
  publicKey: string;
}): Promise<void> => {
  return request.post('/app/bind-address', data);
};

export const getActivityDetailJoint = async (): Promise<{ data: IActivityDetailData }> => {
  return cmsRequest.get('/items/activity_detail_joint');
};

export const activityInfo = async (): Promise<{
  hasNewActivity: boolean;
}> => {
  return request.get('/app/activity/info');
};

export const activityList = async (params: { skipCount?: number; maxResultCount?: number }): Promise<IActivityList> => {
  return request.get('/app/activity/list', { params });
};

export const bindAddressActivity = async (data: {
  aelfAddress: string;
  sourceChainAddress: string;
  signature: string;
  publicKey: string;
  activityId: string;
}): Promise<void> => {
  return request.post('/app/activity/bind-address', data);
};

export const addressRelation = async (data: {
  aelfAddress: string;
  activityId: string;
}): Promise<{
  sourceChainAddress?: string;
}> => {
  return request.post('/app/activity/address-relation', data);
};

export const getEventRankList = async <T = any>(url: string, data?: T): Promise<IEventsDetailListTable> => {
  return request.post(url, data);
};

export const getEventDetail = async (id: string): Promise<{ data: IEventsDetailData }> => {
  return cmsRequest.get(`/items/event_detail_${id}`);
};

export const getEventResultDetail = async (id: string): Promise<{ data: IEventsDetailData }> => {
  return cmsRequest.get(`/items/event_detail_result_${id}`);
};

export const getEventsConfig = async (params: { activityId: string }): Promise<IEventsConfig> => {
  return request.get('/app/activity/stage', { params });
};
