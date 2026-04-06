export interface GameType {
    value: string;
    label: string;
}

export interface FormData {
    betAmount: string;
    coefficient: string;
    gameType: string;
}

export interface FormErrors {
    betAmount?: string;
    coefficient?: string;
    gameType?: string;
}

export interface BetResult {
    win: number;
    profit: number;
}

export interface Bet {
    id: number;
    date: string;
    amount: number;
    coefficient: number;
    gameType: string;
    potentialWin: number;
    profit: number;
}
