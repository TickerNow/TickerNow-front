import useSWR from "swr";
import type { Stock } from "../types/Stock";
import axios from "axios";

const fetcher = (url: string) =>
    axios.get(url, {
        headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
        },
    }).then(res => res.data);

export function useStockItem(keyword : string) {
    // keyword가 없으면 null 넘겨서 fetch 안 함
    const { data, error, isLoading } = useSWR<Stock[]>(
        keyword ? `/api/stock?keyword=${encodeURIComponent(keyword)}` : null,
        fetcher
    );

    return {
        stock: data,
        isLoadingStock : isLoading,
        isErrorStock: error,
    };
}