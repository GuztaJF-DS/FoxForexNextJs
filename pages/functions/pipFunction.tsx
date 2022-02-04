function PipFunction(Opening:number,Closure:number,IsABuy:Boolean,Lots:number){

    let PipQtd=0

    if(IsABuy===true){//this mean the user is Buying
        PipQtd=(Opening-Closure)*10000;
    }
    else{//and this mean the user is selling
        PipQtd=(Closure-Opening)*10000;
    }

    let PipPrice=0.0001*(100000*Lots);
    let Profit=PipPrice*PipQtd;

    return {"PipQtd":PipQtd,"PipPrice":PipPrice,"Profit":Profit}
}

export default PipFunction