import React, { useState, useEffect, createContext, useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom'
import api from './api/client'

// Pages
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Referrals from './pages/Referrals'
import Payment from './pages/Payment'
import SubscriptionPayment from './pages/SubscriptionPayment'
import Withdrawal from './pages/Withdrawal'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import './App.css'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function AppContent () {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requiresSubscription, setRequiresSubscription] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      const userData = JSON.parse(storedUser)
      setIsAuthenticated(true)
      setUser(userData)

      // Check subscription status
      checkSubscriptionStatus(userData)

      // Redirect admins to admin dashboard
      if (userData.role === 'admin' || userData.isAdmin) {
        window.location.href = 'http://localhost:5173/'
      }
    }
    setLoading(false)
  }, [navigate])

  const checkSubscriptionStatus = async (userData) => {
    try {
      const res = await api.get('/subscription/status')
      if (res.data.subscription && res.data.subscription.requiresPayment) {
        setRequiresSubscription(true)
        // Redirect to subscription payment
        setTimeout(() => {
          navigate('/subscription-payment')
        }, 500)
      }
    } catch (err) {
      console.error('Error checking subscription status:', err)
    }
  }

  const handleLogin = (token, userData) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)

    // Redirect admins to admin dashboard
    if (userData.role === 'admin' || userData.isAdmin) {
      console.log('Admin detected, redirecting to admin dashboard...')
      setTimeout(() => {
        window.location.href = 'http://localhost:5173/'
      }, 500)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-dark'>
        <div className='text-gold text-xl'>جاري التحميل...</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, handleLogin, handleLogout }}
    >
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<Privacy />} />

        {/* Subscription Payment - Can be accessed without full authentication */}
        <Route path='/subscription-payment' element={<SubscriptionPayment />} />

        {/* Protected Routes */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/referrals'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Referrals />
            </ProtectedRoute>
          }
        />
        <Route
          path='/payment'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path='/withdrawal'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Withdrawal />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      {!isAuthenticated && <Footer />}
    </AuthContext.Provider>
  )
}

function App () {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
