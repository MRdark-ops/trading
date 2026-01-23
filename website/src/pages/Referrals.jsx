import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import api from '../api/client';
import { Copy, Share2, TrendingUp, Users } from 'lucide-react';
import './Referrals.css';

function Referrals() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    directReferrals: 0,
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarningsFromReferrals: 0
  });

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await api.get(`/referrals/user/${user.id}`);
      setReferrals(res.data.referrals || []);
      setStats(res.data.statistics || {});
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareMessage = `انضم إلى منصة التداول الذهبية الرائدة في الجزائر! 🚀\n\nاستثمر في الذهب والمعادن الثمينة بأمان وسهولة. احصل على عائد رائع على استثماراتك!\n\nانضم الآن عبر رابط الإحالة الخاص بي: ${referralLink}\n\n#تداول_ذهب #استثمار_ذهب #الجزائر`;

  const shareOnTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="referrals-page">
      <header className="referrals-header">
        <div>
          <h1>Referral Program</h1>
          <p>Manage your affiliates and track earnings</p>
        </div>
      </header>

      {/* Referral Link */}
      <section className="referral-link-section">
        <h2>Your Referral Link</h2>
        <div className="link-card">
          <div className="link-display">
            <input type="text" value={referralLink} readOnly className="link-input" />
            <button 
              onClick={() => copyToClipboard(referralLink)} 
              className="copy-btn"
              title="Copy referral link"
            >
              <Copy size={18} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="link-hint">Share this unique link with your friends and earn commissions</p>

          <div className="share-buttons">
            <button onClick={shareOnTelegram} className="share-btn telegram">
              <span>Share on Telegram</span>
            </button>
            <button onClick={shareOnWhatsApp} className="share-btn whatsapp">
              <span>Share on WhatsApp</span>
            </button>
            <button onClick={shareOnTwitter} className="share-btn twitter">
              <span>Share on Twitter</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p>Direct Referrals</p>
            <h3>{stats.directReferrals || 0}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p>Active Referrals</p>
            <h3>{stats.activeReferrals || 0}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p>Total Referrals (All Levels)</p>
            <h3>{stats.totalReferrals || 0}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Share2 size={24} />
          </div>
          <div className="stat-content">
            <p>Earnings from Referrals</p>
            <h3>${(stats.totalEarningsFromReferrals || 0).toFixed(2)}</h3>
          </div>
        </div>
      </section>

      {/* Referrals List */}
      <section className="referrals-list-section">
        <h2>Your Referrals</h2>
        
        {loading ? (
          <div className="loading">Loading referrals...</div>
        ) : referrals.length === 0 ? (
          <div className="empty-state">
            <Share2 size={48} />
            <h3>No Referrals Yet</h3>
            <p>Start sharing your referral link to earn commissions!</p>
          </div>
        ) : (
          <div className="referrals-table">
            <div className="table-header">
              <div className="col-name">Name</div>
              <div className="col-email">Email</div>
              <div className="col-level">Level</div>
              <div className="col-status">Status</div>
              <div className="col-date">Joined</div>
              <div className="col-earnings">Earnings</div>
            </div>
            {referrals.map((ref) => (
              <div key={ref.id} className="table-row">
                <div className="col-name">{ref.referredUserName || 'N/A'}</div>
                <div className="col-email">{ref.referredUserEmail}</div>
                <div className="col-level">
                  <span className="level-badge">Level {ref.level}</span>
                </div>
                <div className="col-status">
                  <span className={`status-badge ${ref.status?.toLowerCase() || 'pending'}`}>
                    {ref.status || 'Pending'}
                  </span>
                </div>
                <div className="col-date">{new Date(ref.createdAt).toLocaleDateString()}</div>
                <div className="col-earnings">${(ref.commission || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Referral Tree */}
      <section className="referral-tree-section">
        <h2>Referral Hierarchy</h2>
        <div className="tree-card">
          <div className="tree-item level-1">
            <div className="tree-node">
              <h4>You</h4>
              <p>{user?.fullName || user?.email}</p>
            </div>
          </div>
          <div className="tree-divider"></div>
          <div className="tree-item level-2">
            <h4>Level 1 - Direct Referrals</h4>
            <p className="tree-count">{stats.directReferrals || 0} members</p>
          </div>
          <div className="tree-item level-3">
            <h4>Level 2-5 - Indirect Referrals</h4>
            <p className="tree-count">{(stats.totalReferrals || 0) - (stats.directReferrals || 0)} members</p>
          </div>
        </div>
      </section>

      {/* Commission Info */}
      <section className="commission-info">
        <h2>How Commissions Work</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Level 1</h3>
            <p className="rate">10% Commission</p>
            <p className="description">Direct referrals</p>
          </div>
          <div className="info-card">
            <h3>Level 2</h3>
            <p className="rate">8% Commission</p>
            <p className="description">Referrals of Level 1</p>
          </div>
          <div className="info-card">
            <h3>Level 3</h3>
            <p className="rate">6% Commission</p>
            <p className="description">Referrals of Level 2</p>
          </div>
          <div className="info-card">
            <h3>Level 4</h3>
            <p className="rate">4% Commission</p>
            <p className="description">Referrals of Level 3</p>
          </div>
          <div className="info-card">
            <h3>Level 5</h3>
            <p className="rate">2% Commission</p>
            <p className="description">Referrals of Level 4</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Referrals;
