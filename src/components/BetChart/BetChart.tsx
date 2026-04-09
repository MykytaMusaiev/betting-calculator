import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart, Bar,
  AreaChart, Area,
  ComposedChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';
import type { Bet } from '../../shared/types/bet';
import styles from './BetChart.module.css';
import { CURRENCY } from '../../shared/constants/currency';

interface Props {
  history: Bet[];
}

type ChartMode = 'bar' | 'area' | 'combo';

const MODES: { key: ChartMode; label: string }[] = [
  { key: 'bar', label: 'Стовпчики' },
  { key: 'area', label: 'Область' },
  { key: 'combo', label: 'Комбо' },
];

interface ChartEntry {
  date: string;
  profit: number;
  win: number;
  amount: number;
  coefficient: number;
  gameType: string;
  cumulative: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: { payload: ChartEntry }[];
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  if (!d.amount) return null;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{d.gameType} {d.date}</p>
      <div className={styles.tooltipRow}>
        <span>Ставка</span>
        <span>{d.amount.toFixed(2)} {CURRENCY}</span>
      </div>
      <div className={styles.tooltipRow}>
        <span>Коефіцієнт</span>
        <span>×{d.coefficient}</span>
      </div>
      <div className={styles.tooltipDivider} />
      <div className={styles.tooltipRow}>
        <span>Виграш</span>
        <span className={styles.tooltipWin}>{d.win.toFixed(2)} {CURRENCY}</span>
      </div>
      <div className={styles.tooltipRow}>
        <span>Прибуток</span>
        <span className={styles.tooltipProfit}>+{d.profit.toFixed(2)} {CURRENCY}</span>
      </div>
    </div>
  );
};

const BetChart = ({ history }: Props) => {
  const [mode, setMode] = useState<ChartMode>('area');

  if (history.length === 0) {
    return (
      <div className={styles.empty}>
        Додайте ставки щоб побачити графік
      </div>
    );
  }

  const entries: ChartEntry[] = [...history].reverse().reduce<ChartEntry[]>((acc, bet, i) => {
    const prev = acc[i - 1]?.cumulative ?? 0;
    acc.push({
      date: `#${i + 1}`,
      profit: bet.profit,
      win: bet.potentialWin,
      amount: bet.amount,
      coefficient: bet.coefficient,
      gameType: bet.gameType,
      cumulative: prev + bet.profit,
    });
    return acc;
  }, []);

  const data: ChartEntry[] = [
    {
      date: '',
      profit: 0,
      win: 0,
      amount: 0,
      coefficient: 0,
      gameType: '',
      cumulative: 0,
    },
    ...entries,
  ];

  const chartProps = {
    data,
    margin: { top: 10, right: 16, left: 0, bottom: 0 },
  };

  const commonChildren = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
      <XAxis
        dataKey="date"
        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
        axisLine={{ stroke: 'var(--border)' }}
        tickLine={false}
      />
      <YAxis
        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
        axisLine={false}
        tickLine={false}
        tickFormatter={(v) => `${v}${CURRENCY}`}
        width={64}
      />
      <Tooltip content={<CustomTooltip />} />
    </>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Кумулятивний прибуток</h3>
        <div className={styles.modes}>
          {MODES.map(m => (
            <button
              key={m.key}
              className={`${styles.modeBtn} ${mode === m.key ? styles.modeBtnActive : ''}`}
              onClick={() => setMode(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        {mode === 'bar' ? (
          <BarChart {...chartProps}>
            {commonChildren}
            <Bar dataKey="cumulative" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : mode === 'area' ? (
          <AreaChart {...chartProps}>
            {commonChildren}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#areaGradient)"
              dot={{ fill: 'var(--primary)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        ) : (
          <ComposedChart {...chartProps}>
            {commonChildren}
            <Bar dataKey="cumulative" fill="var(--primary-bg)" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--primary)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default BetChart;