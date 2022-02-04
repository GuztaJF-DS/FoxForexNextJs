import styles from '../../styles/Main.module.css'
import { useState,useEffect } from 'react';
import api from '../api/AxiosConnection'

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


function HandleBuyOrSell(type:boolean,LotsInput:string,CurrencyData:IForexTypes,id:string){
  let now = new Date().toISOString()
  let LotsNumber=parseFloat(LotsInput)
  if(CurrencyData.mid!==0 && LotsInput.length!==0 && LotsNumber>0){
    let query={Lots:LotsInput,ExchangeType:type,StartDate:now,SwapTax:0.5,NextOpening:CurrencyData.mid,userId:id}
    console.log(query)
    api.post("/trade/createunfinished",query)
    .then(function(data:any){
      console.log(data)
      return "0";
    })
  }
  return "0";
}

function HandleExchange(profitValues:Profit,id:string){
  let now = new Date().toISOString()

  let query={Profit:profitValues.FinalProfit,FinalDate:now,PipQtd:profitValues.PipQtd,PipPrice:profitValues.PipPrice,userId:id}

    api.post("/trade/updatefinished",query)
    .then(function(data:any){
      //setTriggerRefresh(!triggerRefresh)
      //HandleUserUpdate(0,profitValues.FinalProfit)
      console.log("Worked")
      return true
    })
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
    const [Id,SetId]=useState("")

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
                <button onClick={()=>console.log(true)} className={styles.ExchangeButton}>Exchange</button>
              </div>
          </div>
        </div></>
    )
}