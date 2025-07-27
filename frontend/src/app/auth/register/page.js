'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaHome,
  FaUserTie,
  FaUserFriends 
} from 'react-icons/fa';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get role from URL params
    const roleParam = searchParams.get('role');
    if (roleParam && ['customer', 'houseOwner'].includes(roleParam)) {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }

    // Check if user is already logged in
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, [router, searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          mobile: formData.mobile.trim(),
          password: formData.password,
          role: formData.role
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...');
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const errorObj = {};
          data.errors.forEach(error => {
            errorObj[error.path || error.param] = error.msg;
          });
          setErrors(errorObj);
        } else {
          setErrors({ general: data.message || 'Registration failed' });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-[#F9E4B7] hover:text-white transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Register as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors duration-300 ${
                  formData.role === 'customer'
                    ? 'border-[#2A4D69] bg-[#2A4D69] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaUserFriends className="mr-2" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'houseOwner' }))}
                className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors duration-300 ${
                  formData.role === 'houseOwner'
                    ? 'border-[#2A4D69] bg-[#2A4D69] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaUserTie className="mr-2" />
                House Owner
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A4D69] focus:border-transparent`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

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
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A4D69] focus:border-transparent`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A4D69] focus:border-transparent`}
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
              {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A4D69] focus:border-transparent`}
                  placeholder="Enter password (min 6 characters)"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A4D69] focus:border-transparent`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Terms Agreement */}
            <div>
              <div className="flex items-start">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#2A4D69] focus:ring-[#2A4D69] border-gray-300 rounded mt-1"
                />
                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#2A4D69] hover:text-[#1A3C52] font-medium">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#2A4D69] hover:text-[#1A3C52] font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-600">{message}</p>
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
                  Creating account...
                </div>
              ) : (
                `Register as ${formData.role === 'houseOwner' ? 'House Owner' : 'Customer'}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
