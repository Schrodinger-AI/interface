import { SendOptions } from '@portkey/types';
import { ICallContractParams } from '@aelf-web-login/wallet-adapter-base';
import { SupportedELFChainId } from 'types';

export interface IWebLoginArgs {
  address: string;
  chainId: string;
}

type MethodType = <T, R>(params: ICallContractParams<T>, sendOptions?: SendOptions | SendOptions) => Promise<R>;

export default class ForestWebLoginInstance {
  public contract: any;
  public address: string | undefined;
  public chainId: string | undefined;

  private static instance: ForestWebLoginInstance | null = null;
  // private context: WebLoginInterface | null = null;
  private aelfSendMethod?: MethodType = undefined;
  private aelfViewMethod?: MethodType = undefined;
  private tdvvSendMethod?: MethodType = undefined;
  private tdvvViewMethod?: MethodType = undefined;
  private tdvwSendMethod?: MethodType = undefined;
  private tdvwViewMethod?: MethodType = undefined;

  constructor(options?: IWebLoginArgs) {
    this.address = options?.address;
    this.chainId = options?.chainId;
  }
  static get() {
    if (!ForestWebLoginInstance.instance) {
      ForestWebLoginInstance.instance = new ForestWebLoginInstance();
    }

    return ForestWebLoginInstance.instance;
  }

  setMethod({ chain, sendMethod, viewMethod }: { chain: Chain; sendMethod: MethodType; viewMethod: MethodType }) {
    switch (chain) {
      case SupportedELFChainId.MAIN_NET: {
        this.aelfSendMethod = sendMethod;
        this.aelfViewMethod = viewMethod;
        break;
      }
      case SupportedELFChainId.TDVV_NET: {
        this.tdvvSendMethod = sendMethod;
        this.tdvvViewMethod = viewMethod;
        break;
      }
      case SupportedELFChainId.TDVW_NET: {
        this.tdvwSendMethod = sendMethod;
        this.tdvwViewMethod = viewMethod;
        break;
      }
    }
  }

  setContractMethod(
    contractMethod: {
      chain: Chain;
      sendMethod: MethodType;
      viewMethod: MethodType;
    }[],
  ) {
    contractMethod.forEach((item) => {
      this.setMethod(item);
    });
  }

  callSendMethod<T, R>(chain: Chain, params: ICallContractParams<T>): Promise<R> {
    switch (chain) {
      case SupportedELFChainId.MAIN_NET:
        return this.aelfSendMethod!(params);
      case SupportedELFChainId.TDVV_NET:
        return this.tdvvSendMethod!(params);
      case SupportedELFChainId.TDVW_NET:
        return this.tdvwSendMethod!(params);
    }
    throw new Error('Error: Invalid chainId');
  }

  callViewMethod<T, R>(chain: Chain, params: ICallContractParams<T>): Promise<R> {
    switch (chain) {
      case SupportedELFChainId.MAIN_NET:
        return this.aelfViewMethod!(params);
      case SupportedELFChainId.TDVV_NET:
        return this.tdvvViewMethod!(params);
      case SupportedELFChainId.TDVW_NET:
        return this.tdvwViewMethod!(params);
    }
    throw new Error('Error: Invalid chainId');
  }
}

export const forestWebLoginInstance = ForestWebLoginInstance.get();
