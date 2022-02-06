import styles from '../../styles/Main.module.css'
import { useState,useEffect } from 'react';
import api from '../api/AxiosConnection'
import PipFunction from '../functions/pipFunction'
import SwapFunction from '../functions/swapFunctions'
import FinalProfitFunction from '../functions/finalProfitFunction'

interface IForexTypes{
    symbol:string;
    ts:string;
    bid:number;
    ask:number;
    mid:number;
}

interface ITradeTypes{
  ExchangeType: boolean;
  Finished: boolean;
  Lots: number;
  NextOpening: number;
  StartDate: string;
  SwapTax: number;
  __v: number;
  _id: string;
}

type Profit={ 
  FinalProfit: number;
  PipQtd: number;
  PipPrice: number;
};


export function HandleBuyOrSell(type:boolean,LotsInput:string,CurrencyData:IForexTypes,id:string){
  let now = new Date().toISOString()
  let LotsNumber=parseFloat(LotsInput)
  if(CurrencyData.mid!==0 && LotsInput.length!==0 && LotsNumber>0){
    let query={Lots:LotsInput,ExchangeType:type,StartDate:now,SwapTax:0.5,NextOpening:CurrencyData.mid,userId:id}
    api.post("/trade/createunfinished",query)
    .then(function(data:any){
      return "0";
    })
  }
  return "0";
}

export async function HandleExchange(id:string,CurrencyData:IForexTypes){
  let now = new Date().toISOString()
  let TradeData=await SearchforTheLastTrade(id)
  let profitValues=CalculateProfit(TradeData,CurrencyData)

  let query={Profit:profitValues.FinalProfit,FinalDate:now,PipQtd:profitValues.PipQtd,PipPrice:profitValues.PipPrice,userId:id}
  let result=await api.post("/trade/updatefinished",query)
  if(result){
      //setTriggerRefresh(!triggerRefresh)
      //HandleUserUpdate(0,profitValues.FinalProfit)
      return result.data
  }
}

export function CalculateProfit(trade:ITradeTypes,CurrencyData:IForexTypes){
  let pip=PipFunction(trade.NextOpening,CurrencyData.mid,trade.ExchangeType,trade.Lots)
  let swap=SwapFunction(pip.PipPrice,trade.ExchangeType,trade.Lots,trade.SwapTax,0);
  let finalProfit=FinalProfitFunction(pip.Profit,swap)
  let ProfitObject:Profit={FinalProfit:finalProfit,PipQtd:pip.PipQtd,PipPrice:pip.PipPrice};
  return ProfitObject;
}

export async function SearchforTheLastTrade(id:string){
  let TableData:any=await api.post("/trade/getall",{userId:id});
  if(TableData){
    TableData=TableData.data;
    if(TableData[TableData.length-1].Finished===false){
      return TableData[TableData.length-1]
    }
    else{
      return{
        ExchangeType: false,
         Finished: false,
         Lots: 0,
         NextOpening: 0,
         StartDate: '',
         SwapTax: 0,
         __v: 0,
         _id: ''
     }
    }
  }
}

export default function Exchange(props:any){
    const websocket=props.socket;
    
    const [CurrencyData,setCurrencyData]=useState<IForexTypes>({
        symbol: "",
        ts:"",
        bid: 0,
        ask:0,
        mid:0
    })
    const [LotsInput,SetLotsInput]=useState("0");
    const [Id,SetId]=useState("");

  useEffect(()=>{
    if (typeof window !== "undefined") {
      SetId(localStorage.getItem("UserId")!);
    }
    websocket.on("sendData",(data:any)=>{
        setCurrencyData(JSON.parse(data))
    })
    return () => {
      websocket.disconnect();
    }
  },[websocket])   
    

    return(
        <>
        <div className={styles.BidAndOffer}>
            <div className={styles.Bid}>
            Bid:
            <div>
                {CurrencyData.bid}
            </div>
            Opening:
            <div>
                {CurrencyData.mid}
            </div>
            </div>

            <div className={styles.profitColor}>
            Expected Profit:
            <div>
               0
            </div>
            </div>

            <div className={styles.Offer}>
            Offer:
            <div>
                {CurrencyData.ask}
            </div>
            Last Trade Closure:
            <div >
                0
            </div>
            </div>
        </div>

        <div className={styles.Exchange}>
        <p>Lots</p>
          <div className={styles.Buttons}>
              <button onClick={()=>SetLotsInput(HandleBuyOrSell(false,LotsInput,CurrencyData,Id))} data-testid="SellButton" className={styles.SellButton}>Sell</button>
              
              <input className={styles.Lots} value={LotsInput}
                onChange={(e)=>SetLotsInput(e.target.value)}
                type="number" data-testid="lotsInput"/>

              <button onClick={()=>SetLotsInput(HandleBuyOrSell(true,LotsInput,CurrencyData,Id))} data-testid="BuyButton" className={styles.BuyButton}>Buy</button>
              <div>
                <button onClick={async()=>await HandleExchange(Id,CurrencyData)} className={styles.ExchangeButton}>Exchange</button>
              </div>
          </div>
        </div></>
    )
}