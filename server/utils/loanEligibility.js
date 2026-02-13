/**
 * Loan Eligibility Calculator
 * 
 * Implements loan eligibility logic based on Indian banking standards
 */

/**
 * Calculates loan eligibility based on various factors
 * 
 * @param {Object} params - Eligibility parameters
 * @param {number} params.cibilScore - CIBIL score (300-900)
 * @param {number} params.monthlyIncome - Monthly income in INR
 * @param {number} params.existingEmi - Existing EMI payments
 * @param {string} params.employmentType - 'government', 'private', or 'self-employed'
 * @param {number} params.age - Age of applicant
 * @param {number} params.loanAmount - Requested loan amount (optional)
 * @param {Object} params.loanTypeDetails - Loan type details
 * @returns {Object} Eligibility result
 */
const checkLoanEligibility = ({
    cibilScore,
    monthlyIncome,
    existingEmi = 0,
    employmentType,
    age,
    loanAmount,
    loanTypeDetails
}) => {
    // Initialize result object
    const result = {
        eligible: false,
        approvalChance: 'Low',
        maxLoanAmount: 0,
        suggestedBankType: '',
        interestRate: loanTypeDetails.interestRate,
        message: '',
        reasons: []
    };

    // 1. Check CIBIL Score
    let cibilRating = '';
    if (cibilScore >= 750) {
        cibilRating = 'Excellent';
        result.approvalChance = 'High';
    } else if (cibilScore >= 650) {
        cibilRating = 'Good';
        result.approvalChance = 'Moderate';
    } else if (cibilScore >= 600) {
        cibilRating = 'Fair';
        result.approvalChance = 'Low';
    } else {
        cibilRating = 'Poor';
        result.approvalChance = 'Very Low';
    }
    result.reasons.push(`CIBIL Score: ${cibilScore} (${cibilRating})`);

    // 2. Check Age Eligibility
    let maxAge = 60; // Default for private employees
    if (employmentType === 'government') {
        maxAge = 65;
    } else if (employmentType === 'self-employed') {
        maxAge = 65;
    }

    if (age < 21) {
        result.reasons.push(`Age ${age} is below minimum requirement of 21 years`);
        result.message = 'Age must be at least 21 years';
        return result;
    }

    if (age > maxAge) {
        result.reasons.push(`Age ${age} exceeds maximum limit of ${maxAge} for ${employmentType} employees`);
        result.message = `Maximum age for ${employmentType} employees is ${maxAge} years`;
        return result;
    }
    result.reasons.push(`Age: ${age} years (Eligible - within ${employmentType} limits)`);

    // 3. Check Debt-to-Income Ratio (EMI to Income ratio)
    const totalEmi = existingEmi;
    const dtiRatio = (totalEmi / monthlyIncome) * 100;

    if (dtiRatio > 50) {
        result.reasons.push(`Debt-to-Income ratio: ${dtiRatio.toFixed(1)}% (Exceeds 50% limit)`);
        result.message = 'Your existing EMI obligations exceed 50% of your income';
        return result;
    }
    result.reasons.push(`Debt-to-Income ratio: ${dtiRatio.toFixed(1)}% (Within safe limit)`);

    // 4. Calculate Maximum Loan Amount based on income
    // Generally, banks offer 60-80 times of monthly income for personal loans
    // For home loans, they offer 60-80% of property value
    
    let maxMultiplier = 60; // Base multiplier
    
    // Adjust based on employment type
    if (employmentType === 'government') {
        maxMultiplier = 75; // Government employees get higher multiples
        result.suggestedBankType = 'Government Bank (SBI, Bank of Baroda, PNB)';
    } else if (employmentType === 'private') {
        maxMultiplier = 60;
        result.suggestedBankType = 'Private Bank (HDFC, ICICI, Axis)';
    } else {
        maxMultiplier = 50; // Self-employed get lower multiples
        result.suggestedBankType = 'NBFC (Bajaj, Capital Float)';
    }

    // Adjust based on CIBIL score
    if (cibilScore >= 750) {
        maxMultiplier *= 1.2;
    } else if (cibilScore < 650) {
        maxMultiplier *= 0.7;
    }

    // Calculate max loan amount
    const calculatedMaxAmount = monthlyIncome * maxMultiplier;
    result.maxLoanAmount = Math.min(
        Math.round(calculatedMaxAmount),
        loanTypeDetails.maxAmount
    );

    // 5. Check if requested loan amount is within eligibility
    if (loanAmount && loanAmount > result.maxLoanAmount) {
        result.reasons.push(`Requested loan amount ₹${loanAmount.toLocaleString()} exceeds maximum eligible amount ₹${result.maxLoanAmount.toLocaleString()}`);
        result.message = `Maximum eligible loan amount is ₹${result.maxLoanAmount.toLocaleString()}`;
        // Still show as eligible but with reduced amount
    }

    // 6. Check minimum income requirement for loan type
    if (monthlyIncome < loanTypeDetails.minIncome) {
        result.reasons.push(`Monthly income ₹${monthlyIncome.toLocaleString()} is below minimum requirement of ₹${loanTypeDetails.minIncome.toLocaleString()} for ${loanTypeDetails.name}`);
        result.message = `Minimum monthly income required is ₹${loanTypeDetails.minIncome.toLocaleString()}`;
        return result;
    }

    // 7. Check minimum CIBIL requirement for loan type
    if (cibilScore < loanTypeDetails.minCibil) {
        result.reasons.push(`CIBIL score ${cibilScore} is below minimum requirement of ${loanTypeDetails.minCibil} for ${loanTypeDetails.name}`);
        result.message = `Minimum CIBIL score required is ${loanTypeDetails.minCibil}`;
        return result;
    }

    // 8. Final eligibility determination
    if (cibilScore >= 650 && dtiRatio <= 50) {
        result.eligible = true;
        
        if (cibilScore >= 750) {
            result.approvalChance = 'High';
            result.message = 'Excellent! You have high chances of loan approval';
        } else if (cibilScore >= 700) {
            result.approvalChance = 'Good';
            result.message = 'Good chances of loan approval';
        } else {
            result.approvalChance = 'Moderate';
            result.message = 'Moderate chances of loan approval';
        }
    } else if (cibilScore < 650) {
        result.eligible = false;
        result.message = 'CIBIL score needs improvement for loan approval';
    } else {
        result.eligible = false;
        result.message = 'High existing debt needs to be reduced';
    }

    // Add employment type to reasons
    const employmentLabels = {
        'government': 'Government Employee',
        'private': 'Private Employee',
        'self-employed': 'Self-Employed'
    };
    result.reasons.push(`${employmentLabels[employmentType]} - ${employmentType === 'government' ? 'Higher approval weight' : employmentType === 'private' ? 'Standard approval weight' : 'Strict approval criteria'}`);

    // Calculate approval percentage for UI
    let approvalPercentage = 0;
    if (cibilScore >= 750) approvalPercentage += 40;
    else if (cibilScore >= 700) approvalPercentage += 30;
    else if (cibilScore >= 650) approvalPercentage += 20;
    else approvalPercentage += 5;

    if (dtiRatio <= 30) approvalPercentage += 30;
    else if (dtiRatio <= 40) approvalPercentage += 20;
    else approvalPercentage += 10;

    if (employmentType === 'government') approvalPercentage += 20;
    else if (employmentType === 'private') approvalPercentage += 15;
    else approvalPercentage += 10;

    if (age <= 35) approvalPercentage += 10;

    result.approvalPercentage = Math.min(approvalPercentage, 95);

    return result;
};

/**
 * Calculate EMI for a loan
 * 
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate
 * @param {number} years - Loan tenure in years
 * @returns {number} Monthly EMI
 */
const calculateEMI = (principal, annualRate, years) => {
    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;
    
    if (monthlyRate === 0) {
        return principal / months;
    }
    
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    
    return Math.round(emi * 100) / 100;
};

module.exports = {
    checkLoanEligibility,
    calculateEMI
};
