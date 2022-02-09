import React,{useState,useEffect} from 'react';
import styles from '../../styles/Main.module.css'
import api from '../api/AxiosConnection';
import { useTriggerRefreshContext } from '../context/triggerRefreshContext'
import { useTranslation } from 'next-i18next';

export default function PastTrades(){
  const [tradeData,setTradeData]=useState([])
  const {triggerRefresh,setTriggerRefresh}=useTriggerRefreshContext()
  
  const { t } = useTranslation('pastTrades');

  useEffect(()=>{
    if (typeof window !== "undefined") {
      let id=(localStorage.getItem("UserId")!);
      api.post("/trade/getall",{userId:id})
      .then(function(data:any){
        data=data.data
        setTradeData(data)
        if(data[data.length-1]!==undefined){
          if(data[data.length-1].Finished===false && triggerRefresh==false){
            setTriggerRefresh(true)
          }
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[triggerRefresh]);

    return(
    <div className={styles.PastTrades}>
        <p>{t("Past-Trades")}</p>
        <div className={styles.Table}>
        <div className={styles.TableHeadMask}>.</div>
          <div className={styles.TableHead}>
            <div className={styles.Titles}>
              <div>{t("Lots")}</div>
              <div className={styles.ExchangeTitle}>{t("Exchange-Type-Title")}</div>
              <div>{t("Date")}</div>
              <div>{t("Profit")}</div>
            </div>
          <div className={styles.line}></div>
          </div>
          {tradeData.map((data:any,index:number)=>{
            let DateDay=(data.FinalDate!==null)?data.FinalDate.split("T"):data.StartDate.split("T")
            let DateHour=DateDay[1].split(".");
            let Exchange=(data.ExchangeType==true)?t("Exchange-Type-Buy"):t("Exchange-Type-Sell")
            let Profit=(data.Profit!==undefined)?data.Profit:0

            return(
              <div className={styles.Content} key={index}>
                <div className={styles.Lots}>{data.Lots}</div>
                <div className={styles.ExchangeType}>{Exchange}</div>
                <div className={styles.Date}>{DateDay[0]+" - "+DateHour[0]}</div>
                <div className={styles.Profit}>{Profit}$</div>
              </div>
            )
          })}
          
        </div>
      </div>
    )
}