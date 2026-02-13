/**
 * EMI Calculator Component
 * 
 * Calculate monthly EMI for loans
 */

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const EMICalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (!principal || !interestRate || !tenure) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/loan/calculate-emi`, {
        principal: parseFloat(principal),
        interestRate: parseFloat(interestRate),
        tenure: parseFloat(tenure)
      });

      setResult(response.data);
    } catch (err) {
      console.error('EMI calculation error:', err);
    }

    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Principal Amount */}
        <div>
          <label className="block text-dark-300 text-sm font-medium mb-2">
            Loan Amount (₹)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="input-field"
            placeholder="Enter loan amount"
            min="0"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-dark-300 text-sm font-medium mb-2">
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="input-field"
            placeholder="Enter interest rate"
            min="0"
            step="0.1"
          />
        </div>

        {/* Tenure */}
        <div>
          <label className="block text-dark-300 text-sm font-medium mb-2">
            Tenure (Years)
          </label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="input-field"
            placeholder="Enter tenure"
            min="1"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={loading || !principal || !interestRate || !tenure}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Calculating...' : 'Calculate EMI'}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-6 p-6 bg-dark-800/50 rounded-xl border border-dark-600 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4">EMI Breakdown</h3>
          
          <div className="space-y-4">
            {/* Monthly EMI - Highlighted */}
            <div className="text-center p-4 bg-gradient-to-r from-neon-blue/20 to-primary-600/20 rounded-xl border border-neon-blue/30">
              <p className="text-dark-400 text-sm mb-1">Monthly EMI</p>
              <p className="text-3xl font-bold text-neon-blue">
                {formatCurrency(result.emi)}
              </p>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-dark-700/50 rounded-lg">
                <p className="text-dark-400 text-xs">Principal Amount</p>
                <p className="text-white font-semibold">{formatCurrency(result.principal)}</p>
              </div>
              <div className="p-3 bg-dark-700/50 rounded-lg">
                <p className="text-dark-400 text-xs">Interest Rate</p>
                <p className="text-white font-semibold">{result.interestRate}%</p>
              </div>
              <div className="p-3 bg-dark-700/50 rounded-lg">
                <p className="text-dark-400 text-xs">Tenure</p>
                <p className="text-white font-semibold">{result.tenureMonths} months</p>
              </div>
              <div className="p-3 bg-dark-700/50 rounded-lg">
                <p className="text-dark-400 text-xs">Total Interest</p>
                <p className="text-white font-semibold">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>

            {/* Total Payment */}
            <div className="mt-4 p-4 bg-dark-700/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-dark-300">Total Payment</span>
                <span className="text-white font-bold text-lg">
                  {formatCurrency(result.totalPayment)}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Bar Chart */}
          <div className="mt-6">
            <p className="text-dark-400 text-sm mb-2">Principal vs Interest</p>
            <div className="h-6 bg-dark-700 rounded-full overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-neon-blue to-primary-500"
                style={{ width: `${(result.principal / result.totalPayment) * 100}%` }}
              />
              <div 
                className="bg-gradient-to-r from-neon-pink to-neon-purple"
                style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-blue to-primary-500" />
                <span className="text-dark-400">Principal ({((result.principal / result.totalPayment) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple" />
                <span className="text-dark-400">Interest ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMICalculator;
