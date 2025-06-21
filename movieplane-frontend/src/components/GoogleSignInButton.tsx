import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../api/axiosClient";

interface GoogleSignInButtonProps {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess, onError }) => {
    const { login } = useAuth();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            const res = await axiosClient.post<any>('/auth/google', {
                id_token: credentialResponse.credential,
            });
            const { token, user } = res.data;
            login(token, user);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error('Google Sign-In backend error:', error.response?.data || error.message);
            if (onError) {
                onError(error.response?.data?.message || 'Google Sign-In failed.');
            }
        }
    }

    const handleError = () => {
        console.log('Google Sign-In Failed');
        if (onError) {
            onError('Google Sign-In failed on client side.');
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap // Optional: for one-tap sign-in experience
        />
    );
}

export default GoogleSignInButton;