import React, { useState, useEffect } from "react";
import "./css/RegisterPage.css";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!form.username || !form.email || !form.password) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosClient.post("/auth/register", form);
            if (response.status !== 201) {
                throw new Error("Registration failed");
            }
            alert("Registration successful! You can now log in.");
            navigate("/login");
        } catch (error: any) {
            console.error("Registration failed:", error.response);
            const fallback = "Registration failed. Please try again.";
            const messages = error.response?.data?.errors;

            if (Array.isArray(messages)) {
                setError(messages.map((err: { message: string }) => err.message).join("\n"));
            } else {
                setError(error.response?.data?.message || fallback);
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        console.log(loading);
    }, [loading]);

    return (
        <div className="register-page">
            <h1>Register</h1>
            <form className="register-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="johndoe"
                        autoComplete="username"
                        aria-label="Username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="johndoe@example.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />
                </div>
                {error && (
                    <div className="form-error" role="alert" aria-live="assertive">
                        {error}
                    </div>
                )}
                <button type="submit" className="register-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;