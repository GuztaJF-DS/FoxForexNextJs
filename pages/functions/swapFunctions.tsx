function SwapFunction(PipPrice:number,IsABuy:boolean,Lots:number,SwapTax:number,TotalDaysPassed:number){
    if(IsABuy===true){
        return (PipPrice*(SwapTax*TotalDaysPassed))/10
    }
    else{
        return Lots*(SwapTax*TotalDaysPassed)
    }
}

export default SwapFunction;