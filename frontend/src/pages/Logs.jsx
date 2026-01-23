import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Activity, LogIn, CreditCard, Download, Share2, Zap, AlertCircle } from 'lucide-react';
import './Logs.css';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/logs');
      setLogs(res.data.logs || []);
      setStats({ total: res.data.total });
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'LOGIN':
        return <LogIn size={18} className="log-icon login" />;
      case 'PAYMENT':
        return <CreditCard size={18} className="log-icon payment" />;
      case 'WITHDRAWAL':
        return <Download size={18} className="log-icon withdrawal" />;
      case 'REFERRAL':
        return <Share2 size={18} className="log-icon referral" />;
      case 'COMMISSION':
        return <Zap size={18} className="log-icon commission" />;
      case 'ADMIN':
        return <AlertCircle size={18} className="log-icon admin" />;
      default:
        return <Activity size={18} className="log-icon" />;
    }
  };

  return (
    <div className="page logs-page">
      <header className="page-header">
        <div>
          <h1>Activity Logs</h1>
          <p>Monitor all platform activities and user actions</p>
        </div>
      </header>

      <div className="logs-stats">
        <div className="stat-box">
          <h3>Total Activities</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading logs...</div>
      ) : (
        <div className="logs-table">
          <div className="table-header">
            <div className="col-time">Timestamp</div>
            <div className="col-user">User</div>
            <div className="col-type">Type</div>
            <div className="col-action">Action</div>
            <div className="col-details">Details</div>
          </div>
          {logs.map((log) => (
            <div key={log.id} className="table-row">
              <div className="col-time">{log.timestamp}</div>
              <div className="col-user">{log.user}</div>
              <div className="col-type">
                <div className="type-wrapper">
                  {getTypeIcon(log.type)}
                  <span className="type-badge">{log.type}</span>
                </div>
              </div>
              <div className="col-action">{log.action}</div>
              <div className="col-details">{log.details}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Logs;
