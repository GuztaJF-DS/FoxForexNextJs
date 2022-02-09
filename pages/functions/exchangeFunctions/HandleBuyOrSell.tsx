import api from "api/AxiosConnection";
import {IForexTypes} from "interfaces/IExchange";

export function HandleBuyOrSell(type:boolean,LotsInput:string,CurrencyData:IForexTypes,id:string,setTriggerRefresh:any,triggerRefresh:any){
  const now = new Date().toISOString();
    const LotsNumber=parseFloat(LotsInput);
    if(CurrencyData.mid!==0 && LotsInput.length!==0 && LotsNumber>0){
      const query={Lots:LotsInput,ExchangeType:type,StartDate:now,SwapTax:0.5,NextOpening:CurrencyData.mid,userId:id};
      api.post("/trade/createunfinished",query)
      .then(function(){
        if(setTriggerRefresh!=="Test"){
          setTriggerRefresh(!triggerRefresh);
        }
      });
    }
    return "0";
  }