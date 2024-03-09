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
