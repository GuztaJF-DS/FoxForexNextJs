export default function getHourForward(now:Date){
    const SplitTime=now.toISOString().split("T");
    const Time=SplitTime[1].split(":");
  
    const FullHourEarly = SplitTime[0]+"-"+(now.getHours()+2)+":"+Time[1]+":00";
    return(FullHourEarly);
  }