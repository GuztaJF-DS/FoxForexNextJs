import api from "../../api/AxiosConnection";

export default async function SearchforTheLastTrade(id:string){
    let TableData:any=await api.post("/trade/getall",{userId:id});
    if(TableData.data.length!==0){
      TableData=TableData.data;
      if(TableData[TableData.length-1].Finished===false){
        return TableData[TableData.length-1];
      }
      else{
        return{
          ExchangeType: false,
          Finished: false,
          Lots: 0,
          NextOpening: 0,
          StartDate: "",
          SwapTax: 0,
          __v: 0,
          _id: ""
       };
      }
    }
      else{
        return{
          ExchangeType: false,
          Finished: false,
          Lots: 0,
          NextOpening: 0,
          StartDate: "",
          SwapTax: 0,
          __v: 0,
          _id: ""
       };
      }
  }