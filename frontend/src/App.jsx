import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Payments from './pages/Payments';
import Referrals from './pages/Referrals';
import Withdrawals from './pages/Withdrawals';
import Commissions from './pages/Commissions';
import Logs from './pages/Logs';
import Login from './pages/Login';
import './App.css';

export const AuthContext = createContext();

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem('adminUser') || 'null'));

  console.log('🎯 App initialized:', { authToken, adminUser });

  const handleLogin = (token, user) => {
    console.log('✅ Login successful:', { token: token?.substring(0, 20) + '...', user });
    setAuthToken(token);
    setAdminUser(user);
    localStorage.setItem('authToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    console.log('🔓 Logout');
    setAuthToken(null);
    setAdminUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
  };

  if (!authToken) {
    console.log('⚠️ No auth token, showing login');
    return <Login onLogin={handleLogin} />;
  }

  console.log('✅ Auth token found, showing dashboard');

  return (
    <AuthContext.Provider value={{ authToken, adminUser, handleLogout }}>
      <Router>
        <div className="app-layout">
          <Sidebar onLogout={handleLogout} admin={adminUser} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:userId" element={<UserDetail />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/withdrawals" element={<Withdrawals />} />
              <Route path="/commissions" element={<Commissions />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
