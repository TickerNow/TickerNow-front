import React, { useState, useEffect } from "react";
import Button from "../components/button/Button";
import { useLatestNews } from "../utils/useLatestNews";
import NewsList from "../components/News/NewsList";
import TypingHeadline from "../components/News/TypingHeadline";
import { useStockItem } from "../utils/useStockItem";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StockChart from "../components/chart/StockChart";
import { useStockSummary } from "../utils/useStockSummary";
import TypingText from "../components/Text/TypingText";

export default function Home() {
    const { news, isLoading, isError } = useLatestNews();
    
    const [keyword, setKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const { stock, isLoadingStock, isErrorStock } = useStockItem(searchTerm); // 검색 시에만 호출
    const {summaryData, isSummaryLoading, isSummaryError} = useStockSummary(searchTerm); // 검색 시에만 호출
    
    const onSearch = async () => {
        if (!keyword.trim()) return;
        setSearchTerm(keyword); // 애니메이션 트리거
    };

    useEffect(() => {
        if (isErrorStock) {
            toast.error("검색 중 오류가 발생했습니다.");
        }
    }, [isErrorStock]);

    return (
        <div className="w-full min-h-screen bg-[#181A20] flex flex-col items-center px-4 relative">
        
        {/* 👇 문구 추가 */}
        {!searchTerm  && <TypingHeadline />}

        {/* 검색 영역 */}
        <div
            className={`flex w-full max-w-4xl transition-all duration-700 ease-in-out gap-4 ${
            searchTerm  ? "mt-5 max-w-7xl justify-start" : "justify-center"
            }`}
        >
            
            <input
            className="flex-1 px-4 py-2 rounded-sm bg-[#f0f0f0] text-black"
            placeholder="주식종목을 입력하면 시장 흐름을 분석합니다."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
            }}
            />
            <Button onClick={onSearch} disabled={isLoadingStock}>
            {isLoadingStock ? "검색중..." : "검색"}
            </Button>

            {/* 검색 후만 다운로드 버튼 표시 */}
            {stock && stock.length > 0 && (
            <Button className="transition-opacity duration-500">다운로드</Button>
            )}
        </div>

        {!searchTerm && !isLoading && !isError && <NewsList news={news || []} />}

        <ToastContainer position="bottom-center" autoClose={3000} />

        {/* 결과 영역 */}
        <div
            className={`w-full max-w-7xl transition-all duration-700 ease-out transform ${
            stock
                ? "opacity-100 translate-y-0 mt-6 mb-6 flex-1"
                : "opacity-0 translate-y-4 pointer-events-none"
            } bg-[#111111] p-5 text-white rounded-sm relative h-[80vh]`}
        >
            <div className="absolute inset-0 overflow-y-auto p-5">
                {/* 결과 리스트 출력 */}
                {stock && stock.length > 0 && (
                    <div className="w-full max-w-7xl mt-6">
                        <StockChart data={stock} />
                    </div>
                )}

                {summaryData?.summary && (
                    <div className="w-full max-w-7xl mt-10">
                        <TypingText text={summaryData.summary} />
                    </div>
                )}

                {/* 검색했지만 결과가 없을 때 */}
                {searchTerm && !isLoadingStock && stock && stock.length === 0 && (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    </div>
    );
}