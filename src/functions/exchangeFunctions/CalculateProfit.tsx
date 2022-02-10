import {IForexTypes,ITradeTypes,Profit} from "../../interfaces/IExchange";
import PipFunction from "./pipFunction";
import SwapFunction from "./swapFunctions";
import FinalProfitFunction from "./finalProfitFunction";

export default function CalculateProfit(trade:ITradeTypes,CurrencyData:IForexTypes){
    const pip=PipFunction(trade.NextOpening,CurrencyData.mid,trade.ExchangeType,trade.Lots);
    const swap=SwapFunction(pip.PipPrice,trade.ExchangeType,trade.Lots,trade.SwapTax,0);
    const finalProfit=FinalProfitFunction(pip.Profit,swap);
    const ProfitObject:Profit={FinalProfit:finalProfit,PipQtd:pip.PipQtd,PipPrice:pip.PipPrice};
    return ProfitObject;
  }