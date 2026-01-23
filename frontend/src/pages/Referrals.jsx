import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, CheckCircle, DollarSign } from 'lucide-react';
import './Referrals.css';
import client from '../api/client';

function Referrals() {
  const [referrals, setReferrals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const response = await client.get('/referrals/user/1');
        setReferrals(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load referrals');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  if (loading) {
    return <div className="page loading">Loading...</div>;
  }

  if (error) {
    return <div className="page error">Error: {error}</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Referral Management</h1>
        <p>Manage your referral program and track earnings</p>
      </div>

      {referrals && (
        <>
          <div className="referral-stats">
            <div className="stat-box direct">
              <div className="stat-icon">
                <Users size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Direct Referrals</p>
                <p className="stat-value">{referrals.statistics?.directReferrals || 0}</p>
              </div>
            </div>

            <div className="stat-box total">
              <div className="stat-icon">
                <TrendingUp size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Referrals</p>
                <p className="stat-value">{referrals.statistics?.totalReferrals || 0}</p>
              </div>
            </div>

            <div className="stat-box active">
              <div className="stat-icon">
                <CheckCircle size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Active Referrals</p>
                <p className="stat-value">{referrals.statistics?.activeReferrals || 0}</p>
              </div>
            </div>

            <div className="stat-box earnings">
              <div className="stat-icon">
                <DollarSign size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Earnings</p>
                <p className="stat-value">${referrals.statistics?.totalEarningsFromReferrals?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="referrals-section">
            <h2>Referred Users</h2>
            <div className="referrals-table">
              <div className="table-header">
                <div className="col-name">Name</div>
                <div className="col-email">Email</div>
                <div className="col-level">Level</div>
                <div className="col-status">Status</div>
                <div className="col-date">Join Date</div>
                <div className="col-commission">Commission</div>
              </div>

              {referrals.referralList && referrals.referralList.length > 0 ? (
                referrals.referralList.map((referral, index) => (
                  <div key={index} className="table-row">
                    <div className="col-name">{referral.referredUserName || 'N/A'}</div>
                    <div className="col-email">{referral.referredUserEmail || 'N/A'}</div>
                    <div className="col-level">
                      <span className="level-badge">Level {referral.level || 1}</span>
                    </div>
                    <div className="col-status">
                      <span className={`status-badge ${referral.status?.toLowerCase() || 'active'}`}>
                        {referral.status || 'Active'}
                      </span>
                    </div>
                    <div className="col-date">{referral.createdAt || 'N/A'}</div>
                    <div className="col-commission">${referral.commission?.toLocaleString() || 0}</div>
                  </div>
                ))
              ) : (
                <div className="table-row empty">
                  <div className="empty-message">No referrals yet</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Referrals;
