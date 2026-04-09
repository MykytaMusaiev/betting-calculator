import type { BetResult as BetResultType } from '../../shared/types/bet';
import { GAME_TYPES } from '../../shared/constants/gameTypes';
import styles from './BetResult.module.css';
import { CURRENCY } from '../../shared/constants/currency';

interface Props {
  result: BetResultType | null;
  gameType: string;
}

const BetResult = ({ result, gameType }: Props) => {
  const gameLabel = GAME_TYPES.find(g => g.value === gameType)?.label;

  if (!result) {
    return (
      <div className={styles.placeholder}>
        Введіть дані для розрахунку
      </div>
    );
  }

  return (
    <div className={styles.result}>
      {gameLabel && (
        <span className={styles.gameType}>{gameLabel}</span>
      )}
      <div className={styles.row}>
        <span className={styles.rowLabel}>Потенційний виграш</span>
        <span className={styles.rowValue}>
          {result.win.toFixed(2)} {CURRENCY}
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Чистий прибуток</span>
        <span className={`${styles.rowValue} ${styles.profit}`}>
          {result.profit.toFixed(2)} {CURRENCY}
        </span>
      </div>
    </div>
  );
};

export default BetResult;