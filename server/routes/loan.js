/**
 * Loan Eligibility the loan routes file: Routes
 * 
 * Handles loan eligibility checks and loan type information
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { checkLoanEligibility } = require('../utils/loanEligibility');

// Loan types available
const loanTypes = [
    {
        id: 'home',
        name: 'Home Loan',
        description: 'Finance your dream home with competitive interest rates',
        minAmount: 500000,
        maxAmount: 50000000,
        minIncome: 25000,
        minCibil: 650,
        interestRate: '8.50% - 9.50%',
        maxTenure: 30
    },
    {
        id: 'personal',
        name: 'Personal Loan',
        description: 'Meet any personal financial need with quick approval',
        minAmount: 50000,
        maxAmount: 2500000,
        minIncome: 20000,
        minCibil: 650,
        interestRate: '10.50% - 19.00%',
        maxTenure: 7
    },
    {
        id: 'car',
        name: 'Car Loan',
        description: 'Finance your new car with easy EMIs',
        minAmount: 100000,
        maxAmount: 10000000,
        minIncome: 25000,
        minCibil: 650,
        interestRate: '8.50% - 12.00%',
        maxTenure: 7
    },
    {
        id: 'education',
        name: 'Education Loan',
        description: 'Fund your education journey with low interest rates',
        minAmount: 50000,
        maxAmount: 2000000,
        minIncome: 15000,
        minCibil: 600,
        interestRate: '8.50% - 12.00%',
        maxTenure: 15
    }
];

/**
 * @route   POST /api/loan/check
 * @desc    Check loan eligibility
 * @access  Private
 */
router.post('/check', auth, [
    body('loanType')
        .notEmpty()
        .withMessage('Loan type is required')
        .isIn(['home', 'personal', 'car', 'education'])
        .withMessage('Invalid loan type'),
    body('cibilScore')
        .isInt({ min: 300, max: 900 })
        .withMessage('CIBIL score must be between 300 and 900'),
    body('monthlyIncome')
        .isFloat({ min: 0 })
        .withMessage('Monthly income is required'),
    body('existingEmi')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Existing EMI must be a positive number'),
    body('employmentType')
        .isIn(['government', 'private', 'self-employed'])
        .withMessage('Employment type is required'),
    body('age')
        .isInt({ min: 18, max: 100 })
        .withMessage('Age must be between 18 and 100'),
    body('loanAmount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Loan amount must be positive')
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg,
                errors: errors.array()
            });
        }

        const { 
            loanType, 
            cibilScore, 
            monthlyIncome, 
            existingEmi = 0, 
            employmentType, 
            age,
            loanAmount 
        } = req.body;

        // Get loan type details
        const loanTypeDetails = loanTypes.find(lt => lt.id === loanType);
        
        if (!loanTypeDetails) {
            return res.status(400).json({
                success: false,
                message: 'Invalid loan type'
            });
        }

        // Check eligibility using the utility function
        const eligibilityResult = checkLoanEligibility({
            cibilScore,
            monthlyIncome,
            existingEmi,
            employmentType,
            age,
            loanAmount,
            loanTypeDetails
        });

        // Return eligibility result
        res.json({
            success: true,
            loanType: loanTypeDetails.name,
            ...eligibilityResult
        });

    } catch (error) {
        console.error('Loan eligibility error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error checking eligibility'
        });
    }
});

/**
 * @route   GET /api/loan/types
 * @desc    Get all available loan types
 * @access  Public
 */
router.get('/types', (req, res) => {
    try {
        res.json({
            success: true,
            loanTypes: loanTypes
        });
    } catch (error) {
        console.error('Get loan types error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching loan types'
        });
    }
});

/**
 * @route   POST /api/loan/calculate-emi
 * @desc    Calculate EMI for a loan
 * @access  Public
 */
router.post('/calculate-emi', [
    body('principal')
        .isFloat({ min: 0 })
        .withMessage('Principal amount is required'),
    body('interestRate')
        .isFloat({ min: 0 })
        .withMessage('Interest rate is required'),
    body('tenure')
        .isInt({ min: 1 })
        .withMessage('Tenure is required')
], (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg,
                errors: errors.array()
            });
        }

        const { principal, interestRate, tenure } = req.body;

        // Convert tenure to months
        const months = tenure * 12;
        
        // Calculate monthly interest rate
        const monthlyRate = interestRate / 12 / 100;
        
        // Calculate EMI using formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
        let emi;
        if (monthlyRate === 0) {
            emi = principal / months;
        } else {
            emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                  (Math.pow(1 + monthlyRate, months) - 1);
        }

        // Calculate total interest and total payment
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;

        res.json({
            success: true,
            emi: Math.round(emi * 100) / 100,
            principal,
            interestRate,
            tenureMonths: months,
            totalInterest: Math.round(totalInterest * 100) / 100,
            totalPayment: Math.round(totalPayment * 100) / 100,
            breakdown: {
                monthlyEMI: Math.round(emi * 100) / 100,
                totalInterest: Math.round(totalInterest * 100) / 100,
                totalPayment: Math.round(totalPayment * 100) / 100
            }
        });

    } catch (error) {
        console.error('EMI calculation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error calculating EMI'
        });
    }
});

module.exports = router;
