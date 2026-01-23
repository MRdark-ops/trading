import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Home, Users, CreditCard, Share2, Wallet, Zap, FileText } from 'lucide-react';
import { AuthContext } from '../App';
import './Sidebar.css';

function Sidebar({ onLogout, admin }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">Trading Admin</h1>
        <p className="tagline">Gold Trading DZ VIP</p>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/users"
          className={`nav-item ${isActive('/users') ? 'active' : ''}`}
        >
          <Users size={20} />
          <span>Users</span>
        </Link>

        <Link
          to="/payments"
          className={`nav-item ${isActive('/payments') ? 'active' : ''}`}
        >
          <CreditCard size={20} />
          <span>Payments</span>
        </Link>

        <Link
          to="/referrals"
          className={`nav-item ${isActive('/referrals') ? 'active' : ''}`}
        >
          <Share2 size={20} />
          <span>Referrals</span>
        </Link>

        <Link
          to="/withdrawals"
          className={`nav-item ${isActive('/withdrawals') ? 'active' : ''}`}
        >
          <Wallet size={20} />
          <span>Withdrawals</span>
        </Link>

        <Link
          to="/commissions"
          className={`nav-item ${isActive('/commissions') ? 'active' : ''}`}
        >
          <Zap size={20} />
          <span>Commissions</span>
        </Link>

        <Link
          to="/logs"
          className={`nav-item ${isActive('/logs') ? 'active' : ''}`}
        >
          <FileText size={20} />
          <span>Activity Logs</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="admin-info">
          <p className="admin-name">{admin?.fullName || 'Admin'}</p>
          <p className="admin-email">{admin?.email}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
