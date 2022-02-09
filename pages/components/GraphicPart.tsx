import React,{useState,useEffect} from "react";
import api from "api/AxiosConnection";
import { VictoryChart,VictoryLine,VictoryVoronoiContainer,VictoryAxis } from "victory";
import styles from "../../styles/Main.module.css";
import { getHourEarly } from "functions/graphicFunctions/getHourEarly";
import { getToday } from "functions/graphicFunctions/getToday";

export function GraphicPart(){
  const [graphicInfo,setGraphicInfo]=useState([{x:0,y:0}]);
  const [reload,setReload]=useState<boolean>(false);

  useEffect(()=>{
    const now = new Date();
    const aHourEarly=getHourEarly(now);
    const today=getToday(now);
    
    const query={
      StartDate:aHourEarly,
      EndDate:today
    };

    api.post("/forex/getminutehistory",query)
    .then(function(data:any){
      const FirstData=data.data.quotes[0];
      const FirstSplitedDate=(FirstData.date.split(" "));
      const FirstRealDate= FirstSplitedDate[1].substring(0,5);
      const all=[{x:FirstRealDate,y:FirstData.close}];
      data.data.quotes.map(function(Data:any,index:number){
        if(index!=0){
          const realdate=((Data.date.split(" ")));
          const FirstRealDate= realdate[1].substring(0,5);
          all.push({x:FirstRealDate,y:Data.close});
        }
      });
      setGraphicInfo(all);
    });
  },[reload]);

  setTimeout(function(){
    setReload(!reload);
  },1000*60);

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
    );
}

export default GraphicPart;