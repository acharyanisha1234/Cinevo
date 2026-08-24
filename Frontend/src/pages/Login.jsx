import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Login component – renders the sign‑in form
const Login = () => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');         // holds error messages
  const [isLoading, setIsLoading] = useState(false); // disables form during request

  const { login } = useAuth();    // authentication function from context
  const navigate = useNavigate(); // programmatic navigation

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();           // prevent page reload
    setError('');                 // clear previous errors
    setIsLoading(true);           // show loading state

    // Basic client-side validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password); // call the login method
      navigate('/');                // redirect to home on success
    } catch (err) {
      // Display error from the server or a generic message
      setError(err.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-2xl">
        {/* Brand and title */}
        <h1 className="text-4xl font-bold text-red-600 text-center mb-2">Cinevo</h1>
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Sign In</h2>

        {/* Error message display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              placeholder="you@example.com"
              disabled={isLoading}
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>

          {/* Submit button with loading spinner */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Link to registration page */}
        <p className="text-gray-400 text-sm mt-6 text-center">
          New to Cinevo?{' '}
          <Link to="/register" className="text-white hover:underline font-medium">
            Sign up now
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;