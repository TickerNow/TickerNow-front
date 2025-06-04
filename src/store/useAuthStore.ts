import {create} from 'zustand';
import axios from 'axios';
import type { SignUpFormData } from './../types/SignUp';
import type { UserInfo } from '../types/User';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface AuthStore {
    isLoggedIn: boolean;
    loginModalVisible: boolean;

    user: UserInfo | null;
    loading: boolean;

    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    showLoginModal: () => void;
    hideLoginModal: () => void;

    signUpModalVisible: boolean;
    showSignUpModal: () => void;
    hideSignUpModal: () => void;
    signUp: (userData: SignUpFormData) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    loginModalVisible: false,
    signUpModalVisible: false,

    user: null,
    loading: true,

    login: async (username, password) => {
        try {
            await axios.post(`${apiUrl}/api/login`, { username, password }, {
                    headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420',
                    },
                });
            set({ isLoggedIn: true, loginModalVisible: false });
            window.location.href = "/"; 
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
            const status = err.response.status;
            if (status === 401) {
                alert("아이디 또는 비밀번호를 다시 확인하세요.");
            } else if (status === 500) {
                alert("일시적인 오류가 발생했습니다.\n잠시 후 다시 시도하세요.");
            } else {
                alert(`알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도하세요.`);
            }
            } else {
                alert("네트워크 오류가 발생했습니다.\n잠시 후 다시 시도하세요.");
            }
        }
    },

    logout: async () => {
        // 쿠키 삭제 (httpOnly가 아니어야 가능)
        document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        });

        // localStorage 비우기
        localStorage.clear();

        // sessionStorage 비우기
        sessionStorage.clear();
        },

    checkAuth: async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/check-auth`, { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420',
                }
             });
            const user = response.data.user as UserInfo | undefined;
            
            set({
                isLoggedIn: true,
                user: {
                    id: user?.id ?? "",
                    nickname: user?.nickname ?? "",
                    is_admin: user?.is_admin ?? false,
                },
                loading: false
            });
        } catch {
            set({ isLoggedIn: false, user: null, loading: false});
        }
    },

    showLoginModal: () => set({ loginModalVisible: true }),
    hideLoginModal: () => set({ loginModalVisible: false }),

    showSignUpModal: () => set({ signUpModalVisible: true }),
    hideSignUpModal: () => set({ signUpModalVisible: false }),

    signUp: async (userData) => {
        try {

        const {confirm, ...rest} = userData;
        const payload = {
            ...rest,
            joined_at: new Date().toISOString().slice(0, 10),
        };
        await axios.post(`${apiUrl}/sign_up`, payload, {
                    headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420',
                    },
                });
        alert("회원가입이 완료되었습니다.");
        set({ signUpModalVisible: false });
        } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
            const status = err.response.status;
            if (status === 400) {
                const errorMsg = err.response.data.error;
                alert(errorMsg);
            } else if (status === 500) {
            alert("서버 오류가 발생했습니다.\n잠시 후 다시 시도하세요.");
            } else {
            alert("알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도하세요.");
            }
        } else {
            alert("네트워크 오류가 발생했습니다.\n잠시 후 다시 시도하세요.");
        }
        }
    },
}))