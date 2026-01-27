import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import api from '../api/client'
import {
  Copy,
  ExternalLink,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Target
} from 'lucide-react'
import WithdrawalButton from './WithdrawalButton'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import './Dashboard.css'

function Dashboard () {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await api.get(`/users/${user.id}`)
      setDashboardData(res.data)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div className='dashboard loading'>Loading your dashboard...</div>
  }

  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`
  const commissionData = [
    {
      level: 1,
      rate: 10,
      target: 10,
      current: dashboardData?.statistics?.directDownline || 0,
      earnings: 25
    },
    { level: 2, rate: 8, target: 100, current: 0, earnings: 200 },
    { level: 3, rate: 6, target: 1000, current: 0, earnings: 1500 },
    { level: 4, rate: 4, target: 10000, current: 0, earnings: 10000 },
    { level: 5, rate: 2, target: 100000, current: 0, earnings: 50000 }
  ]

  return (
    <div className='dashboard'>
      <header className='dashboard-header'>
        <div>
          <h1>Welcome, {user?.fullName || user?.email}</h1>
          <p>Your Affiliate Dashboard</p>
        </div>
        <div className='header-badge'>
          <span
            className={`status-badge ${user?.subscriptionStatus?.toLowerCase()}`}
          >
            {user?.subscriptionStatus || 'Inactive'}
          </span>
        </div>
      </header>

      {/* Subscription Status */}
      <section className='subscription-section'>
        <div className='subscription-card'>
          <div className='subscription-header'>
            <h2>Subscription Status</h2>
            <span
              className={`status-indicator ${user?.subscriptionStatus?.toLowerCase()}`}
            />
          </div>
          <div className='subscription-details'>
            <div className='detail-item'>
              <span className='label'>Status:</span>
              <span className='value'>
                {user?.subscriptionStatus || 'Inactive'}
              </span>
            </div>
            {user?.subscriptionExpiryDate && (
              <div className='detail-item'>
                <span className='label'>Expires:</span>
                <span className='value'>
                  {new Date(user.subscriptionExpiryDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          {user?.subscriptionStatus === 'Active' && (
            <a
              href='https://t.me/powerattack'
              target='_blank'
              rel='noopener noreferrer'
              className='telegram-btn'
            >
              <ExternalLink size={18} />
              Access Telegram Channel
            </a>
          )}
        </div>
      </section>

      {/* Key Metrics */}
      <section className='metrics-section'>
        <div className='metric-card'>
          <div className='metric-icon users'>
            <Users size={24} />
          </div>
          <div className='metric-content'>
            <p className='metric-label'>Direct Referrals</p>
            <h3 className='metric-value'>
              {dashboardData?.statistics?.totalReferrals || 0}
            </h3>
            <p className='metric-subtext'>Active members</p>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-icon earnings'>
            <DollarSign size={24} />
          </div>
          <div className='metric-content'>
            <p className='metric-label'>Total Earnings</p>
            <h3 className='metric-value'>
              ${(user?.totalEarnings || 0).toFixed(2)}
            </h3>
            <p className='metric-subtext'>All commissions</p>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-icon paid'>
            <Zap size={24} />
          </div>
          <div className='metric-content'>
            <p className='metric-label'>Paid Referrals</p>
            <h3 className='metric-value'>
              {dashboardData?.statistics?.paidReferrals || 0}
            </h3>
            <p className='metric-subtext'>Converted members</p>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-icon balance'>
            <TrendingUp size={24} />
          </div>
          <div className='metric-content'>
            <p className='metric-label'>Current Balance</p>
            <h3 className='metric-value'>
              ${(user?.currentBalance || 0).toFixed(2)}
            </h3>
            <p className='metric-subtext'>Available for withdrawal</p>
            <div style={{ marginTop: '15px' }}>
              <WithdrawalButton />
            </div>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className='referral-section'>
        <h2>Your Referral Link</h2>
        <div className='referral-card'>
          <div className='referral-link-box'>
            <input
              type='text'
              value={referralLink}
              readOnly
              className='referral-input'
            />
            <button
              onClick={() => copyToClipboard(referralLink)}
              className='copy-btn'
            >
              <Copy size={18} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className='referral-hint'>
            Share this link to earn commissions from your referrals
          </p>
        </div>
      </section>

      {/* Commission Structure */}
      <section className='commission-section'>
        <h2>Commission Structure</h2>
        <div className='commission-table'>
          <div className='table-header'>
            <div className='col-level'>Level</div>
            <div className='col-target'>Target</div>
            <div className='col-rate'>Commission</div>
            <div className='col-progress'>Progress</div>
            <div className='col-earnings'>Earnings</div>
          </div>
          {commissionData.map((item) => (
            <div key={item.level} className='table-row'>
              <div className='col-level'>
                <div className='level-badge'>Level {item.level}</div>
              </div>
              <div className='col-target'>{item.target.toLocaleString()}</div>
              <div className='col-rate'>{item.rate}%</div>
              <div className='col-progress'>
                <div className='progress-bar'>
                  <div
                    className='progress-fill'
                    style={{
                      width: `${Math.min((item.current / item.target) * 100, 100)}%`
                    }}
                  />
                </div>
                <span className='progress-text'>
                  {item.current}/{item.target}
                </span>
              </div>
              <div className='col-earnings'>
                ${item.earnings.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Earnings Chart */}
      <section className='chart-section'>
        <h2>Your Performance</h2>
        <div className='chart-container'>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={commissionData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#333' />
              <XAxis dataKey='level' stroke='#888' />
              <YAxis stroke='#888' />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1a',
                  border: '1px solid #d4af37'
                }}
                cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
              />
              <Bar dataKey='earnings' fill='#d4af37' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
