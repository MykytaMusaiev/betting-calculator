import { useBetCalculator } from './shared/hooks/useBetCalculator';
import BetForm from './components/BetForm/BetForm';
import BetResult from './components/BetResult/BetResult';
import BetHistory from './components/BetHistory/BetHistory';
import BetChart from './components/BetChart/BetChart';
import styles from './App.module.css';
import { useTheme } from './shared/hooks/useTheme';

const App = () => {
  const {
    formData,
    errors,
    result,
    history,
    handleChange,
    handleBlur,
    handleSubmit,
    clearHistory,
  } = useBetCalculator();

  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.heading}>🎰 Betting Calculator</h1>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>
      <main className={styles.main}>
        <div style={{ gridArea: 'form' }}>
          <BetForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
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
        <div style={{ gridArea: 'chart' }}>
          <BetChart history={history} />
        </div>
      </main>
    </div>
  );
};

export default App;