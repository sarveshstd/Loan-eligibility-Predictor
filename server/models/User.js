/**
 * User Model - MongoDB Schema
 * 
 * This model defines the user schema for authentication
 * and storing user profile information.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // User credentials
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    
    // User profile
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    
    // Loan eligibility data (optional - can be stored for returning users)
    cibilScore: {
        type: Number,
        min: 300,
        max: 900,
        default: null
    },
    monthlyIncome: {
        type: Number,
        default: null
    },
    existingEmi: {
        type: Number,
        default: 0
    },
    employmentType: {
        type: String,
        enum: ['government', 'private', 'self-employed'],
        default: null
    },
    age: {
        type: Number,
        min: 18,
        max: 100,
        default: null
    },
    
    // Account timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for eligibility check results (not stored in DB)
userSchema.virtual('eligibilityStatus').get(function() {
    if (!this.cibilScore || !this.monthlyIncome || !this.employmentType) {
        return null;
    }
    return null;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        email: this.email,
        name: this.name,
        cibilScore: this.cibilScore,
        monthlyIncome: this.monthlyIncome,
        employmentType: this.employmentType,
        age: this.age,
        createdAt: this.createdAt
    };
};

// Email already has unique index from field definition, no need for additional index

module.exports = mongoose.model('User', userSchema);
