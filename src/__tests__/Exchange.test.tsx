import HandleExchange from "../functions/exchangeFunctions/HandleExchange";
import CalculateProfit from "../functions/exchangeFunctions/CalculateProfit";
import SearchforTheLastTrade from "../functions/exchangeFunctions/SearchforTheLastTrade";
import HandleBuyOrSell  from "../functions/exchangeFunctions/HandleBuyOrSell";
import "@testing-library/jest-dom";
import api from "../api/AxiosConnection";

function EmptyTestFunction(data:any){
    return data;
}

describe("Testing Exchange",()=>{
    
    beforeAll((done)=>{
        api.post("/user/new",{
            currentProfit:0,
            currentLots:0,
            userName: "TestUsername2",
	        password: "TestPassword2"
        }).then(function(){
            done();
        });
    });

    afterAll((done)=>{
        api.post("/user/delete",{
            userName: "TestUsername2",
	        password: "TestPassword2"
        }).then(function(){
            done();
        });
    });

    const CurrencyData={
        symbol: "USD/GBP",
        ts:"1644154158",
        bid: 1.36,
        ask:1.34,
        mid:1.35
    };

    it("Handle Buy",async()=>{
        const LoginData:any=await api.post("/user/login",{
            currentProfit:0,
            currentLots:0,
            userName: "TestUsername2",
            password: "TestPassword2"
        });
        const result=HandleBuyOrSell(true,"1",CurrencyData,LoginData.data.id,EmptyTestFunction,EmptyTestFunction);
        expect(result).toBe("0");
    });
    it("Test the Profit",async()=>{
        const LoginData:any=await api.post("/user/login",{
            currentProfit:0,
            currentLots:0,
            userName: "TestUsername2",
            password: "TestPassword2"
        });
            const TradeFinal=await SearchforTheLastTrade(LoginData.data.id);
            const FinalProfit=CalculateProfit(TradeFinal,CurrencyData);
            expect(FinalProfit).toStrictEqual({FinalProfit: 0, PipPrice: 10, PipQtd: 0});
    });
    it("Handle Exchange",async()=>{
        const LoginData:any=await api.post("/user/login",{
            currentProfit:0,
            currentLots:0,
            userName: "TestUsername2",
            password: "TestPassword2"
        });
        const FinalExchange=await HandleExchange(LoginData.data.id,CurrencyData,EmptyTestFunction,EmptyTestFunction,EmptyTestFunction);
        expect(FinalExchange).toStrictEqual({"message": "Trade Sucessfully Finished"});
    });
 
});