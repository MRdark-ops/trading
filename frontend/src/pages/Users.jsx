import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Eye, Trash2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.users || []);
      setStats({ total: res.data.total, active: res.data.users?.filter(u => u.status === 'Active').length || 0 });
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page users-page">
      <header className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage and monitor all platform users</p>
        </div>
      </header>

      <div className="users-stats">
        <div className="stat-box">
          <h3>Total Users</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-box">
          <h3>Active Users</h3>
          <p className="stat-value">{stats.active}</p>
        </div>
        <div className="stat-box">
          <h3>Inactive Users</h3>
          <p className="stat-value">{stats.total - stats.active}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table">
          <div className="table-header">
            <div className="col-name">Name</div>
            <div className="col-email">Email</div>
            <div className="col-status">Status</div>
            <div className="col-balance">Balance</div>
            <div className="col-referrals">Referrals</div>
            <div className="col-join">Join Date</div>
            <div className="col-actions">Actions</div>
          </div>
          {users.map((user) => (
            <div key={user.id} className="table-row">
              <div className="col-name">{user.name}</div>
              <div className="col-email">{user.email}</div>
              <div className="col-status">
                <span className={`status-badge ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </div>
              <div className="col-balance">${user.balance}</div>
              <div className="col-referrals">{user.referrals}</div>
              <div className="col-join">{user.joinDate}</div>
              <div className="col-actions">
                <Link to={`/users/${user.id}`} className="action-btn view" title="View Details">
                  <Eye size={18} />
                </Link>
                <button className="action-btn message" title="Send Message">
                  <MessageSquare size={18} />
                </button>
                <button className="action-btn delete" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
