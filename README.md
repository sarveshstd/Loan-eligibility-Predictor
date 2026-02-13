# AI Loan Eligibility Checker with Smart Assistant

A full-stack modern web application for checking loan eligibility with an AI-powered smart assistant.

## 🚀 Features

- **User Authentication**: Secure login/signup with JWT tokens and password hashing
- **Loan Eligibility Checker**: Smart algorithm based on Indian banking standards
- **AI Smart Assistant**: Conversational chatbot to answer loan-related queries
- **EMI Calculator**: Calculate monthly EMI for different loan types
- **Dark Theme UI**: Modern glassmorphism design with neon blue highlights

## 🛠 Tech Stack

### Frontend
- React.js 18
- Tailwind CSS 3
- React Router DOM 6
- Axios for API calls

### Backend
- Node.js 18+
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- cors for cross-origin requests
- dotenv for environment variables

## 📁 Project Structure

```
loan-eligibility-checker/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── utils/
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                 # Node.js Backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── .env.example
├── README.md
└── package.json
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd loan-eligibility-checker
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Setup

1. **Copy the example environment file**
   ```bash
   cp .env.example server/.env
   ```

2. **Configure backend environment variables**
   
   Open `server/.env` and update with your MongoDB Atlas connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/loan-checker?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the frontend (in new terminal)**
   ```bash
   cd client
   npm start
   ```
   Frontend will run on http://localhost:3000

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Loan Eligibility
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/loan/check` | Check loan eligibility |
| GET | `/api/loan/types` | Get loan types |

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Send message to AI assistant |

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration

## 💡 Loan Eligibility Logic

The eligibility check considers:
- **CIBIL Score**: 750+ (High), 650-749 (Moderate), <650 (Low)
- **Employment Type**: Government (highest), Private (medium), Self-employed (strict)
- **Debt-to-Income Ratio**: EMI should not exceed 50% of monthly income
- **Age Limits**: 21-60 (private), 21-65 (government)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 UI Features

- Glassmorphism cards with blur effects
- Animated gradient backgrounds
- Floating particles animation
- Smooth transitions and hover effects
- Neon blue accent colors
- Dark theme throughout

## License

MIT License - feel free to use this project for learning and development.

## Author

Created with ❤️ using React.js and Node.js
