import React, { useState } from "react";
import "./css/LoginPage.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        // TODO login logic here
    };

    return (
        <div className="login-container">
            <div className="login-box" role="main" aria-labelledby="login-title">
                <h2 className="login-title" id="login-title">Login</h2>
                <form onSubmit={handleSubmit} aria-describedby={error ? "login-error" : undefined} noValidate>
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
                            aria-required="true"
                        />
                    </div>
                    {error && (
                        <div id="login-error" className="form-error" role="alert" aria-live="assertive">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="login-button"
                        aria-label="Login"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
