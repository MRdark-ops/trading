import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { CheckCircle, Clock } from 'lucide-react';
import './Withdrawals.css';

function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/admin/withdrawals');
      setWithdrawals(res.data.withdrawals || []);
      // Calculate stats from fetched data if not provided by backend
      const total = res.data.withdrawals.reduce((acc, w) => acc + parseFloat(w.amount), 0);
      const completed = res.data.withdrawals
        .filter(w => w.status === 'Paid' || w.status === 'Completed')
        .reduce((acc, w) => acc + parseFloat(w.amount), 0);
      const pending = res.data.withdrawals
        .filter(w => w.status === 'Pending' || w.status === 'Progress')
        .reduce((acc, w) => acc + parseFloat(w.amount), 0);

      setStats({ total, completed, pending });
    } catch (err) {
      console.error('Failed to fetch withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (withdrawalId, newStatus) => {
    try {
      await api.patch(`/admin/withdrawals/${withdrawalId}/status`, { status: newStatus });
      // Refresh list
      fetchWithdrawals();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="page withdrawals-page">
      <header className="page-header">
        <div>
          <h1>Withdrawal Management</h1>
          <p>Monitor all user withdrawal requests</p>
        </div>
      </header>

      <div className="withdrawals-stats">
        <div className="stat-box">
          <h3>Total Withdrawals</h3>
          <p className="stat-value">${stats.total.toFixed(2)}</p>
        </div>
        <div className="stat-box completed">
          <h3>Completed</h3>
          <p className="stat-value">${stats.completed.toFixed(2)}</p>
        </div>
        <div className="stat-box pending">
          <h3>Pending</h3>
          <p className="stat-value">${stats.pending.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading withdrawals...</div>
      ) : (
        <div className="withdrawals-table">
          <div className="table-header">
            <div className="col-user">User</div>
            <div className="col-amount">Amount</div>
            <div className="col-method">Wallet</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Actions</div>
            <div className="col-request">Request Date</div>
          </div>
          {withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="table-row">
              <div className="col-user">
                <div className="user-name">{withdrawal.User?.fullName || 'Unknown'}</div>
                <div className="user-email">{withdrawal.User?.email}</div>
              </div>
              <div className="col-amount">${withdrawal.amount}</div>
              <div className="col-method" title={withdrawal.walletAddress}>
                {withdrawal.walletAddress ? `${withdrawal.walletAddress.substring(0, 8)}...` : 'N/A'}
                <button 
                  className="copy-small"
                  onClick={() => navigator.clipboard.writeText(withdrawal.walletAddress)}
                >
                  📋
                </button>
              </div>
              <div className="col-status">
                <span className={`status-badge ${withdrawal.status.toLowerCase()}`}>
                  {withdrawal.status}
                </span>
              </div>
              <div className="col-actions">
                <select 
                  value={withdrawal.status} 
                  onChange={(e) => handleStatusUpdate(withdrawal.id, e.target.value)}
                  className="status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Progress">Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                  <option value="Paid">Paid</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="col-request">
                {new Date(withdrawal.requestedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Withdrawals;
