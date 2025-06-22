import React, { useState } from "react";
import "./css/RegisterPage.css";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../components/Loading";
import {
    faEye,
    faEyeSlash,
    faCheckCircle,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";


const EditPage: React.FC = () => {
    const { setUser, user, loading: autLoading, toast } = useAuth();
    const [form, setForm] = useState({
        username: user?.username || "",
        email: user?.email || "",
        password: "",
        profilePicture: user?.profilePicture || ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    // Redirect if user is not authenticated
    if (autLoading) {
        return <Loading title="Loading user details..." />;
    }
    if (!user) {
        navigate("/login");
    }

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const { name, value } = e.target;
        if (name === "confirm_password") {
            setConfirmPassword(value);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[\W_]/.test(password)) strength++;

        if (strength <= 2) return "weak";
        if (strength === 3 || strength === 4) return "medium";
        return "strong";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { username, password } = form;

        if (!username || !password || !confirmPassword) {
            setError("All fields are required.");
            toast("All fields are required.", "error");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            toast("Passwords do not match.", "error");
            setLoading(false);
            return;
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!passwordRegex.test(password)) {
            setError(
                "Password must contain uppercase, lowercase, number, special character and be 8+ chars."
            );
            toast(
                "Password must contain uppercase, lowercase, number, special character and be 8+ chars.",
                "error"
            );
            setLoading(false);
            return;
        }


        try {
            if (!user) {
                setError("User not authenticated.");
                toast("User not authenticated.", "error");
                setLoading(false);
                return;
            }
            
            const res = await axiosClient.put(`/users/${user._id}`, form);
            if (res.status !== 200) throw new Error("User update failed");
            setUser({
                ...user,
                username: form.username,
                profilePicture: form.profilePicture || user.profilePicture,
            });
            toast("User details updated successfully!", "success");
            navigate("/profile");
        } catch (error: any) {
            const fallback = "User update failed. Please try again.";
            const messages = error.response?.data?.errors;
            toast(messages, "error");
            if (Array.isArray(messages)) {
                setError(messages.map((e: { message: string }) => e.message).join("\n"));
            } else {
                setError(error.response?.data?.message || fallback);
            }
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength(form.password);

    if (loading) {
        return <Loading title="Updating user details... Please wait" />;
    }
    return (
        <div className="register-page">
            <h1>Profile Update</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="johndoe"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profilePicture">Profile Picture:</label>
                    <input
                        id="profilePicture"
                        name="profilePicture"
                        type="url"
                        value={form.profilePicture}
                        onChange={handleChange}
                        placeholder="https://example.com/profile.jpg"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <div className="input-wrapper">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label="Toggle Password"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    {form.password && (
                        <div className={`strength ${passwordStrength}`}>
                            Password Strength: {passwordStrength}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="confirm_password">Confirm Password:</label>
                    <div className="input-wrapper">
                        <input
                            id="confirm_password"
                            name="confirm_password"
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                        <span
                            className={`check-icon ${confirmPassword
                                ? form.password === confirmPassword
                                    ? "match"
                                    : "no-match"
                                : ""
                                }`}
                        >
                            <FontAwesomeIcon
                                icon={
                                    form.password === confirmPassword
                                        ? faCheckCircle
                                        : faTimesCircle
                                }
                            />
                        </span>
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirm((prev) => !prev)}
                            aria-label="Toggle Confirm Password"
                        >
                            <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>

                {error && <div className="form-error">{error}</div>}

                <button type="submit" className="register-btn" disabled={loading}>
                    {loading ? "Editing..." : "Update"}
                </button>
                <button type="submit" className="register-btn cancel" disabled={loading} onClick={() => navigate("/profile")}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditPage;
