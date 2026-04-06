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
      <header className={styles.header}>
        <h1 className={styles.heading}>🎰 Betting Calculator</h1>
      </header>
      <main className={styles.main}>
        <div style={{ gridArea: 'form' }}>
          <BetForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
        <div style={{ gridArea: 'result' }}>
          <BetResult
            result={result}
            gameType={formData.gameType}
          />
        </div>
        <div style={{ gridArea: 'history' }}>
          <BetHistory
            history={history}
            onClear={clearHistory}
          />
        </div>
      </main>
    </div>
  );
};

export default App;