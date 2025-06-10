import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import type { IUser } from "../types";
import "./css/LoginPage.css";


// login logic
const loginUser = (email: string, password: string, login: (token: string, user: IUser) => void) => {
    return axiosClient.post<{ token: string; user: IUser }>("/auth/login", { email, password })
        .then((response) => {
            const { token, user } = response.data;
            login(token, user)
        })
        .catch(error => {
            throw new Error(error.response?.data?.message || "Login failed. Please try again.");
        });
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

    const { login } = useAuth();
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
            setError("Email and password are required");
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
        } catch (err: any) {
            setError(err.message);
            console.error("Login error:", err);
            setLoading(false);
        }
    };


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
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
