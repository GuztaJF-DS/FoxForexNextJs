import Head from 'next/head'
import styles from '../styles/Main.module.css'
import Header from './components/Header'
import GraphicPart from './components/GraphicPart'
import Exchange from './components/Exchange'
import PastTrades from './components/PastTrades'
import WebsocketConnect from './api/WebsocketConnection'

export default function Home() {
  const websocket=WebsocketConnect();
  return (
    <div>
      <Head>
        <title>Fox Forex</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
    </div>
  )
}
