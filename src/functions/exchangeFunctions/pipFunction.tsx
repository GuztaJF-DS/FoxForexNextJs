function PipFunction(Opening:number,Closure:number,IsABuy:boolean,Lots:number){
    let PipQtd=0;

    if(IsABuy===true){
        PipQtd=(Opening-Closure)*10000;
    }
    else{
        PipQtd=(Closure-Opening)*10000;
    }

    const PipPrice=0.0001*(100000*Lots);
    const Profit=PipPrice*PipQtd;

    return {"PipQtd":PipQtd,"PipPrice":PipPrice,"Profit":Profit};
}

export default PipFunction;