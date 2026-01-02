import CommonForm from '@/components/common/form';
import { loginFormControls } from '@/config';
import { useSettingsContext } from '@/Context/SettingsContext';
import { loginUser } from '@/store/auth-slice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const AuthLogIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'admin'
    });
    const { checkAndCreateToast } = useSettingsContext();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('formData', formData);
            const res = await dispatch(loginUser(formData));
            if (res?.payload?.Success) {
                checkAndCreateToast("success", "LogIn Successful");
                setFormData({
                    email: '',
                    password: '',
                    role: '',
                });
                navigate('/admin/dashboard');
            } else {
                checkAndCreateToast("error", `LogIn Failed! ${res?.payload?.message}`);
            }
        } catch (error) {
            console.error(`Error Occurred While LogIn User: ${error.message}`);
            checkAndCreateToast("error", 'LogIn Failed Internally!`)');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50/50 px-4 py-12 animate-fadeIn">
            <div className="card w-full max-w-md p-8 space-y-8 bg-white shadow-lg border-0 sm:border sm:border-gray-200">
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Log in
                    </h1>
                    <p className="text-sm text-gray-500">
                        Enter your credentials to access your account
                    </p>
                </div>

                {/* Form Section */}
                <CommonForm
                    formControls={loginFormControls}
                    setFormData={setFormData}
                    formData={formData}
                    handleSubmit={onSubmit}
                    buttonText="Sign In"
                    isBtnValid={formData.email && formData.password}
                />

                <div className="text-center text-sm">
                    Don't have an account?{' '}
                    <Link
                        to="/auth/register"
                        className="font-medium text-primary hover:text-primary/90 hover:underline underline-offset-4 transition-colors"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthLogIn;
