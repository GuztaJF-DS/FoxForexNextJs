export function getToday(now:Date){
    const SplitTime=now.toISOString().split("T");
    const Time=SplitTime[1].split(".");
  
    const FullToday=SplitTime[0]+"-"+Time[0];
    return FullToday;
  }
  