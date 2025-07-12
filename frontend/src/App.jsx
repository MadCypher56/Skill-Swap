import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/Register'
import Profile from './pages/Profile';
import Browse from './pages/Browse';
import SwapDashboard from './pages/SwapDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import SkillMarketplace from './pages/SkillMarketplace';
import LearningHub from './pages/LearningHub';
import PrivateLearning from './pages/PrivateLearning';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Navbar />
        <div className="p-4 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/browse" element={
              <ProtectedRoute>
                <Browse />
              </ProtectedRoute>
            } />
            <Route path="/swap" element={
              <ProtectedRoute>
                <SwapDashboard />
              </ProtectedRoute>
            } />
            <Route path="/marketplace" element={
              <ProtectedRoute>
                <SkillMarketplace />
              </ProtectedRoute>
            } />
            <Route path="/learning" element={
              <ProtectedRoute>
                <LearningHub />
              </ProtectedRoute>
            } />
            <Route path="/private-learning" element={
              <ProtectedRoute>
                <PrivateLearning />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
