import styles from '../../styles/Main.module.css';
import ModalStyle from '../../styles/Modal.module.css';
import Modal from 'react-modal';
import {useState,useEffect} from 'react';
import api from '../api/AxiosConnection';
import { useTriggerRefreshContext } from '../context/triggerRefreshContext';

export async function Register(UserInput:string,PasswordInput:string){
  try {
    if(UserInput.length!==0&&PasswordInput.length!==0){
      const query={
        currentProfit:0,
        currentLots:0,
        userName:UserInput,
        password:PasswordInput
      }
      let result=await api.post("/user/new",query);
        if(result.data.message!==undefined){
          return "Now you Can Login";
        }
        else{
          return (result.data.error);
        }
    }  
  } catch (err) {
    console.log(err);
  }
}

export async function Login(UserInput:string,PasswordInput:string){
  try {
    if(UserInput.length!==0&&PasswordInput.length!==0){
      const query={
        userName:UserInput,
        password:PasswordInput
      }
      let result=await api.post("/user/login",query);
        if(result.data.message!==undefined){
          if (typeof window !== "undefined") {
          localStorage.setItem("UserId",result.data.id);
          return "Login Successfully"
        }
        }
        else{
          return(result.data.error)
        }
    }  
  } catch (err) {
    console.log(err)
  }
}

export default function Header(){
  const [modalIsOpen, setIsOpen] = useState(false);
  const [UserInput,setUserInput]=useState("");
  const [PasswordInput,setPasswordInput]=useState("");
  const [Message,setMessage]=useState("");
  const [id,setId]=useState("0")
  const {triggerRefresh,setTriggerRefresh}=useTriggerRefreshContext()
  const [CurrentsData,setCurrentsData]=useState({lots:0,profit:0})

  useEffect(()=>{
    if (typeof window !== "undefined") {
      if(localStorage.getItem("UserId")!==null){
        setId(localStorage.getItem("UserId")!)
      }
    }
  },[Message])

  useEffect(()=>{
    async function fetchData(){
      let TableData:any=await api.post("/trade/getall",{userId:id});
      let sum=0;
      let lots=0;
      for(var x=0;x<TableData.data.length;x++){
        sum+=TableData.data[x].Profit;
        if(x==TableData.data.length-1){
          if(TableData.data[x].Finished===false){
            lots=TableData.data[x].Lots
          }
        }
      }
      let ProfitCutted=(String(sum).split('.'))
      if(ProfitCutted[1]!==undefined){
          let profitResumed=(ProfitCutted[0]+"."+ProfitCutted[1].substring(0,ProfitCutted[1].length-10))
          sum=parseFloat(profitResumed)
      }
      setCurrentsData({lots:lots,profit:sum})
    }
    fetchData()
  },[triggerRefresh,id])

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setMessage("")
    setPasswordInput("")
    setUserInput("")
    setIsOpen(false);
  }

  const customStyles = {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      color:'black',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#E1E1E1',
  };

    return(
        <div className={styles.header}>
        <div className={styles.foxforextext}>
          Fox Forex
        </div>
          <div id='BottomHeader' className={styles.CurrentUserData}>
            <div>
              Current Profit:{CurrentsData.profit}$
            </div>
            <div>
            {(id==="0")?null:"Logged in"}
            </div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Example Modal"
              ariaHideApp={false}
              style={{content:customStyles}}
            >
              <h2>Login/Register</h2>
              <div
                className={ModalStyle.modalBackground}
              >
              <input className={ModalStyle.UserInput} value={UserInput}
                onChange={(e)=>setUserInput(e.target.value)}
                type="text" placeholder="Username" data-testid="Username"/>
              
              <input className={ModalStyle.UserInput} value={PasswordInput}
                onChange={(e)=>setPasswordInput(e.target.value)}
                type="password" placeholder="Password" data-testid="Password"/>
              </div>
              {Message}
              <div className={ModalStyle.Buttons}>
              <button onClick={async()=>setMessage(await Login(UserInput,PasswordInput))} data-testid="Login" className={ModalStyle.SignButton}>Login</button>
              <button onClick={async()=>setMessage(await Register(UserInput,PasswordInput))} data-testid="Register" className={ModalStyle.SignButton}>Register</button>
              </div>

            </Modal>
            <div>
              Current lots: {CurrentsData.lots}
            </div>
          </div>
           <button onClick={openModal} className={ModalStyle.UserAccount} data-testid="openModal">User Account</button>
      </div>
    )
}