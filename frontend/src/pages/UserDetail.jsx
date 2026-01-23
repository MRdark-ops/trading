import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import './UserDetail.css';

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [payments, setPayments] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const res = await api.get(`/users/${userId}`);
      setUser(res.data.user);
      setStatistics(res.data.statistics);
      setPayments(res.data.payments);
      setReferrals(res.data.referrals);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSendingMessage(true);
    try {
      await api.post(`/users/${userId}/message`, { message });
      setMessage('');
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 3000);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page">
        <h1>User Not Found</h1>
        <Link to="/users" className="back-link">
          <ArrowLeft size={18} />
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="page user-detail-page">
      <header className="page-header">
        <div>
          <Link to="/users" className="back-link">
            <ArrowLeft size={18} />
            Back to Users
          </Link>
          <h1>{user.name}'s Details</h1>
          <p>View and manage user information</p>
        </div>
      </header>

      <div className="user-detail-content">
        <div className="user-info-section">
          <div className="user-basic-info">
            <div className="info-card">
              <h3>Basic Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name:</label>
                  <span>{user.name}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="info-item">
                  <label>Phone:</label>
                  <span>{user.phone || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <label>Status:</label>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </div>
                <div className="info-item">
                  <label>User Type:</label>
                  <span>{user.userType}</span>
                </div>
                <div className="info-item">
                  <label>Subscription Status:</label>
                  <span>{user.subscriptionStatus}</span>
                </div>
                <div className="info-item">
                  <label>Registration Date:</label>
                  <span>{new Date(user.registrationDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <label>Balance:</label>
                  <span>${user.currentBalance}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="user-statistics">
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Payments</h4>
                <p className="stat-value">{statistics.totalPayments}</p>
              </div>
              <div className="stat-card">
                <h4>Total Referrals</h4>
                <p className="stat-value">{statistics.totalReferrals}</p>
              </div>
              <div className="stat-card">
                <h4>Paid Referrals</h4>
                <p className="stat-value">{statistics.paidReferrals}</p>
              </div>
              <div className="stat-card">
                <h4>Estimated Earnings</h4>
                <p className="stat-value">${statistics.estimatedEarnings}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="user-communication-section">
          <div className="communication-card">
            <h3>
              <Mail size={20} />
              Send Message
            </h3>
            <div className="message-form">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to the user..."
                rows={4}
              />
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !message.trim()}
                className="send-message-btn"
              >
                {sendingMessage ? 'Sending...' : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
              {messageSent && (
                <div className="message-sent">Message sent successfully!</div>
              )}
            </div>
          </div>
        </div>

        <div className="user-data-section">
          <div className="data-tabs">
            <button className="tab active">Payments</button>
            <button className="tab">Referrals</button>
          </div>

          <div className="data-content">
            <div className="payments-list">
              <h4>Payment History</h4>
              {payments.length > 0 ? (
                <div className="data-table">
                  <div className="table-header">
                    <div>Date</div>
                    <div>Type</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  {payments.map((payment) => (
                    <div key={payment.id} className="table-row">
                      <div>{new Date(payment.paymentDate).toLocaleDateString()}</div>
                      <div>{payment.type}</div>
                      <div>${payment.amount}</div>
                      <div className={`status-badge ${payment.status.toLowerCase()}`}>
                        {payment.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No payments found.</p>
              )}
            </div>

            <div className="referrals-list" style={{ display: 'none' }}>
              <h4>Referral History</h4>
              {referrals.length > 0 ? (
                <div className="data-table">
                  <div className="table-header">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Payment Status</div>
                    <div>Join Date</div>
                  </div>
                  {referrals.map((referral) => (
                    <div key={referral.id} className="table-row">
                      <div>{referral.name}</div>
                      <div>{referral.email}</div>
                      <div className={`status-badge ${referral.paymentStatus.toLowerCase()}`}>
                        {referral.paymentStatus}
                      </div>
                      <div>{new Date(referral.registrationDate).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No referrals found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
