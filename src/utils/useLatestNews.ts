import useSWR from "swr";
import type { News } from "../types/News";
import axios from "axios";

const fetcher = (url: string) =>
    axios.get(url, {
        headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
        },
    }).then(res => res.data);

export function useLatestNews() {
    const { data, error, isLoading } = useSWR<News[]>("/api/news", fetcher);

    return {
        news: data,
        isLoading,
        isError: error,
    };
}