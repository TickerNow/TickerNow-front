import React, { useState, useEffect, useRef, useMemo } from "react";
import Button from "../components/button/Button";
import { useLatestNews } from "../utils/useLatestNews";
import NewsList from "../components/News/NewsList";
import TypingHeadline from "../components/News/TypingHeadline";
import { useStockItem } from "../utils/useStockItem";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StockChart from "../components/chart/StockChart";
import { useAuthStore } from "../store/useAuthStore";
import LoginModal from "../components/Login/LoginModal";
import SignUpModal from "../components/Join/JoinModal";
import NavBar from "../components/Navbar/Navbar";
import ChatInput from "../components/ChatInput/ChatInput";
import { useAiChat } from "../utils/useAiChat";
import StockTableWithPagination from "../components/Table/StockTableWithPagination";
import StockNewsList from "../components/News/StockNewsList";
import KeywordSuggestions from "../components/Search/KeywordSuggestion";


export default function Home() {
    
    const { isLoggedIn, loginModalVisible, signUpModalVisible, showLoginModal} =useAuthStore();
    const { news, isLoading, isError } = useLatestNews();
    
    const [keyword, setKeyword] = useState<string>("");
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const { stock, stockNews, isLoadingStock, isErrorStock } = useStockItem(searchTerm); // 검색 시에만 호출
    
    const [chatVisible, setChatVisible] = useState<boolean>(false);
    const [chatInput, setChatInput] = useState<string>("");

    const [aiResponses, setAiResponses] = useState<string[]>([]);
    const [userQuestions, setUserQuestions] = useState<string[]>([]);

    const { user } = useAuthStore();
    const userId = user?.user_id;

    const { trigger, isMutating } = useAiChat();

    const [selectedTab, setSelectedTab] = useState<'price' | 'news'>('price');

    const memoizedStockChart = useMemo(() => {
        return <StockChart data={stock} />;
    }, [stock]);
    
    const onSearch = async () => {
        if (!keyword.trim()) return;

        if(!isLoggedIn){
            showLoginModal();
            return;
        }

        setSearchTerm(keyword); // 애니메이션 트리거
        setChatVisible(false);
        setChatInput("");
        setUserQuestions([]);
        setAiResponses([]);
    };

    const handleSendChat = async () => {
        const trimmed = chatInput.trim();
        if (!trimmed || !userId) return;
        
        setUserQuestions((prev) => [...prev, chatInput]);
        setChatInput("");
        setChatVisible(true);
        
        try {
            const reply = await trigger({
            user_id: userId,
            message: trimmed,
            search: searchTerm,   // 현재 검색 중인 주식 종목 코드/이름
            });
            setAiResponses((prev) => [...prev, reply]);
        } catch (err) {
            setAiResponses((prev) => [...prev, "AI 응답 중 오류가 발생했습니다."]);
        }
    };

    useEffect(() => {
        if (isErrorStock) {
            toast.error("검색 중 오류가 발생했습니다.");
        }
    }, [isErrorStock]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsSuggestionsVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputFocus = () => {
        setIsSuggestionsVisible(true);
    };

    // 검색창 입력 변화 감지 시 연관검색어 보이도록
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
        setIsSuggestionsVisible(true);
    };

    return (
        <div className="w-full min-h-screen bg-[#181A20] flex flex-col items-center px-0 relative">
            {/* 네비게이션 바 */}
            <NavBar />

            {/* 로그인 모달 */}
            {loginModalVisible && <LoginModal />}

            {/* 회원가입 모달 */}
            {signUpModalVisible && <SignUpModal />}

            {/* 👇 문구 추가 */}
            {!searchTerm  && <TypingHeadline />}

            {/* 검색 영역 */}
            <div
                ref={wrapperRef}
                className={`flex w-full max-w-4xl transition-all duration-700 ease-in-out gap-4 ${
                searchTerm  ? "mt-5 max-w-7xl justify-start" : "justify-center"
                }`}
            >
                
                <input
                    className="flex-1 px-4 py-2 rounded-sm bg-[#f0f0f0] text-black"
                    placeholder="주식종목을 입력하면 시장 흐름을 분석합니다."
                    value={keyword}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSearch();
                    }}
                />
                <Button onClick={onSearch} disabled={isLoadingStock}>
                    {isLoadingStock ? "검색중..." : "검색"}
                </Button>

                {/* 연관검색어 컴포넌트 추가 */}
                {isSuggestionsVisible && (
                    <KeywordSuggestions
                        keyword={keyword}
                        searchTerm={searchTerm}
                        onSelect={(selected) => {
                            setKeyword(selected);
                            setIsSuggestionsVisible(false);
                            onSearch();
                        }}
                    />
                )}
            </div>

            {!searchTerm && !isLoading && !isError && <NewsList news={news || []} />}

            <ToastContainer position="bottom-center" autoClose={3000} />

            {/* 결과 영역 */}
            {stock && stock.length > 0 && stockNews && stockNews.length > 0 && (
                <div
                    className={`w-full max-w-7xl transition-all duration-700 ease-out transform ${
                    stock
                        ? "opacity-100 translate-y-0 mt-6 mb-6 flex-1"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    } bg-[#111111] p-5 text-white rounded-sm relative h-[80vh]`}
                >
                    <div className="absolute inset-0 overflow-y-auto p-1">
                        {/* 결과 리스트 출력 */}
                        {stock && stock.length > 0 && (
                            <div className={`w-full flex ${chatVisible ? "flex-row gap-6" : "flex-col"}`}>
                                <div className={chatVisible ? "w-2/3" : "w-full"}>
                                    {memoizedStockChart}
                                </div>

                                {chatVisible && (
                                    <div className="w-1/3 border-l border-[#333] pl-4 flex flex-col max-h-[850px]">
                                        <h2 className="text-lg font-bold mb-2">AI 응답</h2>
                                        <div className="text-sm text-gray-300 flex-grow overflow-auto mb-2 space-y-2">
                                            {(userQuestions.length === 0 && aiResponses.length === 0) ? (
                                            <p>입력한 질문에 대한 AI의 응답이 여기에 표시됩니다.</p>
                                            ) : (
                                            userQuestions.map((question, i) => (
                                                <div key={i} className="flex flex-col space-y-1">
                                                <p className="self-end bg-gray-800 text-white p-2 rounded-lg max-w-[70%] whitespace-pre-wrap">
                                                    {question}
                                                </p>
                                                {aiResponses[i] && (
                                                    <p className="bg-gray-700 p-2 rounded-lg max-w-[80%] whitespace-pre-wrap">
                                                    {aiResponses[i]}
                                                    </p>
                                                )}
                                                </div>
                                            ))
                                            )}

                                            {isMutating && (
                                            <p className="text-sm text-gray-400 animate-pulse">AI 응답 생성 중...</p>
                                            )}
                                        </div>

                                        {/* 여기 채팅 입력창을 이동 */}
                                        <ChatInput
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onSubmit={handleSendChat}
                                            wrapperClassName="flex border border-[#FCD535] rounded-sm"
                                            />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 검색했지만 결과가 없을 때 */}
                        {searchTerm && !isLoadingStock && stock && stock.length === 0 && (
                            <p>검색 결과가 없습니다.</p>
                        )}

                        <div className="mt-4">
                            <div className="flex border-b border-gray-500 mb-2">
                                <button
                                    className={`px-4 py-2 text-sm font-semibold ${
                                        selectedTab === 'price' ? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-400'
                                    }`}
                                    onClick={() => setSelectedTab('price')}
                                >
                                    가격
                                </button>
                                <button
                                    className={`px-4 py-2 text-sm font-semibold ${
                                        selectedTab === 'news' ? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-400'
                                    }`}
                                    onClick={() => setSelectedTab('news')}
                                >
                                    뉴스
                                </button>
                            </div>

                            {/* 탭에 따라 다른 내용 렌더링 */}
                            {selectedTab === 'price' && (
                                <div className="mt-4">
                                    {
                                        stock && stock.length > 0 && (
                                            <StockTableWithPagination data = {stock}/>
                                        )
                                    }
                                </div>
                            )}

                            {selectedTab === 'news' && (
                                <div className="mt-4">
                                    {
                                        stockNews && stockNews.length > 0 && (
                                            <StockNewsList news={stockNews} />
                                        )
                                    }
                                </div>
                            )}

                            <div className="h-[100px]"></div>
                        </div>
                    </div>
                </div>
                )}

            {/* ChatBox */}
            {
                !chatVisible && stock && stock.length > 0 && (
                    <ChatInput
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onSubmit={handleSendChat}
                        wrapperClassName="w-full max-w-7xl flex fixed bottom-10 bg-[#111111] 
                        border border-[#FCD535] text-white px-4 py-2 rounded-2xl shadow-lg z-[100]"
                    />
                )
            }
        </div>
    );
}