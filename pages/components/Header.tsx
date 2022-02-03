import styles from '../../styles/Main.module.css'

export default function Header(){
    return(
        <div className={styles.header}>
        <div className={styles.foxforextext}>
          Fox Forex
        </div>
          <div className={styles.CurrentUserData}>
            <div>
              Current Profit:0$
            </div>
            <div>
              Current lots: 0
            </div>
          </div>
      </div>
    )
}