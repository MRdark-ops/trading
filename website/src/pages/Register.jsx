import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import api from '../api/client'
import { Mail, Lock, User, Phone, Globe } from 'lucide-react'
import './Auth.css'

function Register () {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    country: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions')
      setLoading(false)
      return
    }

    try {
      console.log('Submitting registration with data:', {
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        password: '***'
      })

      const res = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        country: formData.country
      })

      console.log('Registration response:', res.data)

      // Auto login after registration
      if (res.data.token && res.data.user) {
        console.log('✅ Auto-logging in after registration')
        handleLogin(res.data.token, res.data.user)
        navigate('/payment')
      } else {
        setError('Registration successful but missing token/user data')
      }
    } catch (err) {
      console.error('Registration error:', err)
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Registration failed'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <div className='auth-box'>
          <h1 className='auth-title'>Create Account</h1>
          <p className='auth-subtitle'>Join Trading DZ Community</p>

          {error && <div className='auth-error'>{error}</div>}

          <form onSubmit={handleSubmit} className='auth-form'>
            <div className='form-group'>
              <label>Full Name</label>
              <div className='input-wrapper'>
                <User size={18} />
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder='Your full name'
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className='form-group'>
              <label>Email Address</label>
              <div className='input-wrapper'>
                <Mail size={18} />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='your@email.com'
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className='form-group'>
              <label>Phone Number</label>
              <div className='input-wrapper'>
                <Phone size={18} />
                <input
                  type='tel'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder='+1234567890'
                  disabled={loading}
                />
              </div>
            </div>

            <div className='form-group'>
              <label>Country</label>
              <div className='input-wrapper'>
                <Globe size={18} />
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={handleChange}
                  placeholder='Your country'
                  disabled={loading}
                />
              </div>
            </div>

            <div className='form-group'>
              <label>Password</label>
              <div className='input-wrapper'>
                <Lock size={18} />
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='••••••••'
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className='form-group'>
              <label>Confirm Password</label>
              <div className='input-wrapper'>
                <Lock size={18} />
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='••••••••'
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className='form-checkbox'>
              <input
                type='checkbox'
                id='terms'
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor='terms'>
                I agree to the <a href='/terms'>Terms and Conditions</a> and{' '}
                <a href='/privacy'>Privacy Policy</a>
              </label>
            </div>

            <button type='submit' className='auth-btn' disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className='auth-footer'>
            Already have an account? <a href='/login'>Login here</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
