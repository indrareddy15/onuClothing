import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home } from 'lucide-react';

const NotFound = ({ user, isAuthenticated }) => {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            if (user) {
                navigate('/admin/dashboard')
            } else {
                isAuthenticated ? navigate('/') : navigate('/auth/login')
            }
        }, 5000)
    }, [])
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="text-center space-y-6">
                <h1 className="text-9xl font-bold text-gray-200">404</h1>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
                    <p className="text-gray-500 text-lg">Oops! The page you are looking for does not exist.</p>
                </div>
                <Button
                    onClick={() => navigate('/')}
                    className="btn-primary"
                >
                    <Home className="w-4 h-4 mr-2" />
                    Go Back Home
                </Button>
                <p className="text-sm text-gray-400 mt-4">
                    Redirecting automatically in 5 seconds...
                </p>
            </div>
        </div>
    );
};

export default NotFound;
