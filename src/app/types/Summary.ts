export interface Summary {
    mode?: "daily" | "weekly" | "monthly" | "yearly";
    month?: number;
    year?: number;
    date_from?: string;
    date_to?: string
}

export interface SummaryResponse {
    total_income: number;
    total_expense: number;
    cash_flow: number;
    expense_count: number;
    income_count: number;
    date_range: {
        from: string;
        to: string
    }
    
}