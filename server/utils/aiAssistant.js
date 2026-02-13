/**
 * AI Assistant Utility
 * 
 * Rule-based AI assistant for loan-related queries
 * Can be extended with OpenAI API integration
 */

const OpenAI = require('openai');

// Initialize OpenAI client if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
}

/**
 * Rule-based responses for common loan questions
 */
const ruleBasedResponses = {
    cibil: {
        keywords: ['cibil', 'credit score', 'credit rating', 'cibil score'],
        response: `CIBIL (Credit Information Bureau of India Limited) score is a three-digit numeric summary of your credit history. Here's what you need to know:

• **Score Range**: 300 to 900
• **Excellent**: 750-900
• **Good**: 700-749
• **Fair**: 650-699
• **Poor**: Below 650

**Factors affecting CIBIL Score:**
1. Payment history (35% weight)
2. Credit utilization (30% weight)
3. Credit mix (15% weight)
4. Length of credit history (10% weight)
5. New credit inquiries (10% weight)

A higher CIBIL score increases your chances of loan approval and helps you get better interest rates.`
    },
    
    improve: {
        keywords: ['improve', 'increase', 'boost', 'enhance'],
        response: `Here are proven ways to improve your loan eligibility:

**1. Improve CIBIL Score:**
• Pay all EMIs and credit card bills on time
• Keep credit utilization below 30%
• Don't apply for multiple loans simultaneously
• Maintain a good credit mix (secured + unsecured)
• Check your CIBIL report regularly for errors

**2. Increase Income:**
• Show additional income sources
• Maintain stable employment history
• Provide all required income documents

**3. Reduce Existing Debts:**
• Pay off existing loans
• Lower your debt-to-income ratio
• Close unused credit cards

**4. Choose Right Loan Type:**
• Government employees get priority
• Self-employed may need additional collateral
• Match loan amount to eligibility`
    },
    
    'govt-vs-private': {
        keywords: ['government', 'private', 'bank', 'difference', 'govt'],
        response: `Key differences between Government and Private Bank Loans:

**Government Banks (SBI, Bank of Baroda, PNB):**
✓ Lower interest rates (8-10%)
✓ Higher loan amounts
✓ Longer tenure (up to 30 years)
✓ More lenient eligibility
✓ Stable job = highest approval
✓ Processing fees lower
✗ Slower processing time

**Private Banks (HDFC, ICICI, Axis):**
✓ Faster processing
✓ Better digital services
✓ Flexible options
✗ Higher interest rates (10-15%)
✗ Strict eligibility
✗ Higher processing fees

**NBFCs (Bajaj, Capital Float):**
✓ Easiest approval
✓ Minimal documentation
✓ Quick disbursement
✓ Higher interest rates
✓ Good for self-employed`
    },
    
    emi: {
        keywords: ['emi', 'calculate', 'calculation', 'monthly payment'],
        response: `EMI (Equated Monthly Installment) Calculation:

**Formula:**
EMI = P × r × (1+r)^n / ((1+r)^n - 1)

Where:
• P = Principal (loan amount)
• r = Monthly interest rate
• n = Number of installments

**Example:**
Loan: ₹10,00,000
Rate: 10% p.a.
Tenure: 20 years

Monthly Rate = 10/12/100 = 0.0083
EMI = ₹9,650 approx

**Tips:**
• Lower interest rate = Lower EMI
• Longer tenure = Lower EMI but higher interest
• Pre-payment reduces total interest
• Compare rates before applying`
    },
    
    tips: {
        keywords: ['tips', 'advice', 'suggestions', 'help'],
        response: `Tips to Increase Loan Approval Chances:

**1. Documentation:**
✓ Keep all documents ready
✓ Provide accurate information
✓ Maintain consistent employment

**2. Financial Health:**
✓ Maintain 650+ CIBIL score
✓ Keep debt-to-income below 50%
✓ Avoid multiple loan applications

**3. Application Tips:**
✓ Apply for right loan amount
✓ Choose appropriate tenure
✓ Match eligibility criteria
✓ Apply with correct employer type

**4. Before Applying:**
✓ Check eligibility online
✓ Improve CIBIL score first
✓ Reduce existing debts
✓ Compare multiple lenders

**5. Common Mistakes to Avoid:**
✗ Don't hide existing loans
✗ Don't provide false information
✗ Don't apply to multiple banks at once
✗ Don't ignore existing EMI obligations`
    },
    
    documents: {
        keywords: ['document', 'required', 'documents', 'papers'],
        response: `Required Documents for Loan Application:

**For Salaried Individuals:**
• Identity Proof (Aadhaar/PAN/Voter ID)
• Address Proof (Utility bill/Rent agreement)
• Income Proof (Salary slips - 3 months)
• Bank Statements (6 months)
• Form 16/ITR
• Passport size photos

**For Self-Employed:**
• Business registration proof
• ITR returns (2-3 years)
• Profit & Loss statements
• Bank statements (12 months)
• Qualifying certificates
• Education certificates

**Property Documents (for Home Loan):**
• Title deed
• Sale agreement
• Encumbrance certificate
• Property tax receipts

**Pro Tips:**
✓ Keep documents organized
✓ Make multiple copies
✓ Ensure documents are current`
    },
    
    'interest-rates': {
        keywords: ['interest', 'rate', 'rates', 'roi'],
        response: `Current Interest Rates Overview:

**Home Loans:**
• SBI: 8.50% - 9.15%
• HDFC: 8.60% - 9.25%
• ICICI: 8.75% - 9.30%
• Bank of Baroda: 8.40% - 9.15%

**Personal Loans:**
• HDFC: 10.50% - 19.00%
• ICICI: 10.75% - 19.00%
• Axis: 10.49% - 22.00%
• SBI: 11.00% - 14.50%

**Car Loans:**
• SBI: 8.65% - 9.15%
• HDFC: 8.75% - 12.00%
• Axis: 9.00% - 12.50%

**Factors Affecting Your Rate:**
1. CIBIL score (higher = better rate)
2. Employment type
3. Loan amount
4. Tenure
5. Relationship with bank

**Tip:** Negotiate for better rates if you have good CIBIL!`
    },
    
    'eligibility-criteria': {
        keywords: ['eligibility', 'eligible', 'criteria', 'qualify'],
        response: `General Loan Eligibility Criteria:

**Age Requirements:**
• Minimum: 21 years
• Maximum: 60-65 years (varies by employment)

**Income Requirements:**
• Minimum: ₹15,000-25,000/month (varies by loan type)

**CIBIL Score:**
• Minimum: 650-700 (varies by lender)
• Better score = Higher approval chances

**Employment:**
• Salaried: Min 2-3 years experience
• Self-employed: Min 3-5 years business vintage

**Other Factors:**
✓ Indian resident
✓ Stable income source
✓ Valid documents
✓ Good credit history

**Calculation Method:**
Banks typically offer 60-75x of monthly income for personal loans. For home loans, they offer 60-80% of property value.`
    },
    
    default: {
        keywords: [],
        response: `I'm here to help you with loan-related questions! I can answer:

• What is CIBIL score?
• How to improve loan eligibility?
• Difference between government and private bank loans?
• EMI calculation explanation
• Tips to increase approval chances
• Required documents
• Current interest rates
• Eligibility criteria

Feel free to ask any question about loans, eligibility, or the application process!`
    }
};

