import type { Bet } from '../../shared/types/bet';
import BetHistoryItem from '../BetHistoryItem/BetHistoryItem';
import styles from './BetHistory.module.css';

interface Props {
  history: Bet[];
  onClear: () => void;
}

const BetHistory = ({ history, onClear }: Props) => {
  if (history.length === 0) {
    return (
      <div className={styles.empty}>
        Історія порожня
      </div>
    );
  }

  return (
    <div className={styles.history}>
      <div className={styles.header}>
        <h3 className={styles.title}>Останні ставки</h3>
        <button className={styles.clearButton} onClick={onClear}>
          Очистити
        </button>
      </div>
      <div className={styles.list}>
        {history.map(bet => (
          <BetHistoryItem key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  );
};

export default BetHistory;