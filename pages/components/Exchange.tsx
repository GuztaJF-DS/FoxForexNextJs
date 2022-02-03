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

export default function Exchange(props:any){
    const websocket=props.socket;
    const [CurrencyData,setCurrencyData]=useState<IForexTypes>({
        symbol: "",
        ts:"",
        bid: 0,
        ask:0,
        mid:0
    })
    const [LotsInput,SetLotsInput]=useState("0")

  useEffect(()=>{
    websocket.on("sendData",(data:any)=>{
        setCurrencyData(JSON.parse(data))
   })
   return () => {
     websocket.disconnect();
   }
 },[])    

 function HandleBuyOrSell(type:boolean){
    let now = new Date().toISOString()
    let LotsNumber=parseFloat(LotsInput)
    if(CurrencyData.mid!==0 && LotsInput.length!==0 && LotsNumber>0){
      let query={"Lots":LotsInput,"ExchangeType":type,"StartDate":now,"SwapTax":0.5,"NextOpening":CurrencyData.mid}
      api.post("/trade/createunfinished",query)
      .then(function(data:any){
        SetLotsInput("0");
      })
    }
  }

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
              <button onClick={()=>console.log(LotsInput)} data-testid="SellButton" className={styles.SellButton}>Sell</button>
              
              <input className={styles.Lots} value={LotsInput}
                onChange={(e)=>SetLotsInput(e.target.value)}
                type={styles.number} data-testid="lotsInput"/>

              <button onClick={()=>console.log(true)} data-testid="BuyButton" className={styles.BuyButton}>Buy</button>
              <div>
                <button onClick={()=>console.log('asd')} className={styles.ExchangeButton}>Exchange</button>
              </div>
          </div>
        </div></>
    )
}