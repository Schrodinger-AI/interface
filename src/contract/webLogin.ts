import { SendOptions } from '@portkey/types';
import { ICallContractParams } from '@aelf-web-login/wallet-adapter-base';

export interface IWebLoginArgs {
  address: string;
  chainId: string;
}

type MethodType = <T, R>(params: ICallContractParams<T>, sendOptions?: SendOptions | SendOptions) => Promise<R>;

export default class WebLoginInstance {
  public contract: any;
  public address: string | undefined;
  public chainId: string | undefined;

  private static instance: WebLoginInstance | null = null;
  private sendMethod?: MethodType = undefined;
  private viewMethod?: MethodType = undefined;

  constructor(options?: IWebLoginArgs) {
    this.address = options?.address;
    this.chainId = options?.chainId;
  }
  static get() {
    if (!WebLoginInstance.instance) {
      WebLoginInstance.instance = new WebLoginInstance();
    }
    return WebLoginInstance.instance;
  }

  setContractMethod(contractMethod: { sendMethod: MethodType; viewMethod: MethodType }) {
    this.sendMethod = contractMethod.sendMethod;
    this.viewMethod = contractMethod.viewMethod;
  }

  callSendMethod<T, R>(params: ICallContractParams<T>): Promise<R> {
    return this.sendMethod!(params);
  }

  callViewMethod<T, R>(params: ICallContractParams<T>): Promise<R> {
    return this.viewMethod!(params);
  }
}

export const webLoginInstance = WebLoginInstance.get();
