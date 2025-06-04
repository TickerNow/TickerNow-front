import useSWR from "swr";
import type { StockSummary } from "../types/Stock";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const fetcher = (url: string) =>
    axios.get(url, {
        headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
        },
    }).then(res => res.data);

export function useStockSummary(keyword : string) {
    const { data, error, isLoading } = useSWR<StockSummary>(
            keyword ? `${apiUrl}/stock-summary-ai?keyword=${encodeURIComponent(keyword)}` : null,
            fetcher);

        return {
        summaryData: data,
        isSummaryLoading : isLoading,
        isSummaryError: error,
    };
}