import useSWR from "swr";
import type { Stock } from "../types/Stock";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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