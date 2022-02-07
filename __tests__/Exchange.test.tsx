import {HandleBuyOrSell,HandleExchange,CalculateProfit,SearchforTheLastTrade} from '../pages/components/Exchange';
import '@testing-library/jest-dom'
import api from '../pages/api/AxiosConnection';


describe("Testing Exchange",()=>{
    
    beforeAll((done)=>{
        api.post("/user/new",{
            currentProfit:0,
            currentLots:0,
            userName: "TestUsername2",
	        password: "TestPassword2"
        }).then(function(){
            done()
        })
    })

    afterAll((done)=>{
        api.post("/user/delete",{
            userName: "TestUsername2",
	        password: "TestPassword2"
        }).then(function(){
            done()
        })
    })

    const CurrencyData={
        symbol: "USD/GBP",
        ts:"1644154158",
        bid: 1.36,
        ask:1.34,
        mid:1.35
    }

    it("Handle Buy",async()=>{
        let LoginData:any=await api.post("/user/login",{
            currentProfit:0,
            currentLots:0,
            userName: "TestUsername2",
            password: "TestPassword2"
        });
        let result=HandleBuyOrSell(true,'1',CurrencyData,LoginData.data.id,'Test','Test');
        expect(result).toBe("0");
    })
    it("Test the Profit",async()=>{
        let LoginData:any=await api.post("/user/login",{
            currentProfit:0,
            currentLots:0,
            userName: "TestUsername2",
            password: "TestPassword2"
        });
            let TradeFinal=await SearchforTheLastTrade(LoginData.data.id);
            let FinalProfit=CalculateProfit(TradeFinal,CurrencyData)
            expect(FinalProfit).toStrictEqual({FinalProfit: 0, PipPrice: 10, PipQtd: 0});
    })
    it("Handle Exchange",async()=>{
        let LoginData:any=await api.post("/user/login",{
            currentProfit:0,
            currentLots:0,
            userName: "TestUsername2",
            password: "TestPassword2"
        });
        let FinalExchange=await HandleExchange(LoginData.data.id,CurrencyData,'Test','Test','Test');
        expect(FinalExchange).toStrictEqual({"message": "Trade Sucessfully Finished"})
    })
 
})