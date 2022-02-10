/* eslint-disable @typescript-eslint/no-var-requires */
import Header from "../../pages/components/Header";
import "@testing-library/jest-dom";
import api from "../api/AxiosConnection";
import Register from "../../src/functions/HeaderFunction/RegisterAccount";
import Login from "../../src/functions/HeaderFunction/LoginAccount";

describe("Testing Exchange",()=>{

    afterAll((done)=>{
        api.post("/user/delete",{
            userName: "TestUsername",
	        password: "TestPassword"
        }).then(function(){
            done();
        });
    });

    it("Register a New Account",async()=>{
        const RegisterResult=await Register("TestUsername","TestPassword","Success");
        expect(RegisterResult).toBe("Success");
    });
    it("Failed to register the same account",async()=>{
        const RegisterResult=await Register("TestUsername","TestPassword","Success");
        expect(RegisterResult).toBe("UserName already Exists");
    });
    it("Login the Account",async()=>{
        const LoginResult=await Login("TestUsername","TestPassword","Success");
        expect(LoginResult).toBe("Success");
    });
    it("Failed to Find any user that corresponds to the given data",async()=>{
        const LoginResult=await Login("Wrong","TestPassword","Test");
        expect(LoginResult).toBe("User Not Found");
    });
    it("Failed to login to the Account with the wrong password",async()=>{
        const LoginResult=await Login("TestUsername","WrongPassword","Test");
        expect(LoginResult).toBe("Wrong Password");
    });
});