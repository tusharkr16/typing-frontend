'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3 && !isLogin) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6 && !isLogin) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const endpoint = isLogin ? 'https://monkeytype-uqby.onrender.com/api/auth/login' : 'https://monkeytype-uqby.onrender.com/api/auth/signup';
            const body = isLogin
                ? { username: formData.username, password: formData.password }
                : { username: formData.username, password: formData.password };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if(response.status === 200){
                localStorage.setItem('token', data.token);
                router.push('/session')
            }

        } catch (error) {
            console.error('Auth error:', error);
            setApiError(error.message || (isLogin ? 'Login failed' : 'Registration failed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            username: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
        setApiError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 m-8 space-y-8 bg-white border border-black rounded-lg shadow">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        onClick={toggleAuthMode}
                        className="relative inline-flex items-center h-8 rounded-full w-36 bg-indigo-100"
                    >
                        <span
                            className={`absolute left-0 inline-flex items-center justify-center w-1/2 h-8 text-sm font-medium rounded-full transition-all duration-300 ${isLogin ? 'text-white bg-indigo-600' : 'text-indigo-600'
                                }`}
                        >
                            Sign In
                        </span>
                        <span
                            className={`absolute right-0 inline-flex items-center justify-center w-1/2 h-8 text-sm font-medium rounded-full transition-all duration-300 ${!isLogin ? 'text-white bg-indigo-600' : 'text-indigo-600'
                                }`}
                        >
                            Sign Up
                        </span>
                    </button>
                </div>

                {apiError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700">{apiError}</p>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className={`mt-1 block w-full px-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                value={formData.username}
                                onChange={handleChange}
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                required
                                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required={!isLogin}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {isLogin && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? isLogin
                                    ? 'Signing in...'
                                    : 'Signing up...'
                                : isLogin
                                    ? 'Sign in'
                                    : 'Sign up'}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <p className="text-gray-600">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            type="button"
                            onClick={toggleAuthMode}
                            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}