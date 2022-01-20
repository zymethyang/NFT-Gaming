export interface IFish {
  name: string;
  image: string;
  fishedBy: string;
}

export interface IBlock {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  nonce: string;
  timeStamp: string;
  to: string;
  tokenDecimal: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
}

export interface IDiamond {
  diamondId: string;
  image: string;
  name: string;
  company: string;
  owner: string;
}

export interface IDiamondHistory {
  ownerAddress: string;
  price: number;
}

export interface IReceipt {
  clientId: string;
  clientName: string;
  diamondId: string;
}
