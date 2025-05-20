import useSWR from "swr";
import type { News } from "../types/News";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLatestNews() {
    const { data, error, isLoading } = useSWR<News[]>("/api/news", fetcher);

    return {
        news: data,
        isLoading,
        isError: error,
    };
}