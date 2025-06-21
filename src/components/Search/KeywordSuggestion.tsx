import { useEffect, useState } from "react";

type RelatedKeyword = {
    name: string;
};

interface Props {
    keyword: string;
    searchTerm: string;
    onSelect: (selected: string) => void;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function KeywordSuggestions({ keyword, searchTerm, onSelect }: Props) {
    const [suggestions, setSuggestions] = useState<RelatedKeyword[]>([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (keyword.trim().length < 1) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await fetch(`${apiUrl}/realtime_search`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ search: keyword }),
                });

                const data = await res.json();
                setSuggestions(data.slice(0, 10)); 
            } catch (err) {
                console.error("연관검색어 불러오기 실패", err);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300); // debounce 300ms

        return () => clearTimeout(debounce);
    }, [keyword]);

    const ulClassName = searchTerm
    ? "absolute bg-[#f0f0f0] text-black mt-[52px] rounded shadow w-full z-10 max-w-7xl"
    : "absolute bg-[#f0f0f0] text-black mt-[52px] rounded shadow w-full z-10 max-w-4xl";

    if (suggestions.length === 0) return null;

    return (
        <ul className={ulClassName}>
            {suggestions.map((item, index) => (
                <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => onSelect(item.name)}
                >
                    {item.name}
                </li>
            ))}
        </ul>
    );
}