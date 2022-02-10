import Head from "next/head";
import { useState } from "react";
import styles from "styles/Main.module.css";
import Header from "./components/Header";
import GraphicPart from "./components/GraphicPart";
import Exchange from "./components/Exchange";
import PastTrades from "./components/PastTrades";
import WebsocketConnect from "../src/api/WebsocketConnection";
import { TriggerRefreshContext } from "../src/context/triggerRefreshContext";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Home() {
  const websocket=WebsocketConnect();
  const [triggerRefresh,setTriggerRefresh]=useState<boolean>(false);
  return (
    <div>
      <Head>
        <title>Fox Forex</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TriggerRefreshContext.Provider value={{triggerRefresh,setTriggerRefresh}}>
        <main className={styles.app}>
          <Header/>
            <div className={styles.toDesktop}>
              <div className={styles.desktopLeft}>
                <GraphicPart/>
              </div>
              <div className={styles.desktopRight}>
                <Exchange socket={websocket}/>
                <PastTrades/>
              </div>
            </div>
        </main>
      </TriggerRefreshContext.Provider>
    </div>
  );
}

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ["common","header","exchange","pastTrades"]),
  },
});