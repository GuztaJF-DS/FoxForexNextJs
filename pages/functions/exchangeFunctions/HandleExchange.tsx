import api from "api/AxiosConnection";
import { IForexTypes } from "interfaces/IExchange";
import { CalculateProfit } from "functions/exchangeFunctions/CalculateProfit";
import { SearchforTheLastTrade } from "functions/exchangeFunctions/SearchforTheLastTrade";

export async function HandleExchange(id:string,CurrencyData:IForexTypes,setTriggerRefresh:any,triggerRefresh:any,setExpectProfit:any){
    const now = new Date().toISOString();
    const TradeData=await SearchforTheLastTrade(id);
    const profitValues=CalculateProfit(TradeData,CurrencyData);
  
    const query={Profit:profitValues.FinalProfit,FinalDate:now,PipQtd:profitValues.PipQtd,PipPrice:profitValues.PipPrice,userId:id};
    const result=await api.post("/trade/updatefinished",query);
    if(result){
        if(setTriggerRefresh!=="Test"){
          setTriggerRefresh(!triggerRefresh);
          setExpectProfit(0);
        }
        return result.data;
    }
  }