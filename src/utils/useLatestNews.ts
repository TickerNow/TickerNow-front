import useSWR from "swr";
import type { News } from "../types/News";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const fetcher = (url: string) =>
    axios.get(url, {
        headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
        },
    }).then(res => res.data);

export function useLatestNews() {
    const { data, error, isLoading } = useSWR<News[]>(`${apiUrl}/stock_news`, fetcher);

    return {
        news: data,
        isLoading,
        isError: error,
    };
}