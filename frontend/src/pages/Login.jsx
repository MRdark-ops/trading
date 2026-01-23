import React, { useState } from 'react';
import api from '../api/client';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@tradingdz.com');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAccountClick = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    
    // Copy to clipboard
    const text = `Email: ${account.email}\nPassword: ${account.password}`;
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Admin login attempt:', { email });
      
      const res = await api.post('/auth/login', { 
        email, 
        password
      });

      console.log('✅ Login response:', res.data);

      if (res.data.success && res.data.token && res.data.user) {
        // Check if user is admin
        if (res.data.user.role !== 'admin' && !res.data.user.isAdmin) {
          setError('❌ Access denied - Admin accounts only');
          setLoading(false);
          return;
        }

        console.log('🎉 Login successful for:', res.data.user.email);
        onLogin(res.data.token, res.data.user);
      } else {
        setError('❌ Invalid response from server');
      }
    } catch (err) {
      console.error('❌ Login error details:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      
      let errorMsg = 'Login failed';
      
      if (err.message === 'Network Error') {
        errorMsg = '❌ Network Error - Backend server not responding. Make sure backend is running on port 5001';
      } else if (err.response?.status === 401) {
        errorMsg = '❌ Invalid email or password';
      } else if (err.response?.status === 403) {
        errorMsg = '❌ Access denied - Admin accounts only';
      } else if (err.response?.data?.error) {
        errorMsg = '❌ ' + err.response.data.error;
      } else if (err.message) {
        errorMsg = '❌ ' + err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const adminAccounts = [
    {
      email: 'admin@tradingdz.com',
      password: 'admin123456',
      name: 'مسؤول الموقع',
      permissions: 'صلاحيات كاملة'
    },
    {
      email: 'support@tradingdz.com',
      password: 'support1234',
      name: 'فريق الدعم',
      permissions: 'المستخدمون والدعم'
    },
    {
      email: 'manager@tradingdz.com',
      password: 'manager1234',
      name: 'مدير النظام',
      permissions: 'المدفوعات والسحب'
    }
  ];

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1 className="login-title">⚙️ Trading Admin</h1>
            <p className="login-subtitle">Gold Trading DZ VIP - لوحة التحكم</p>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">📧 البريد الإلكتروني (Email)</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tradingdz.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                🔐 كلمة المرور (Password)
                <span style={{ marginLeft: '8px', cursor: 'pointer' }} 
                      onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? '⏳ جاري التحميل...' : '✅ دخول (Sign In)'}
            </button>
          </form>

          <div className="login-info">
            <h3>🔒 حسابات الاختبار (Test Admin Accounts)</h3>
            <div className="accounts-list">
              {adminAccounts.map((account, idx) => (
                <div 
                  key={idx} 
                  className="account-card"
                  onClick={() => handleAccountClick(account)}
                  title="انقر لنسخ البيانات"
                >
                  <div className="account-header">
                    <strong>{account.name}</strong>
                    <span className="permissions-badge">{account.permissions}</span>
                  </div>
                  <div className="account-details">
                    <p><strong>البريد:</strong> {account.email}</p>
                    <p><strong>كلمة المرور:</strong> {account.password}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '12px', color: '#d4af37', fontSize: '11px', textAlign: 'center' }}>
              💡 اضغط على أي حساب أعلاه لنسخ البيانات تلقائياً
            </p>
          </div>

          <p className="login-footer">
            🛡️ الوصول الآمن للإداريين فقط. يُحظر الوصول غير المصرح
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
