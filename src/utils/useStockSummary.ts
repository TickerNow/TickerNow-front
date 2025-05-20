import useSWR from "swr";
import type { StockSummary } from "../types/Stock";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStockSummary(keyword : string) {
    const { data, error, isLoading } = useSWR<StockSummary>(
            keyword ? `/api/stock-summary-ai?keyword=${encodeURIComponent(keyword)}` : null,
            fetcher);

        return {
        summaryData: data,
        isSummaryLoading : isLoading,
        isSummaryError: error,
    };
}