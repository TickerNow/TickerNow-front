import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
    const { isLoggedIn, user, showLoginModal, logout } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    return (
        <nav className="w-full flex justify-between items-center py-1 px-4 bg-[#242730] rounded-b-md mb-6 text-white sticky top-0 z-50">
            <div className="flex items-center">
                <img
                    src="/tickerNowIcon.png" // ← 여기에 이미지 경로 설정
                    alt="Logo"
                    className="cursor-pointer w-[130px] h-[40px]"
                    onClick={() => (window.location.href = "/")}
                />
            </div>
        
        {isLoggedIn && user ? (
            <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="flex items-center gap-1 py-1 text-white hover:opacity-80"
                    >
                        <div className="flex items-end gap-2">
                            <strong className="text-base">{user.nickname}</strong>
                            <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-lg
                                    ${user.is_admin ? "bg-[#FCD535] text-[#111111]" : "bg-gray-600 text-[#f0f0f0]"}`}
                            >
                                {user.is_admin ? "관리자" : "유저"}
                            </span>
                        </div>
                        <span className="ml-1">▼</span>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-36 bg-[#1f1f1f] rounded shadow-lg py-2 text-sm">
                            {user.is_admin && (
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700"
                                    onClick={() => navigate("/admin")}
                                >
                                    관리자 페이지
                                </button>
                            )}
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-700"
                                onClick={handleLogout}
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
        ) : (
            <button
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            onClick={showLoginModal}
            >
            로그인
            </button>
        )}
        </nav>
    );
}