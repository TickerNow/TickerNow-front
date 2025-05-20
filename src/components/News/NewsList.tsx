import React, { useEffect, useState } from "react";
import type { News } from "../../types/News";

export default function NewsList({ news }: { news: News[] | undefined }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!news || news.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 5000); // 5초마다 다음 뉴스

        return () => clearInterval(interval); // cleanup
    }, [news]);

    if (!news || news.length === 0) return null;

    const currentNews = news[currentIndex];

    return (
        <div className="mt-2 w-full max-w-4xl bg-black rounded-2xl p-6 shadow text-white transition-all duration-500 text-center">
            <div className="text-xs">
                <span className="mr-2 text-gray-400">{currentIndex + 1}.</span>
                <a
                    href={currentNews.newsURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-white"
                >
                    {currentNews.title}
                </a>
            </div>
        </div>
    );
}