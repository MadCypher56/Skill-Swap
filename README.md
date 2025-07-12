# Skill Swap Platform

A modern web application that connects people to exchange skills and knowledge through a peer-to-peer learning platform. Users can offer skills they can teach and seek skills they want to learn, creating a collaborative learning community.

## 🚀 Features

### Core Features
- **User Authentication** - Secure login/register with JWT tokens
- **Skill Marketplace** - Post and browse skill offerings/requests
- **Profile Management** - Customize your profile with skills and availability
- **Swap Requests** - Send and manage skill swap requests
- **Learning Sessions** - Create and join live/recorded learning sessions
- **Private Learning** - One-on-one skill exchange sessions
- **Certifications** - Earn endorsements for completed skill swaps
- **Feedback System** - Rate and review other users
- **Admin Dashboard** - Platform management and analytics

### Performance Optimizations
- **API Caching** - 5-minute cache for faster loading
- **Parallel API Calls** - Reduced loading times by 50-70%
- **Skeleton Loading** - Better user experience during loading
- **Error Boundaries** - Graceful error handling
- **Performance Monitoring** - Real-time performance tracking

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/MadCypher56/Skill-Swap.git
cd skill-swap-platform
```

### 2. Database Setup

#### Install PostgreSQL
- **Windows**: Download from [PostgreSQL website](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

#### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE skill_swap_db;

# Exit PostgreSQL
\q
```

### 3. Environment Configuration

#### Backend Environment
Create `.env` file in the `backend` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/skill_swap_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

#### Frontend Environment
Create `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

### 5. Database Migration

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 6. Seed Database (Optional)

```bash
cd backend
node seed.js
```

### 7. Start the Application

#### Start Backend Server
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
skill-swap-platform/
├── backend/
│   ├── controllers/          # API route handlers
│   ├── middleware/           # Authentication & performance middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── prisma/              # Database schema
│   └── server.js            # Express server
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
└── README.md
```

## 🔧 Available Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run db:push    # Push database schema changes
npm run db:generate # Generate Prisma client
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🗄️ Database Schema

### Key Models
- **User** - User profiles and authentication
- **Skill** - Skills offered/wanted by users
- **SkillPost** - Marketplace posts
- **SwapRequest** - Skill swap requests
- **LearningSession** - Learning sessions
- **Feedback** - User ratings and reviews
- **Certification** - Skill endorsements

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Register** - Create a new account
2. **Login** - Get JWT token
3. **Protected Routes** - Require valid JWT token
4. **Token Storage** - Stored in localStorage

## 🚀 Performance Features

### Frontend Optimizations
- **API Caching** - 5-minute cache for GET requests
- **Parallel API Calls** - Multiple requests in parallel
- **Skeleton Loading** - Better loading UX
- **Error Boundaries** - Graceful error handling
- **Code Splitting** - Optimized bundle sizes

### Backend Optimizations
- **Request Logging** - Performance monitoring
- **Response Time Tracking** - API performance metrics
- **Database Indexing** - Optimized queries
- **Connection Pooling** - Efficient database connections

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Monitoring

### Performance Monitoring
- **Frontend**: Console logs for API response times
- **Backend**: Request/response time logging
- **Database**: Query performance tracking

### Error Tracking
- **Frontend**: Error boundaries and console logging
- **Backend**: Detailed error logging with stack traces

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### User Endpoints
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/public-users` - Get public users

### Skill Posts Endpoints
- `GET /skill-posts` - Get all skill posts
- `POST /skill-posts` - Create skill post
- `GET /skill-posts/my-posts` - Get user's posts
- `GET /skill-posts/recommendations` - Get recommendations

### Swap Endpoints
- `GET /swap` - Get swap requests
- `POST /swap/request` - Send swap request
- `POST /swap/respond` - Respond to swap request

### Learning Endpoints
- `GET /learning/sessions` - Get learning sessions
- `POST /learning/sessions` - Create learning session
- `POST /learning/sessions/:id/join` - Join session

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Check database connection
psql -U postgres -d skill_swap_db
```

#### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

#### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### JWT Token Issues
```bash
# Clear localStorage in browser console
localStorage.clear()
```

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Look at the console logs for error messages
3. Check the backend logs for API errors
4. Create an issue on GitHub

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Prisma team for the excellent ORM
- All contributors to this project

---

**Happy Skill Swapping! 🎉**