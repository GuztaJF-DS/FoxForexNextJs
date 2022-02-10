export interface IForexTypes{
    symbol:string;
    ts:string;
    bid:number;
    ask:number;
    mid:number;
}

export interface ITradeTypes{
  ExchangeType: boolean;
  Finished: boolean;
  Lots: number;
  NextOpening: number;
  StartDate: string;
  SwapTax: number;
  __v: number;
  _id: string;
}

export interface Profit{ 
  FinalProfit: number;
  PipQtd: number;
  PipPrice: number;
}