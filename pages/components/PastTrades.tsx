import styles from '../../styles/Main.module.css'

export default function PastTrades(){
    return(
    <div className={styles.PastTrades}>
        <p>Past Trades</p>
        <div className={styles.Table}>
        <div className={styles.TableHeadMask}>.</div>
          <div className={styles.TableHead}>
            <div className={styles.Titles}>
              <div>Lots</div>
              <div className={styles.ExchangeTitle}>Exchange Type</div>
              <div>Date</div>
              <div>Profit</div>
            </div>
          <div className={styles.line}></div>
          </div>
              <div className={styles.Content}>
                <div className={styles.Lots}>3</div>
                <div className={styles.ExchangeType}>2</div>
                <div className={styles.Date}>10/05/2022</div>
                <div className={styles.Profit}>0$</div>
              </div>
          
        </div>
      </div>
    )
}