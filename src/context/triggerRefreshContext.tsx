/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext,useContext } from "react";

export type TriggerRefreshContent={
    triggerRefresh:boolean,
    setTriggerRefresh:(c:boolean)=>void
}
export const TriggerRefreshContext=createContext<TriggerRefreshContent>({
    triggerRefresh:false,
    setTriggerRefresh:()=>{}
});
export const useTriggerRefreshContext =()=>useContext(TriggerRefreshContext);