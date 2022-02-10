import api from "../../api/AxiosConnection";

export default async function Register(UserInput:string,PasswordInput:string,RegisterMessage:string){
    try {
      if(UserInput.length!==0&&PasswordInput.length!==0){
        const query={
          currentProfit:0,
          currentLots:0,
          userName:UserInput,
          password:PasswordInput
        };
        const result=await api.post("/user/new",query);
          if(result.data.message!==undefined){
            return RegisterMessage;
          }
          else{
            return (result.data.error);
          }
      }  
    } catch (err) {
      console.log(err);
    }
  }