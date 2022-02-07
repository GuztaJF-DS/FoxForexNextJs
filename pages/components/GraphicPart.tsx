import React,{useState,useEffect} from 'react';
import api from '../api/AxiosConnection'
import { VictoryChart,VictoryLine,VictoryVoronoiContainer,VictoryAxis } from 'victory';
import styles from '../../styles/Main.module.css'

function getHourEarly(now:Date){

  let SplitTime=now.toISOString().split('T');
  let Time=SplitTime[1].split(':');

  let FullHourEarly = SplitTime[0]+"-"+(now.getHours()+2)+":"+Time[1];
  return(FullHourEarly)
}

function getToday(now:Date){
  let SplitTime=now.toISOString().split('T');
  let Time=SplitTime[1].split('.');

  let FullToday=SplitTime[0]+"-"+Time[0]
  return FullToday
}

function GraphicPart(){
  const [graphicInfo,setGraphicInfo]=useState([{x:0,y:0}]);
  const [reload,setReload]=useState<boolean>(false)

  useEffect(()=>{
    let now = new Date();
    let aHourEarly=getHourEarly(now)
    let today=getToday(now)
    
    let query={
      StartDate:aHourEarly,
      EndDate:today
    }

    api.post("/forex/getminutehistory",query)
    .then(function(data:any){
      let FirstData=data.data.quotes[0]
      let FirstSplitedDate=(FirstData.date.split(" "))
      let FirstRealDate= FirstSplitedDate[1].substring(0,5);
      let all=[{x:FirstRealDate,y:FirstData.close}];
      data.data.quotes.map(function(Data:any,index:number){
        if(index!=0){
          let realdate=((Data.date.split(" ")));
          let FirstRealDate= realdate[1].substring(0,5);
          all.push({x:FirstRealDate,y:Data.close})
        }
      })
      setGraphicInfo(all)
    })
  },[reload])

  let a=0
  
  setTimeout(function(){
    setReload(!reload)
  },1000*60)

    return(
        <div className={styles.GraphicPart}>
        <div className={styles.CurrencyName}>GBP/USD</div>
          <div className={styles.Graphic}>
            <VictoryChart
              width={600}
              height={450}
              containerComponent={
                <VictoryVoronoiContainer
                  voronoiDimension="x"
                  labels={({ datum }) => `Mid:${datum.y}\n Hour:${datum.x}`}
                />
              }
              style={{
                background: {
                  fill: "#293947"
                }
              }}
            >
              <VictoryAxis dependentAxis
                style={{
                  axis: {stroke: "white"},
                  tickLabels:{ fill: "white" },
                  ticks:{ fill: "white" }
                }}
              />
              <VictoryLine
               style={{
                  data: { stroke: "#c43a31" },
                }}
                data={graphicInfo}
              />
              <VictoryAxis style={{
                  axis: {stroke: "white"},
                  tickLabels:{ fill: "none" },
                  ticks:{ fill: "black" }
                }}/>
            </VictoryChart>
          </div>
        </div>
    )
}

export default GraphicPart