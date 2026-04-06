import { useState, useEffect, useMemo } from "react";
import type { FormData, FormErrors, Bet, BetResult } from "../types/bet";
import { GAME_TYPES } from "../constants/gameTypes";

const STORAGE_KEY = "betHistory";
const HISTORY_LIMIT = 5;

const getInitialHistory = (): Bet[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const initialFormData: FormData = {
    betAmount: "",
    coefficient: "",
    gameType: "",
};

export const useBetCalculator = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [history, setHistory] = useState<Bet[]>(getInitialHistory);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }, [history]);

    const result = useMemo<BetResult | null>(() => {
        const amount = parseFloat(formData.betAmount);
        const coeff = parseFloat(formData.coefficient);
        if (isNaN(amount) || isNaN(coeff) || amount <= 0 || coeff < 1.01)
            return null;
        const win = amount * coeff;
        return { win, profit: win - amount };
    }, [formData.betAmount, formData.coefficient]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        const amount = parseFloat(formData.betAmount);
        const coeff = parseFloat(formData.coefficient);

        if (!formData.betAmount || isNaN(amount))
            newErrors.betAmount = "Введіть суму ставки";
        else if (amount <= 0)
            newErrors.betAmount = "Сума повинна бути більше 0";
        else if (amount > 100000) newErrors.betAmount = "Максимум 100 000";

        if (!formData.coefficient || isNaN(coeff))
            newErrors.coefficient = "Введіть коефіцієнт";
        else if (coeff < 1.01)
            newErrors.coefficient = "Мінімальний коефіцієнт 1.01";
        else if (coeff > 1000) newErrors.coefficient = "Максимум 1000";

        if (!formData.gameType) newErrors.gameType = "Оберіть тип гри";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = () => {
        if (!validate() || !result) return;

        const gameTypeLabel =
            GAME_TYPES.find((g) => g.value === formData.gameType)?.label ??
            formData.gameType;

        const bet: Bet = {
            id: Date.now(),
            date: new Date().toLocaleString("uk-UA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
            amount: parseFloat(formData.betAmount),
            coefficient: parseFloat(formData.coefficient),
            gameType: gameTypeLabel,
            potentialWin: result.win,
            profit: result.profit,
        };

        setHistory((prev) => [bet, ...prev].slice(0, HISTORY_LIMIT));
        setFormData(initialFormData);
        setErrors({});
    };

    const clearHistory = () => setHistory([]);

    return {
        formData,
        errors,
        result,
        history,
        handleChange,
        handleSubmit,
        clearHistory,
    };
};
