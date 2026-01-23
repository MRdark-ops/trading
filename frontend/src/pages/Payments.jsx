import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Check, Clock, X } from 'lucide-react';
import './Payments.css';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0 });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data.payments || []);
      setStats({
        total: res.data.total,
        completed: res.data.completed,
        pending: res.data.pending,
        failed: res.data.failed
      });
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page payments-page">
      <header className="page-header">
        <div>
          <h1>Payments Management</h1>
          <p>Monitor all payment transactions</p>
        </div>
      </header>

      <div className="payments-stats">
        <div className="stat-box">
          <h3>Total Revenue</h3>
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
        <div className="stat-box failed">
          <h3>Failed</h3>
          <p className="stat-value">${stats.failed.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading payments...</div>
      ) : (
        <div className="payments-table">
          <div className="table-header">
            <div className="col-ref">Reference</div>
            <div className="col-user">User</div>
            <div className="col-amount">Amount</div>
            <div className="col-method">Method</div>
            <div className="col-status">Status</div>
            <div className="col-date">Date</div>
          </div>
          {payments.map((payment) => (
            <div key={payment.id} className="table-row">
              <div className="col-ref">{payment.reference}</div>
              <div className="col-user">{payment.userName}</div>
              <div className="col-amount">${payment.amount}</div>
              <div className="col-method">{payment.method}</div>
              <div className="col-status">
                <span className={`status-badge ${payment.status.toLowerCase()}`}>
                  {payment.status}
                </span>
              </div>
              <div className="col-date">{payment.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Payments;
