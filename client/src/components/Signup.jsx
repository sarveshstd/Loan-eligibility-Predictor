/**
 * Signup Component
 * 
 * Glassmorphism UI with animated gradient background
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register(name, email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    animationDelay: Math.random() * 5,
    animationDuration: 3 + Math.random() * 4
  }));

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden flex items-center justify-center p-4">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`
          }}
        />
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Signup Card */}
      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Create Account
          </h1>
          <p className="text-dark-300">Join us to check your loan eligibility</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-dark-300 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-dark-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-dark-300 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="Create a password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-neon-blue transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-dark-300 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-dark-400">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-blue hover:text-primary-400 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
