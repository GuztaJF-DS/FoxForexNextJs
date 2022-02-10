function FinalProfitFunction(Profit:number,Swap:number){
    const Finalprofit=Profit-Swap;
    const ProfitCutted=(String(Finalprofit).split("."));
    if(ProfitCutted[1]!==undefined){
        const profitResumed=(ProfitCutted[0]+"."+ProfitCutted[1].substring(0,ProfitCutted[1].length-10));
        return parseFloat(profitResumed);
    }
    return Finalprofit;    
}

export default FinalProfitFunction;