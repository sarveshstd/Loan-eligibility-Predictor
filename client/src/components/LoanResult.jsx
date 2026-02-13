/**
 * Loan Result Component
 * 
 * Displays loan eligibility results with visual indicators
 */

import React from 'react';

const LoanResult = ({ result }) => {
  const getApprovalColor = (chance) => {
    switch (chance.toLowerCase()) {
      case 'high':
        return 'text-green-400';
      case 'good':
        return 'text-neon-blue';
      case 'moderate':
        return 'text-yellow-400';
      case 'low':
      case 'very low':
        return 'text-red-400';
      default:
        return 'text-dark-300';
    }
  };

  const getApprovalBg = (chance) => {
    switch (chance.toLowerCase()) {
      case 'high':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'good':
        return 'from-neon-blue/20 to-primary-500/20 border-neon-blue/30';
      case 'moderate':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'low':
      case 'very low':
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      default:
        return 'from-dark-700/50 to-dark-600/50 border-dark-600/30';
    }
  };

  const getApprovalProgressColor = (percentage) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-neon-blue to-primary-500';
    if (percentage >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h2 className="text-2xl font-bold text-white mb-6">
        Eligibility Result
      </h2>

      {/* Main Status Card */}
      <div className={`p-6 rounded-2xl bg-gradient-to-r ${getApprovalBg(result.approvalChance)} border mb-6`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-dark-400 text-sm mb-1">Status</p>
            <h3 className={`text-3xl font-bold ${result.eligible ? 'text-green-400' : 'text-red-400'}`}>
              {result.eligible ? '✅ Eligible' : '❌ Not Eligible'}
            </h3>
            <p className="text-dark-300 mt-2">{result.message}</p>
          </div>
          
          <div className="text-center">
            <p className="text-dark-400 text-sm mb-1">Approval Chance</p>
            <p className={`text-2xl font-bold ${getApprovalColor(result.approvalChance)}`}>
              {result.approvalChance}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-400">Approval Probability</span>
            <span className="text-white font-semibold">{result.approvalPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill bg-gradient-to-r ${getApprovalProgressColor(result.approvalPercentage)}`}
              style={{ width: `${result.approvalPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Max Loan Amount */}
        <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-600/50">
          <p className="text-dark-400 text-sm mb-1">Maximum Eligible Loan</p>
          <p className="text-2xl font-bold text-neon-blue">
            ₹{result.maxLoanAmount.toLocaleString()}
          </p>
        </div>

        {/* Suggested Bank */}
        <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-600/50">
          <p className="text-dark-400 text-sm mb-1">Recommended Lender</p>
          <p className="text-lg font-semibold text-white">
            {result.suggestedBankType}
          </p>
        </div>

        {/* Interest Rate */}
        <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-600/50">
          <p className="text-dark-400 text-sm mb-1">Expected Interest Rate</p>
          <p className="text-xl font-semibold text-white">
            {result.interestRate}
          </p>
        </div>

        {/* Loan Type */}
        <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-600/50">
          <p className="text-dark-400 text-sm mb-1">Loan Type</p>
          <p className="text-xl font-semibold text-white">
            {result.loanType}
          </p>
        </div>
      </div>

      {/* Reasons List */}
      {result.reasons && result.reasons.length > 0 && (
        <div className="mt-6">
          <h4 className="text-white font-semibold mb-3">Assessment Details</h4>
          <ul className="space-y-2">
            {result.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-dark-300">
                <span className="text-neon-blue mt-1">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips Section */}
      {!result.eligible && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <h4 className="text-yellow-400 font-semibold mb-2">💡 Tips to Improve Eligibility</h4>
          <ul className="space-y-2 text-dark-300 text-sm">
            <li>• Improve your CIBIL score above 650</li>
            <li>• Reduce existing EMI obligations</li>
            <li>• Maintain stable employment</li>
            <li>• Apply for appropriate loan amount</li>
          </ul>
        </div>
      )}

      {result.eligible && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <h4 className="text-green-400 font-semibold mb-2">🎉 Great News!</h4>
          <ul className="space-y-2 text-dark-300 text-sm">
            <li>• Your profile meets the eligibility criteria</li>
            <li>• You have a good chance of approval</li>
            <li>• Consider applying with the suggested lender</li>
            <li>• Keep your CIBIL score high for better rates</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LoanResult;
