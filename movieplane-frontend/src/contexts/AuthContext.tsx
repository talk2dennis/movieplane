import { useState, useEffect, useContext, createContext } from "react";
import type { ReactNode } from "react";
import axiosClient from "../api/axiosClient";
import type { IUser } from "../types";

interface AuthContextType {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    toast: (message: string, type: "success" | "error") => void;
    toastMsg: {
        message: string;
        type: "success" | "error";
    } | null;
    login: (token: string, user: IUser) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState<boolean>(true);
    const [toastMsg, setToastMsg] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    useEffect(() => {
        // Load user from token when component mounts or token changes
        const loadUser = async () => {
            setLoading(true);
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                const res = await axiosClient.get("/auth/me");
                const data = res.data as { user: IUser };
                setUser(data.user);
                // console.log("User loaded from token:", data.user);
            } catch (error) {
                console.error("Failed to load user from token:", error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const login = (newToken: string, userData: IUser) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const toast = (message: string, type: "success" | "error") => {
        setToastMsg({ message, type });
         // Clear toast after 3 seconds
        setTimeout(() => setToastMsg(null), 10000);
    };

    return (
        <AuthContext.Provider value={{ toast, toastMsg, user, setUser, token, isAuthenticated: !!user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
