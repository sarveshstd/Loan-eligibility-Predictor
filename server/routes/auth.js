/**
 * Authentication Routes
 * 
 * Handles user registration, login, and profile management
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult, param } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'default-secret-key',
        { expiresIn: '7d' }
    );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', [
    // Validation middleware
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
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

        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        user = new User({
            name,
            email,
            password
        });

        // Save user to database
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Return response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
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

        const { email, password } = req.body;

        // Find user by email (include password for comparison)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return response
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                cibilScore: user.cibilScore,
                monthlyIncome: user.monthlyIncome,
                employmentType: user.employmentType,
                age: user.age
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: user.getPublicProfile()
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', auth, [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('cibilScore')
        .optional()
        .isInt({ min: 300, max: 900 })
        .withMessage('CIBIL score must be between 300 and 900'),
    body('monthlyIncome')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Monthly income must be a positive number'),
    body('employmentType')
        .optional()
        .isIn(['government', 'private', 'self-employed'])
        .withMessage('Invalid employment type'),
    body('age')
        .optional()
        .isInt({ min: 18, max: 100 })
        .withMessage('Age must be between 18 and 100')
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

        const { name, cibilScore, monthlyIncome, existingEmi, employmentType, age } = req.body;

        // Build update object
        const updateData = {};
        if (name) updateData.name = name;
        if (cibilScore !== undefined) updateData.cibilScore = cibilScore;
        if (monthlyIncome !== undefined) updateData.monthlyIncome = monthlyIncome;
        if (existingEmi !== undefined) updateData.existingEmi = existingEmi;
        if (employmentType) updateData.employmentType = employmentType;
        if (age !== undefined) updateData.age = age;

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: user.getPublicProfile()
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating profile'
        });
    }
});

module.exports = router;
