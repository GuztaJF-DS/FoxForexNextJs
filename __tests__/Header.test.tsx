import {render,screen,fireEvent} from '@testing-library/react';
import Header from 'components/Header';
import '@testing-library/jest-dom';
import api from 'api/AxiosConnection';
import {Register} from 'functions/HeaderFunction/RegisterAccount'
import {Login} from 'functions/HeaderFunction/LoginAccount'

describe("Testing Exchange",()=>{

    afterAll((done)=>{
        api.post("/user/delete",{
            userName: "TestUsername",
	        password: "TestPassword"
        }).then(function(){
            done()
        })
    })

    it('it renders the Fox Forex Text',()=>{
        render(<Header/>);
        const loadBid=screen.getByText(/Fox Forex/)
        expect(loadBid).not.toBe(null)
    })

    it('Check if the modal is working',()=>{
        render(<Header/>);
        const OpenModal=screen.getByTestId("openModal");

        fireEvent.click(OpenModal);
        const RegisterButton=screen.getByTestId("Register");

        expect(RegisterButton).not.toBe(undefined)
    })

    it('Register a New Account',async()=>{
        let RegisterResult=await Register("TestUsername","TestPassword","Test");
        expect(RegisterResult).toBe("Now you Can Login");
    });
    it('Failed to register the same account',async()=>{
        let RegisterResult=await Register("TestUsername","TestPassword","Test");
        expect(RegisterResult).toBe("UserName already Exists");
    })
    it('Login the Account',async()=>{
        let LoginResult=await Login("TestUsername","TestPassword","Test");
        expect(LoginResult).toBe("Login Successfully");
    });
    it('Failed to Find any user that corresponds to the given data',async()=>{
        let LoginResult=await Login("Wrong","TestPassword","Test");
        expect(LoginResult).toBe("User Not Found");
    });
    it('Failed to login to the Account with the wrong password',async()=>{
        let LoginResult=await Login("TestUsername","WrongPassword","Test");
        expect(LoginResult).toBe("Wrong Password");
    });
})