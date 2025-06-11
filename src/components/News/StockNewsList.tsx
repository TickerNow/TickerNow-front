import React, { useState } from "react";
import type { StockNews } from "../../types/StockNews";

function StockNewsItem({ newsItem }: { newsItem: StockNews }) {
    return (
        <li className="flex items-start justify-between border-b border-gray-700 pb-4 mb-4">
            {/* 좌측 텍스트 영역 */}
            <div className="flex-1 text-left">
                <div className="text-xs text-gray-400 font-semibold mb-1">{newsItem.search}</div>
                <a
                    href={newsItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-white hover:underline"
                >
                    {newsItem.title}
                </a>
                <div className="text-xs text-gray-300 mt-1 line-clamp-2">{newsItem.content}</div>
                <div className="text-xs text-gray-500 mt-1">{newsItem.date}</div>
            </div>

            {/* 우측 이미지 */}
            {newsItem.img_url && (
                <img
                    src={newsItem.img_url}
                    alt={newsItem.title}
                    className="w-20 h-20 object-cover rounded-md ml-4 flex-shrink-0"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // 무한루프 방지
                        target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                    }}
                />
            )}
        </li>
    );
}

export default function StockNewsList({ news }: { news: StockNews[] | undefined }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    if (!news || news.length === 0) return null;

    const totalPages = Math.ceil(news.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = news.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="mt-2 w-full max-w-7xl bg-black rounded-2xl p-6 shadow text-white transition-all duration-500">
            <ul className="space-y-2">
                {currentItems.map((item, index) => (
                    <StockNewsItem key={index + startIndex} newsItem={item} />
                ))}
            </ul>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-3">
                    <button
                        className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        이전
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600" : "bg-gray-700"}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}