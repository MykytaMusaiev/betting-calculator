import { useBetCalculator } from './shared/hooks/useBetCalculator';
import BetForm from './components/BetForm/BetForm';
import BetResult from './components/BetResult/BetResult';
import BetHistory from './components/BetHistory/BetHistory';
import styles from './App.module.css';

const App = () => {
  const {
    formData,
    errors,
    result,
    history,
    handleChange,
    handleSubmit,
    clearHistory,
  } = useBetCalculator();

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <BetForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
        <BetResult
          result={result}
          gameType={formData.gameType}
        />
        <BetHistory
          history={history}
          onClear={clearHistory}
        />
      </main>
    </div>
  );
};

export default App;