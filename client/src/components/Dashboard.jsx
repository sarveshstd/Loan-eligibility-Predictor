/**
 * Dashboard Component
 * 
 * Main dashboard with loan eligibility form and results
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIAssistant from './AIAssistant';
import EMICalculator from './EMICalculator';
import LoanResult from './LoanResult';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [loanType, setLoanType] = useState('personal');
  const [cibilScore, setCibilScore] = useState(user?.cibilScore || '');
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || '');
  const [existingEmi, setExistingEmi] = useState(user?.existingEmi || 0);
  const [employmentType, setEmploymentType] = useState(user?.employmentType || 'private');
  const [age, setAge] = useState(user?.age || '');
  const [loanAmount, setLoanAmount] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [loanTypes, setLoanTypes] = useState([]);

  // Fetch loan types on mount
  useEffect(() => {
    fetchLoanTypes();
  }, []);

  const fetchLoanTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/loan/types`);
      setLoanTypes(response.data.loanTypes);
    } catch (err) {
      console.error('Error fetching loan types:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!cibilScore || !monthlyIncome || !age || !loanAmount) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (cibilScore < 300 || cibilScore > 900) {
      setError('CIBIL score must be between 300 and 900');
      setLoading(false);
      return;
    }

    if (age < 18 || age > 100) {
      setError('Age must be between 18 and 100');
      setLoading(false);
      return;
    }

    try {
      // Update user profile
      await updateProfile({
        cibilScore: parseInt(cibilScore),
        monthlyIncome: parseFloat(monthlyIncome),
        existingEmi: parseFloat(existingEmi),
        employmentType,
        age: parseInt(age)
      });

      // Check eligibility
      const response = await axios.post(`${API_URL}/loan/check`, {
        loanType,
        cibilScore: parseInt(cibilScore),
        monthlyIncome: parseFloat(monthlyIncome),
        existingEmi: parseFloat(existingEmi),
        employmentType,
        age: parseInt(age),
        loanAmount: parseFloat(loanAmount)
      });

      setEligibilityResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error checking eligibility. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="glass-card border-b border-dark-600/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient">
            Loan Eligibility Checker
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-dark-300 hidden sm:block">
              Welcome, <span className="text-neon-blue">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm py-2"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Eligibility Form Card */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Check Your Eligibility
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Loan Type Selection */}
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Loan Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {loanTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setLoanType(type.id)}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          loanType === type.id
                            ? 'border-neon-blue bg-neon-blue/10 text-neon-blue'
                            : 'border-dark-600 bg-dark-800/50 text-dark-300 hover:border-dark-500'
                        }`}
                      >
                        <div className="font-medium text-sm">{type.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CIBIL Score */}
                  <div>
                    <label className="block text-dark-300 text-sm font-medium mb-2">
                      CIBIL Score *
                    </label>
                    <input
                      type="number"
                      value={cibilScore}
                      onChange={(e) => setCibilScore(e.target.value)}
                      className="input-field"
                      placeholder="Enter CIBIL score (300-900)"
                      min="300"
                      max="900"
                    />
                    <p className="text-dark-400 text-xs mt-1">
                      Check your score at cibil.com
                    </p>
                  </div>

                  {/* Monthly Income */}
                  <div>
                    <label className="block text-dark-300 text-sm font-medium mb-2">
                      Monthly Income (₹) *
                    </label>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className="input-field"
                      placeholder="Enter monthly income"
                      min="0"
                    />
                  </div>

                  {/* Existing EMI */}
                  <div>
                    <label className="block text-dark-300 text-sm font-medium mb-2">
                      Existing EMI (₹)
                    </label>
                    <input
                      type="number"
                      value={existingEmi}
                      onChange={(e) => setExistingEmi(e.target.value)}
                      className="input-field"
                      placeholder="Enter existing EMI"
                      min="0"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-dark-300 text-sm font-medium mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="input-field"
                      placeholder="Enter your age"
                      min="18"
                      max="100"
                    />
                  </div>

                  {/* Employment Type */}
                  <div className="md:col-span-2">
                    <label className="block text-dark-300 text-sm font-medium mb-2">
                      Employment Type *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'government', label: 'Government' },
                        { id: 'private', label: 'Private' },
                        { id: 'self-employed', label: 'Self-Employed' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setEmploymentType(type.id)}
                          className={`p-3 rounded-xl border transition-all duration-300 ${
                            employmentType === type.id
                              ? 'border-neon-blue bg-neon-blue/10 text-neon-blue'
                              : 'border-dark-600 bg-dark-800/50 text-dark-300 hover:border-dark-500'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Loan Amount */}
                  <div className="md:col-span-2">
                    <label className="block text-dark-300 text-sm font-medium mb-2">
                      Requested Loan Amount (₹) *
                    </label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="input-field"
                      placeholder="Enter loan amount you need"
                      min="0"
                    />
                  </div>
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
                      Checking Eligibility...
                    </div>
                  ) : (
                    'Check Eligibility'
                  )}
                </button>
              </form>
            </div>

            {/* EMI Calculator Toggle */}
            <div className="glass-card p-6">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="w-full flex items-center justify-between text-white"
              >
                <span className="text-xl font-semibold">EMI Calculator</span>
                <svg
                  className={`w-6 h-6 transition-transform ${showCalculator ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCalculator && (
                <div className="mt-6 animate-slide-up">
                  <EMICalculator />
                </div>
              )}
            </div>

            {/* Results Section */}
            {eligibilityResult && (
              <LoanResult result={eligibilityResult} />
            )}
          </div>

          {/* Sidebar - AI Assistant */}
          <div className="lg:col-span-1">
            <AIAssistant 
              isOpen={showAssistant} 
              onToggle={() => setShowAssistant(!showAssistant)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
