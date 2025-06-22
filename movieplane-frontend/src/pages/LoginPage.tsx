import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { IUser } from "../types";
import "./css/LoginPage.css";
import Loading from "../components/Loading";
import GoogleSignInButton from "../components/GoogleSignInButton";


// login logic
const loginUser = async (email: string, password: string, login: (token: string, user: IUser) => void) => {
    try {
        const response = await axiosClient.post<{ token: string; user: IUser; }>("/auth/login", { email, password });
        const { token: token_1, user: user_1 } = response.data;
        login(token_1, user_1);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed. Please try again.");
    }
}

// validate email and password
const validateData = (email: string, password: string) => {
    const errors: { email?: string; password?: string } = {};

    // Email validation (basic format check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
        errors.email = 'Invalid email format';
    }

    // Password validation
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, logout, toast } = useAuth();
    const navigate = useNavigate();

    // Redirect to home if user is already logged in    
    useEffect(() => {
        logout();
    }, []);

    useEffect(() => {
        // Clear error when email or password changes
        setError("");
    }, [email, password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        setError("");

        if (!email || !password) {
            toast("Please fill in all fields", "error");
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        const { isValid, errors } = validateData(email, password);
        if (!isValid) {
            setError(Object.values(errors).join(", "));
            setLoading(false);
            return;
        }

        try {
            await loginUser(email, password, login);
            setLoading(false);
            toast("Login was successful", "success");
            // Redirect to home page after successful login
            navigate("/");
        } catch (err: any) {
            setError(err.message);
            toast(err.message, 'error');
            console.error("Login error:", err);
            setLoading(false);
        }
    };

    // handle error from google sign in
    const handleGoogleSignInError = (message: string) => {
        setError(message);
    };

    // if loading, show a loading spinner or message
    if (loading) {
        return <Loading title="Please wait while we get your data" />;
    }


    return (
        <div className="login-container">
            <div className="login-box" role="main" aria-labelledby="login-title">
                <h2 className="login-title" id="login-title">Login</h2>
                <form aria-describedby={error ? "login-error" : undefined} noValidate>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="johndoe@example.com"
                            aria-required="true"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                            aria-required="true"
                        />
                    </div>
                    {error && (
                        <div id="login-error" className="form-error" role="alert" aria-live="assertive">
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="login-button"
                        aria-label="Login"
                        disabled={loading}
                        aria-busy={loading}
                    >
                        Login
                    </button>
                    <div className="login-footer">
                        Don't have an account? <a href="/register">Register here</a>
                    </div>
                </form>
            </div>
            <div className="footer-container">
                <GoogleSignInButton onError={handleGoogleSignInError} />
            </div>
        </div>
    );
};

export default LoginPage;
