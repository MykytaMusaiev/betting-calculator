import type { Bet } from '../../shared/types/bet';
import { CURRENCY } from '../../shared/constants/currency';
import styles from './BetHistoryItem.module.css';

interface Props {
  bet: Bet;
}

const BetHistoryItem = ({ bet }: Props) => {
  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <span className={styles.gameType}>{bet.gameType}</span>
        <span className={styles.date}>{bet.date}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Ставка</span>
        <span className={styles.rowValue}>{bet.amount.toFixed(2)} {CURRENCY}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Коефіцієнт</span>
        <span className={styles.rowValue}>×{bet.coefficient}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Виграш</span>
        <span className={styles.rowValue}>{bet.potentialWin.toFixed(2)} {CURRENCY}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Прибуток</span>
        <span className={`${styles.rowValue} ${styles.profit}`}>
          {bet.profit.toFixed(2)} {CURRENCY}
        </span>
      </div>
    </div>
  );
};

export default BetHistoryItem;