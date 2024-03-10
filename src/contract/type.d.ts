interface ITransactionResult {
  TransactionId: string;
  Status: string;
  Logs: ITransactionLog[];
  [props: string]: any;
}

interface IClaimDropResult {
  currentAmount: string;
  totalAmount: string;
  dropId: string;
  claimDetailList?: {
    value: IClaimDetailRecordList[];
  };
  TransactionId: string;
  address: string;
}

interface IConfirmAdoptParams {
  adoptId: string;
  image: string;
  signature: string;
}

interface IResetSGRParams {
  symbol: string;
  amount: number;
  domain: string;
}
