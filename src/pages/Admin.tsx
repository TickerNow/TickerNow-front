import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWRMutation from "swr/mutation";

async function stockFetcher(url: string, { arg }: { arg: { search: string } }) {
    const res = await axios.post(url, arg);
    return res.data;
}

async function newsFetcher(url: string, { arg }: { arg: { search: string; page_count: number } }) {
    const res = await axios.post(url, arg);
    return res.data;
}

export default function AdminHome() {
    const [search, setSearch] = useState("");
    const [pageCount, setPageCount] = useState(1);
    const navigate = useNavigate();

    const {
        trigger: triggerStock,
        isMutating: isStockLoading,
    } = useSWRMutation("/stock_load", stockFetcher);

    const {
        trigger: triggerNews,
        isMutating: isNewsLoading,
    } = useSWRMutation("/daum_search", newsFetcher);

    const handleStockCrawl = async () => {
        if (!search.trim()) return alert("검색어를 입력하세요.");
        try {
            const data = await triggerStock({ search });
            alert(data.message || "주식 데이터 크롤링 완료");
        } catch (err: any) {
            alert("주식 데이터 크롤링 실패: " + err?.response?.data?.error || err.message);
        }
    };

    const handleDaumNewsCrawl = async () => {
        if (!search.trim()) return alert("검색어를 입력하세요.");
        try {
            const data = await triggerNews({ search, page_count: pageCount });
            alert(data.message || "뉴스 크롤링 완료");
        } catch (err: any) {
            alert("뉴스 크롤링 실패: " + err?.response?.data?.error || err.message);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#181A20] text-white px-4 py-10 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8 text-center">🛠️ 관리자 페이지</h1>

            <div className="w-full max-w-2xl grid gap-6">
                {/* 공통 설정 */}
                <div className="bg-[#242730] p-6 rounded-2xl shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">📌 공통 설정</h2>
                    <div className="flex flex-col gap-3">
                        <label className="text-sm">검색어 (기업명)</label>
                        <input
                            className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="예: 삼성전자"
                        />
                        <label className="text-sm">뉴스 페이지 수</label>
                        <input
                            className="p-2 rounded bg-gray-700 text-white"
                            type="number"
                            min={1}
                            value={pageCount}
                            onChange={(e) => setPageCount(Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* 주식 크롤링 */}
                <div className="bg-[#242730] p-6 rounded-2xl shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">📈 주식 데이터 크롤링</h2>
                    <button
                        className="w-full p-3 bg-blue-600 rounded hover:bg-blue-700 transition disabled:opacity-50"
                        onClick={handleStockCrawl}
                        disabled={isStockLoading}
                    >
                        {isStockLoading ? "주식 크롤링 중..." : "크롤링 실행"}
                    </button>
                </div>

                {/* 뉴스 크롤링 */}
                <div className="bg-[#242730] p-6 rounded-2xl shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">📰 다음 뉴스 크롤링</h2>
                    <button
                        className="w-full p-3 bg-green-600 rounded hover:bg-green-700 transition disabled:opacity-50"
                        onClick={handleDaumNewsCrawl}
                        disabled={isNewsLoading}
                    >
                        {isNewsLoading ? "뉴스 크롤링 중..." : "뉴스 크롤링 실행"}
                    </button>
                </div>

                {/* 메인으로 */}
                <button
                    className="w-full p-3 bg-gray-600 rounded transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 disabled:hover:bg-gray-600"
                    disabled={isStockLoading || isNewsLoading}
                    onClick={() => navigate("/")}
                >
                    ⬅️ 메인 페이지로 돌아가기
                </button>
            </div>
        </div>
    );
}