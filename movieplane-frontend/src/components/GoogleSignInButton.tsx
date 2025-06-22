import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../api/axiosClient";

interface GoogleSignInButtonProps {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess, onError }) => {
    const { login, toast } = useAuth();
    const navigate = useNavigate();
    const handleSuccess = async (credentialResponse: any) => {
        try {
            const res = await axiosClient.post<any>('/auth/google', {
                id_token: credentialResponse.credential,
            });
            const { token, user } = res.data;
            login(token, user);
            toast('Google Sign-In successful!', 'success');
            // navigate to the home page after successful login
            navigate('/');

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            toast(`Google Sign-In backend error:, ${error.response?.data?.message || 'An error occurred.'}`, 'error');
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
            logo_alignment="left"
            containerProps={{ style: { width: '100%' } }}
            text="continue_with"
            theme="filled_blue"
            shape="rectangular"
        />
    );
}

export default GoogleSignInButton;