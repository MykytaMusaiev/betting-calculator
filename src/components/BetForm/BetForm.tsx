import type { BetFormData, FormErrors } from '../../shared/types/bet';
import { GAME_TYPES } from '../../shared/constants/gameTypes';
import styles from './BetForm.module.css';

interface Props {
  formData: BetFormData;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
}

const BetForm = ({ formData, errors, onChange, onBlur, onSubmit }: Props) => {
  return (
    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <h2 className={styles.title}>Калькулятор ставок</h2>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="betAmount">
          Сума ставки
        </label>
        <input
          id="betAmount"
          name="betAmount"
          type="text"
          inputMode="decimal"
          value={formData.betAmount}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Наприклад: 500"
          className={`${styles.input} ${errors.betAmount ? styles.inputError : ''}`}
        />
        {errors.betAmount && (
          <span className={styles.errorText}>{errors.betAmount}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="coefficient">
          Коефіцієнт
        </label>
        <input
          id="coefficient"
          name="coefficient"
          type="text"
          inputMode="decimal"
          value={formData.coefficient}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Наприклад: 2.5"
          className={`${styles.input} ${errors.coefficient ? styles.inputError : ''}`}
        />
        {errors.coefficient && (
          <span className={styles.errorText}>{errors.coefficient}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="gameType">
          Тип гри
        </label>
        <select
          id="gameType"
          name="gameType"
          value={formData.gameType}
          onChange={onChange}
          onBlur={onBlur}
          className={`${styles.input} ${errors.gameType ? styles.inputError : ''}`}
        >
          <option value="">Оберіть тип гри</option>
          {GAME_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.gameType && (
          <span className={styles.errorText}>{errors.gameType}</span>
        )}
      </div>

      <button className={styles.button} type="submit">
        Розрахувати
      </button>
    </form>
  );
};

export default BetForm;