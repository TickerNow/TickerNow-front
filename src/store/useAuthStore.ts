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

    checkIdDuplicate: (id: string) => Promise<boolean>;
    checkNicknameDuplicate: (nickname: string) => Promise<boolean>;
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
            const response = await axios.post(`${apiUrl}/login`, { id : username, password }, {
                    headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420',
                    },
                });

            const token = response.headers['authorization']; // "Bearer xxx"
            if (token) {
                const jwt = token.replace('Bearer ', '');
                localStorage.setItem("Authorization", jwt);
            }
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
        localStorage.clear();
        },

    checkAuth: async () => {
        try {
            const response = await axios.get(`${apiUrl}/check-auth`, { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420',
                    'Authorization' : localStorage.getItem("Authorization")
                }
            });
            const user = response.data as UserInfo | undefined;
            
            set({
                isLoggedIn: true,
                user: {
                    user_id: user?.user_id ?? "",
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

    checkIdDuplicate: async (id: string) => {
        if (!id.trim()) {
            return false;
        }

        try {
            await axios.post(`${apiUrl}/sign_id_check`, { id }, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            },
            });

            return true;

        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
            alert("중복된 아이디가 존재합니다.");
            } else {
            alert("아이디 중복 확인 중 오류가 발생했습니다.");
            }
            return false;
        }
    },

    checkNicknameDuplicate: async (nickname: string) => {
        if (!nickname.trim()) {
            return false;
        }

        try {
            await axios.post(`${apiUrl}/sign_nickname_check`, { nickname }, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            },
            });

            return true;

        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
            alert("중복된 닉네임이 존재합니다.");
            } else {
            alert("닉네임 중복 확인 중 오류가 발생했습니다.");
            }
            return false;
        }
    },

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