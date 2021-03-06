/* eslint-disable react-hooks/exhaustive-deps */
import styles from "../../styles/Main.module.css";
import { useState,useEffect } from "react";
import HandleBuyOrSell from "../../src/functions/exchangeFunctions/HandleBuyOrSell";
import HandleExchange from "../../src/functions/exchangeFunctions/HandleExchange";
import CalculateProfit from "../../src/functions/exchangeFunctions/CalculateProfit";
import SearchforTheLastTrade from "../../src/functions/exchangeFunctions/SearchforTheLastTrade";
import { IForexTypes,ITradeTypes } from "../../src/interfaces/IExchange";
import { useTriggerRefreshContext } from "../../src/context/triggerRefreshContext";
import { useTranslation } from "next-i18next";

export default function Exchange(props:any){
  const websocket=props.socket;
  
  const {triggerRefresh,setTriggerRefresh}=useTriggerRefreshContext();
  const [CurrencyData,setCurrencyData]=useState<IForexTypes>({
      symbol: "",
      ts:"",
      bid: 0,
      ask:0,
      mid:0
  });
  const [LotsInput,SetLotsInput]=useState("0");
  const [Id,SetId]=useState("");
  const [ExpectedProfit,setExpectProfit]=useState(0);
  const [TradeColor,setTradeColor]=useState("#ffffff");
  const [TradeInfo,setTradeInfo]=useState<ITradeTypes>({
    ExchangeType: false,
    Finished: false,
    Lots: 0,
    NextOpening: 0,
    StartDate: "",
    SwapTax: 0,
    __v: 0,
    _id: ""
 });

 const { t } = useTranslation("exchange");

  useEffect(()=>{
    if (typeof window !== "undefined") {
      SetId(localStorage.getItem("UserId")!);
    }
    websocket.on("sendData",(data:any)=>{
        setCurrencyData(JSON.parse(data));
    });
    return () => {
      websocket.disconnect();
    };
  },[websocket]);

  useEffect(()=>{
    async function fetchData(){
      if(Id!==""){
        const trade=await SearchforTheLastTrade(Id);
        setTradeInfo(trade);
      }
    }
    fetchData();
  },[triggerRefresh]);

  useEffect(()=>{
    if(TradeInfo.NextOpening!==0){
      const profit=CalculateProfit(TradeInfo,CurrencyData);
      if(TradeInfo.ExchangeType===true){
        if(TradeInfo.NextOpening<CurrencyData.mid){
          setTradeColor("red");
        }
        else{
          setTradeColor("green");
        }
      }
      else{
        if(TradeInfo.NextOpening>CurrencyData.mid){
          setTradeColor("red");
        }
        else{
          setTradeColor("green");
        }
      }
      
      setExpectProfit(profit.FinalProfit);
    }
    else{
      setTradeColor("#ffffff");
    }
  },[CurrencyData]);

  
    return(
        <>
        <div className={styles.BidAndOffer}>
            <div className={styles.Bid}>
            Bid:
            <div>
                {CurrencyData.bid}
            </div>
            {t("Opening")}:
            <div>
                {CurrencyData.mid}
            </div>
            </div>

            <div className={styles.profitColor}>
            {t("Expected-Profit")}:
            <div style={{color:TradeColor}}>
               {ExpectedProfit}
            </div>
            </div>

            <div className={styles.Offer}>
            Offer:
            <div>
                {CurrencyData.ask}
            </div>
            {t("Last-Trade-Closure")}:
            <div >
                {TradeInfo.NextOpening}
            </div>
            </div>
        </div>

        <div className={styles.Exchange}>
        <p>{t("Lots")}</p>
          <div className={styles.Buttons}>
              <button disabled={triggerRefresh} onClick={()=>SetLotsInput(HandleBuyOrSell(false,LotsInput,CurrencyData,Id,setTriggerRefresh,triggerRefresh))} data-testid="SellButton" className={styles.SellButton}>{t("SellButton")}</button>
              
              <input disabled={triggerRefresh} className={styles.Lots} value={LotsInput}
                onChange={(e)=>SetLotsInput(e.target.value)}
                type="number" data-testid="lotsInput"/>

              <button disabled={triggerRefresh} onClick={()=>SetLotsInput(HandleBuyOrSell(true,LotsInput,CurrencyData,Id,setTriggerRefresh,triggerRefresh))} data-testid="BuyButton" className={styles.BuyButton}>{t("BuyButton")}</button>
              <div>
                <button disabled={!triggerRefresh} onClick={async()=>await HandleExchange(Id,CurrencyData,setTriggerRefresh,triggerRefresh,setExpectProfit)} className={styles.ExchangeButton}>{t("ExchangeButton")}</button>
              </div>
          </div>
        </div></>
    );
}