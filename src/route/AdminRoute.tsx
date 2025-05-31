import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface AdminRouteProps {
    children: JSX.Element;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    const { isLoggedIn, user, loading } = useAuthStore();

    if (loading) {
        return null;
    }

    if (!isLoggedIn) {
        // 로그인 안 된 상태면 홈으로
        return <Navigate to="/" replace />;
    }

    if (!user?.is_admin) {
        // 로그인은 했지만 관리자가 아니면 홈으로
        return <Navigate to="/" replace />;
    }

    // 관리자 권한 있으면 자식 컴포넌트 렌더링
    return children;
}