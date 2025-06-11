import useSWR from "swr";
import type { Stock } from "../types/Stock";
import type { StockNews } from "../types/StockNews";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface StockApiResponse {
    stock_data: Stock[];
    news_data: StockNews[];
}

const fetcher = (url: string, body: any) =>
    axios.post(url, body, {
        headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        },
    }).then(res => res.data);

export function useStockItem(keyword : string) {
    const shouldFetch = !!keyword;
    // keyword가 없으면 null 넘겨서 fetch 안 함
    const { data, error, isLoading } = useSWR<StockApiResponse>(
    shouldFetch ? [`${apiUrl}/DB_stock_search`, { stock_name: keyword }] : null,
        ([url, body]) => fetcher(url, body)
    );

    return {
        stock: data?.stock_data ?? [],
        stockNews: data?.news_data ?? [],
        isLoadingStock: isLoading,
        isErrorStock: error,
    };
}