import api from "api/AxiosConnection";

export async function Login(UserInput:string,PasswordInput:string,LoginMessage:string){
    try {
      if(UserInput.length!==0&&PasswordInput.length!==0){
        const query={
          userName:UserInput,
          password:PasswordInput
        };
        const result=await api.post("/user/login",query);
          if(result.data.message!==undefined){
            if (typeof window !== undefined) {
            localStorage.setItem("UserId",result.data.id);
            return LoginMessage;
          }
          }
          else{
            return(result.data.error);
          }
      }  
    } catch (err) {
      console.log(err);
    }
  }