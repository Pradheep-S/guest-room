'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaHome, FaArrowLeft } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Password reset instructions have been sent to your email address.');
        setIsSuccess(true);
      } else {
        setErrors({ general: data.message || 'Failed to send reset email' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A4D69] via-[#1A3C52] to-[#0F2A3E] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-[#F9E4B7] transition-colors duration-300">
            <FaHome className="text-2xl" />
            <h1 className="text-3xl font-bold">GuestRoom</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {!isSuccess ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A4D69] focus:border-transparent`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#2A4D69] hover:bg-[#1A3C52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A4D69] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending instructions...
                  </div>
                ) : (
                  'Send reset instructions'
                )}
              </button>
            </form>
          ) : (
            /* Success Message */
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-600">{message}</p>
              </div>
              <p className="text-sm text-gray-600">
                Please check your email and follow the instructions to reset your password.
              </p>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login"
              className="inline-flex items-center text-sm text-[#2A4D69] hover:text-[#1A3C52] font-medium transition-colors duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
