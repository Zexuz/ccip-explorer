export interface Message {
  sourceChainSelector: string;
  sequenceNumber: string;
  feeTokenAmount: string;
  sender: string;
  nonce: string;
  gasLimit: string;
  strict: boolean;
  receiver: string;
  data: string;
  tokenAmounts: string[];
  feeToken: string;
  messageId: string;
}
