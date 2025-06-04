import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWRMutation from "swr/mutation";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

async function stockFetcher(url: string, { arg }: { arg: { search: string } }) {
    const res = await axios.post(url, arg, {
        headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
        },
    });
    return res.data;
}

async function newsFetcher(url: string, { arg }: { arg: { search: string; page_count: number } }) {
    const res = await axios.post(url, arg, {
        headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
        },
    });
    return res.data;
}

export default function AdminHome() {
    const [selectedTab, setSelectedTab] = useState<"stock" | "news">("stock");
    const [search, setSearch] = useState("");
    const [pageCount, setPageCount] = useState(1);
    const navigate = useNavigate();

    const {
        trigger: triggerStock,
        isMutating: isStockLoading,
    } = useSWRMutation(`${apiUrl}/stock_load`, stockFetcher);

    const {
        trigger: triggerNews,
        isMutating: isNewsLoading,
    } = useSWRMutation(`${apiUrl}/daum_search`, newsFetcher);

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
            <h1 className="text-2xl font-bold mb-6 text-center text-[#FCD535]">관리자 페이지</h1>

            {/* 탭 버튼 */}
            <div className="flex mb-6 gap-4">
                <button
                    className={`px-6 py-2 rounded ${selectedTab === "stock" ? "bg-[#FCD535] text-black" : "bg-[#2C2F38] text-white"}`}
                    onClick={() => setSelectedTab("stock")}
                >
                    주식 크롤링
                </button>
                <button
                    className={`px-6 py-2 rounded ${selectedTab === "news" ? "bg-[#FCD535] text-black" : "bg-[#2C2F38] text-white"}`}
                    onClick={() => setSelectedTab("news")}
                >
                    뉴스 크롤링
                </button>
            </div>

            <div className="w-full max-w-2xl grid gap-8">
                {/* 탭별 설정 */}
                <div className="bg-[#1E2026] p-6 rounded-md border border-gray-500 shadow-xl">
                    <h2 className="text-xl font-semibold mb-4 text-[#FCD535]">
                        {selectedTab === "stock" ? "주식 설정" : "뉴스 설정"}
                    </h2>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-[#E0E0E0]">검색어 (기업명)</label>
                            <input
                                className="p-2 rounded-md bg-[#181A20] text-white focus:outline-none focus:ring-2 focus:ring-[#FCD535]"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="예: 삼성전자"
                            />
                        </div>

                        {selectedTab === "news" && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#E0E0E0]">뉴스 페이지 수</label>
                                <input
                                    className="p-2 rounded-md bg-[#181A20] text-white focus:outline-none focus:ring-2 focus:ring-[#FCD535]"
                                    type="number"
                                    min={1}
                                    value={pageCount}
                                    onChange={(e) => setPageCount(Number(e.target.value))}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 주식 버튼 */}
                {selectedTab === "stock" && (
                    <div className="bg-[#1E2026] p-6 rounded-md border border-gray-500 shadow-xl">
                        <h2 className="text-xl font-semibold mb-4 text-[#FCD535]">주식 데이터 크롤링</h2>
                        <button
                            className="w-full p-3 bg-[#FCD535] text-black font-semibold rounded hover:brightness-90 transition disabled:opacity-50"
                            onClick={handleStockCrawl}
                            disabled={isStockLoading}
                        >
                            {isStockLoading ? "주식 크롤링 중..." : "크롤링 실행"}
                        </button>
                    </div>
                )}

                {/* 뉴스 버튼 */}
                {selectedTab === "news" && (
                    <div className="bg-[#1E2026] p-6 rounded-md border border-gray-500 shadow-xl">
                        <h2 className="text-xl font-semibold mb-4 text-[#FCD535]">다음 뉴스 크롤링</h2>
                        <button
                            className="w-full p-3 bg-[#FCD535] text-black font-semibold rounded hover:brightness-90 transition disabled:opacity-50"
                            onClick={handleDaumNewsCrawl}
                            disabled={isNewsLoading}
                        >
                            {isNewsLoading ? "뉴스 크롤링 중..." : "뉴스 크롤링 실행"}
                        </button>
                    </div>
                )}

                {/* 메인으로 */}
                <button
                    className="w-full p-3 text-[#E0E0E0] border-none rounded transition mt-4 hover:bg-[#2C2F38] disabled:opacity-50 disabled:cursor-not-allowed underline"
                    disabled={isStockLoading || isNewsLoading}
                    onClick={() => navigate("/")}
                >
                    메인 페이지로 돌아가기
                </button>
            </div>
        </div>
    );
}