import "@testing-library/jest-dom";
import getToday from "../functions/graphicFunctions/getToday";
import getHourForward from "../functions/graphicFunctions/getHourForward";

describe("Graphic Tests",()=>{
    it("Test GetToday",()=>{
        const TestDate=new Date("2004-06-13");
        const Today=getToday(TestDate);
        expect(Today).toBe("2004-06-13-00:00:00");
    });

    it("Test Get Hour Early",()=>{
        const TestDate=new Date("2004-06-13T10:00:00");
        const HourEarly=getHourForward(TestDate);
        expect(HourEarly).toBe("2004-06-13-12:00:00");
    });
});