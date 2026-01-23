import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import api from '../api/client';
import { Mail, Lock } from 'lucide-react';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Sending login request to backend with:', { 
        email: formData.email, 
        passwordLength: formData.password.length 
      });
      
      const res = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Login response received:', res);
      console.log('📊 Response data:', res.data);
      console.log('🔍 Response.data.success:', res.data.success);
      
      if (res.data && res.data.success) {
        console.log('✅ Login successful! Token:', res.data.token);
        console.log('👤 User data:', res.data.user);
        handleLogin(res.data.token, res.data.user);
        setTimeout(() => navigate('/dashboard'), 300);
      } else {
        const errorMsg = res.data?.error || 'Login failed - Invalid response format';
        console.error('❌ Login failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('❌ Login error caught:', err);
      console.error('📋 Error response:', err.response);
      console.error('📝 Error data:', err.response?.data);
      
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Login to Your Account</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
