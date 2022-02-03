import styles from '../../styles/Main.module.css'

export default function GraphicPart(){
    return(
        <div className={styles.GraphicPart}>
        <div className={styles.CurrencyName}>GBP/USD</div>
          <div className={styles.Graphic}>
          </div>
        </div>
    )
}