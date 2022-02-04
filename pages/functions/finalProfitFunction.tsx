function FinalProfitFunction(Profit:number,Swap:number){
    let Finalprofit=Profit-Swap;
    let ProfitCutted=(String(Finalprofit).split('.'))
    if(ProfitCutted[1]!==undefined){
        let profitResumed=(ProfitCutted[0]+"."+ProfitCutted[1].substring(0,ProfitCutted[1].length-10))
        return parseFloat(profitResumed)
    }
    return Finalprofit;    
}

export default FinalProfitFunction