/**
 * Get AI response for user message
 * Uses OpenAI if available, otherwise falls back to rule-based responses
 * 
 * @param {string} message - User's message
 * @returns {string} AI response
 */
const getAIResponse = async (message) => {
    const lowerMessage = message.toLowerCase();

    // Try OpenAI first if available
    if (openai) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful loan eligibility assistant. Provide accurate, helpful information about loans, CIBIL scores, EMI calculations, and financial advice. Be concise but informative."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.log('OpenAI API error, falling back to rule-based:', error.message);
        }
    }

    // Fallback to rule-based responses
    // Find matching category
    for (const [category, data] of Object.entries(ruleBasedResponses)) {
        if (category === 'default') continue;
        
        const hasKeyword = data.keywords.some(keyword => 
            lowerMessage.includes(keyword)
        );
        
        if (hasKeyword) {
            return data.response;
        }
    }

    // Return default response if no match
    return ruleBasedResponses.default.response;
};

/**
 * Get suggested questions for quick answers
 * 
 * @returns {Array} Array of suggested questions
 */
const getSuggestedQuestions = () => {
    return [
        'What is CIBIL score?',
        'How to improve loan eligibility?',
        'Difference between government and private bank loans?',
        'EMI calculation explanation',
        'Tips to increase approval chances',
        'What documents are required for loan?',
        'Current interest rates for loans?',
        'What are the eligibility criteria for loans?'
    ];
};

module.exports = {
    getAIResponse,
    getSuggestedQuestions,
    ruleBasedResponses
};
