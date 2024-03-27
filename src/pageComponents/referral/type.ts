export interface IResponse<T = any> {
  status: number;
  msg?: string;
  code?: number;
  data?: T;
}

export interface ISocialShareParams {
  url: string;
  ctw?: 'offline' | 'onLine' | 'local';
  serviceURI?: string;
}

export interface IClient {
  invokeClientMethod(request: IRequest<ISocialShareParams>, callback: (args: IResponse) => void): void;
}

export interface IRequest<T> {
  type: string;
  params?: T;
}
