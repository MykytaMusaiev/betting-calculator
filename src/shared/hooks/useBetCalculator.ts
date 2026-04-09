import { useState, useEffect, useMemo } from "react";
import type { BetFormData, FormErrors, Bet, BetResult } from "../types/bet";
import { GAME_TYPES } from "../constants/gameTypes";

const STORAGE_KEY = "betHistory";
const HISTORY_LIMIT = 5;

const NUMERIC_FIELDS = ["betAmount", "coefficient"] as const;

const NON_NUMERIC_REGEX = /[^\d.,]/g;
const MULTIPLE_DOTS_REGEX = /\.(?=.*\.)/g;
const TWO_DECIMALS_REGEX = /^(\d+)(\.\d{0,2})?.*$/;

const initialFormData: BetFormData = {
    betAmount: "",
    coefficient: "",
    gameType: "",
};

const getInitialHistory = (): Bet[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const normalizeNumberInput = (value: string): string => {
    const v = value
        .replace(NON_NUMERIC_REGEX, "")
        .replace(",", ".")
        .replace(MULTIPLE_DOTS_REGEX, "");

    const match = v.match(TWO_DECIMALS_REGEX);
    return match ? match[1] + (match[2] ?? "") : v;
};

const validators: Record<
    keyof BetFormData,
    (value: string) => string | undefined
> = {
    betAmount: (value) => {
        const amount = parseFloat(value);
        if (!value || isNaN(amount)) return "Введіть суму ставки";
        if (amount <= 0) return "Сума повинна бути більше 0";
        if (amount > 100000) return "Максимум 100 000";
    },

    coefficient: (value) => {
        const coeff = parseFloat(value);
        if (!value || isNaN(coeff)) return "Введіть коефіцієнт";
        if (coeff < 1.01) return "Мінімальний коефіцієнт 1.01";
        if (coeff > 1000) return "Максимум 1000";
    },

    gameType: (value) => {
        if (!value) return "Оберіть тип гри";
    },
};

export const useBetCalculator = () => {
    const [formData, setFormData] = useState<BetFormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<
        Partial<Record<keyof BetFormData, boolean>>
    >({});
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

        return {
            win,
            profit: win - amount,
        };
    }, [formData.betAmount, formData.coefficient]);

    const validateField = (name: keyof BetFormData, value: string) =>
        validators[name](value);

    const validateAll = (): boolean => {
        const newErrors = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
                key,
                validators[key as keyof BetFormData](value),
            ]),
        ) as FormErrors;

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        const field = name as keyof BetFormData;

        const cleaned = (NUMERIC_FIELDS as readonly string[]).includes(name)
            ? normalizeNumberInput(value)
            : value;

        setFormData((prev) => ({
            ...prev,
            [field]: cleaned,
        }));

        if (touched[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: validateField(field, cleaned),
            }));
        }
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const field = e.target.name as keyof BetFormData;
        const value = e.target.value;

        setTouched((prev) => ({
            ...prev,
            [field]: true,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: validateField(field, value),
        }));
    };

    const handleSubmit = () => {
        if (!validateAll() || !result) return;

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
        setTouched({});
    };

    const clearHistory = () => setHistory([]);

    return {
        formData,
        errors,
        result,
        history,
        handleChange,
        handleBlur,
        handleSubmit,
        clearHistory,
    };
};
