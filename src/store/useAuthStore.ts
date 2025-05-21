import {create} from 'zustand';
import axios from 'axios';

interface AuthStore {
    isLoggedIn: boolean;
    loginModalVisible: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    showLoginModal: () => void;
    hideLoginModal: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    loginModalVisible: false,

    login: async (username, password) => {
        try {
            await axios.post("/api/login", { username, password }, { withCredentials: true });
            set({ isLoggedIn: true, loginModalVisible: false });
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
        await axios.post("/api/logout", {}, { withCredentials: true });
        set({ isLoggedIn: false });
    },

    checkAuth: async () => {
        try {
            await axios.get("/api/check-auth", { withCredentials: true });
            set({ isLoggedIn: true });
        } catch {
            set({ isLoggedIn: false });
        }
    },

    showLoginModal: () => set({ loginModalVisible: true }),
    hideLoginModal: () => set({ loginModalVisible: false }),
}))