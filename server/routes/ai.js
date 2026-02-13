/**
 * AI Assistant Routes
 * 
 * Handles AI chatbot conversations
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { getAIResponse } = require('../utils/aiAssistant');

/**
 * @route   POST /api/ai/chat
 * @desc    Send message to AI assistant
 * @access  Private
 */
router.post('/chat', auth, [
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Message must be between 1 and 500 characters')
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

        const { message } = req.body;

        // Get AI response
        const response = await getAIResponse(message);

        res.json({
            success: true,
            response: response
        });

    } catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error processing your message'
        });
    }
});

/**
 * @route   GET /api/ai/topics
 * @desc    Get available topics for AI assistant
 * @access  Public
 */
router.get('/topics', (req, res) => {
    try {
        const topics = [
            {
                id: 'cibil',
                question: 'What is CIBIL score?',
                category: 'Credit Score'
            },
            {
                id: 'improve',
                question: 'How to improve loan eligibility?',
                category: 'Eligibility'
            },
            {
                id: 'govt-vs-private',
                question: 'Difference between government and private bank loans?',
                category: 'Loan Types'
            },
            {
                id: 'emi',
                question: 'EMI calculation explanation',
                category: 'EMI'
            },
            {
                id: 'tips',
                question: 'Tips to increase approval chances',
                category: 'Eligibility'
            },
            {
                id: 'documents',
                question: 'What documents are required for loan?',
                category: 'Documentation'
            },
            {
                id: 'interest-rates',
                question: 'Current interest rates for loans?',
                category: 'Interest Rates'
            },
            {
                id: 'eligibility-criteria',
                question: 'What are the eligibility criteria for loans?',
                category: 'Eligibility'
            }
        ];

        res.json({
            success: true,
            topics: topics
        });

    } catch (error) {
        console.error('Get topics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching topics'
        });
    }
});

module.exports = router;
