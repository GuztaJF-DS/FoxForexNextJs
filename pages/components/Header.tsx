/* eslint-disable @next/next/link-passhref */
import styles from "styles/Main.module.css";
import ModalStyle from "styles/Modal.module.css";
import Modal from "react-modal";
import {useState,useEffect} from "react";
import api from "../../src/api/AxiosConnection";
import { useTriggerRefreshContext } from "../../src/context/triggerRefreshContext";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import  Register from "../../src/functions/HeaderFunction/RegisterAccount";
import Login from "../../src/functions/HeaderFunction/LoginAccount";

export default function Header(){
  const [modalIsOpen, setIsOpen] = useState(false);
  const [UserInput,setUserInput]=useState("");
  const [PasswordInput,setPasswordInput]=useState("");
  const [Message,setMessage]=useState("");
  const [id,setId]=useState("0");
  const {triggerRefresh}=useTriggerRefreshContext();
  const [CurrentsData,setCurrentsData]=useState({lots:0,profit:0});

  const { t } = useTranslation("header");
  const router = useRouter();

  useEffect(()=>{
    if (typeof window !== "undefined") {
      if(localStorage.getItem("UserId")!==null){
        setId(localStorage.getItem("UserId")!);
      }
    }
  },[Message]);

  useEffect(()=>{
    async function fetchData(){
      const TableData:any=await api.post("/trade/getall",{userId:id});
      let sum=0;
      let lots=0;
      for(let x=0;x<TableData.data.length;x++){
        sum+=TableData.data[x].Profit;
        if(x==TableData.data.length-1){
          if(TableData.data[x].Finished===false){
            lots=TableData.data[x].Lots;
          }
        }
      }
      const ProfitCutted=(String(sum).split("."));
      if(ProfitCutted[1]!==undefined){
          const profitResumed=(ProfitCutted[0]+"."+ProfitCutted[1].substring(0,ProfitCutted[1].length-10));
          sum=parseFloat(profitResumed);
      }
      setCurrentsData({lots:lots,profit:sum});
    }
    fetchData();
  },[triggerRefresh,id]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setMessage("");
    setPasswordInput("");
    setUserInput("");
    setIsOpen(false);
  }

  const customStyles = {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      color:"black",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#E1E1E1",
  };

    return(
        <div className={styles.header}>
        <div className={styles.foxforextext}>
          Fox Forex
        </div>
          <div id="BottomHeader" className={styles.CurrentUserData}>
            <div>
              {t("Profit")}:{CurrentsData.profit}$
            </div>
            <div>
            {(id==="0")?null:t("Logged-In")}
            </div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Login Modal"
              ariaHideApp={false}
              style={{content:customStyles}}
            >
              <h2>{t("Login-Register")}</h2>
              <div
                className={ModalStyle.modalBackground}
              >
              <input className={ModalStyle.UserInput} value={UserInput}
                onChange={(e)=>setUserInput(e.target.value)}
                type="text" placeholder={t("User-Placeholder")} data-testid="Username"/>
              
              <input className={ModalStyle.UserInput} value={PasswordInput}
                onChange={(e)=>setPasswordInput(e.target.value)}
                type="password" placeholder={t("Password-Placeholder")} data-testid="Password"/>
              </div>
              {Message}
              <div className={ModalStyle.Buttons}>
              <button onClick={async()=>setMessage(await Login(UserInput,PasswordInput,t("Login-Message")))} data-testid="Login" className={ModalStyle.SignButton}>{t("Login-Button")}</button>
              <button onClick={async()=>setMessage(await Register(UserInput,PasswordInput,t("Register-Message")))} data-testid="Register" className={ModalStyle.SignButton}>{t("Register-Button")}</button>
              </div>

            </Modal>
            <div>
              {t("Lots")}: {CurrentsData.lots}
            </div>
          </div>
           <button onClick={openModal} className={ModalStyle.UserAccount} data-testid="openModal">{t("Login-Register")}</button>
           <Link href="/"
            locale={router.locale === "en" ? "pt" : "en"}
          >
            <button
              type="button"
              className={ModalStyle.UserAccount} 
            >
              {t("Language-Change")}
            </button>
          </Link>
      </div>
    );
}