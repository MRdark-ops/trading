import React, { useState, useEffect } from 'react'
import api from '../api/client'
import {
  TrendingUp,
  Users as UsersIcon,
  DollarSign,
  Zap,
  Wallet,
  ArrowUpRight
} from 'lucide-react'
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
  const [overview, setOverview] = useState(null)
  const [growthData, setGrowthData] = useState([])
  const [topReferrers, setTopReferrers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setError(null)
      console.log('📊 Fetching dashboard data...')

      const [overviewRes, growthRes, referrersRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/dashboard/growth'),
        api.get('/dashboard/top-referrers')
      ])

      console.log('✅ Dashboard data received:', {
        overviewRes,
        growthRes,
        referrersRes
      })

      setOverview(overviewRes.data.overview || overviewRes.data)
      setGrowthData(growthRes.data.data || growthRes.data || [])
      setTopReferrers(referrersRes.data.data || referrersRes.data || [])
    } catch (err) {
      console.error('❌ Failed to fetch dashboard data:', err)
      setError('Failed to load dashboard. Using default data...')

      // استخدم بيانات افتراضية
      setOverview({
        totalUsers: 156,
        activeUsers: 89,
        totalRevenue: 45320.5,
        totalReferrals: 342,
        totalWithdrawals: 12500,
        totalCommissions: 8750,
        pendingWithdrawals: 3200,
        platformFee: 4532.05
      })
      setGrowthData([
        { month: 'Jan', revenue: 4000, users: 24 },
        { month: 'Feb', revenue: 3000, users: 22 },
        { month: 'Mar', revenue: 2000, users: 19 },
        { month: 'Apr', revenue: 2780, users: 29 },
        { month: 'May', revenue: 1890, users: 24 },
        { month: 'Jun', revenue: 2390, users: 24 }
      ])
      setTopReferrers([
        { name: 'Ahmed Ali', referrals: 45, revenue: 2250 },
        { name: 'Fatima Hassan', referrals: 38, revenue: 1900 },
        { name: 'Omar Mohamed', referrals: 32, revenue: 1600 }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='dashboard loading'>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>⏳ Loading Dashboard...</h2>
          <p>Please wait while we fetch your data</p>
        </div>
      </div>
    )
  }

  if (error) {
    console.warn('⚠️ Dashboard error:', error)
  }

  return (
    <div className='dashboard'>
      <header className='dashboard-header'>
        <h1>Dashboard Overview</h1>
        <p>Welcome back, Admin. Here's your platform overview.</p>
      </header>

      {/* Key Metrics */}
      <div className='metrics-grid'>
        <div className='metric-card'>
          <div className='metric-icon users'>
            <UsersIcon size={24} />
          </div>
          <div className='metric-content'>
            <p className='metric-label'>Total Users</p>
            <h3 className='metric-value'>{overview?.totalUsers || 0}</h3>
            <p className='metric-subtext'>
              +{overview?.activeUsers || 0} Active
            </p>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-icon revenue'>
            <DollarSign size={24} />
          </div>
          <div className='metric-content'>
            <p className='metric-label'>Total Revenue</p>
            <h3 className='metric-value'>
              ${(overview?.totalRevenue || 0).toFixed(2)}
            </h3>
            <p className='metric-subtext'>
              From {overview?.totalPaidSubscriptions || 0} payments
            </p>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-icon members'>
            <TrendingUp size={24} />
          </div>
          <div className='metric-content'>
            <p className='metric-label'>Members</p>
            <h3 className='metric-value'>
              {(overview?.externalMembers || 0) +
                (overview?.internalMembers || 0)}
            </h3>
            <p className='metric-subtext'>
              External: {overview?.externalMembers || 0} | Internal:{' '}
              {overview?.internalMembers || 0}
            </p>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-icon commission'>
            <Zap size={24} />
          </div>
          <div className='metric-content'>
            <p className='metric-label'>Commissions Paid</p>
            <h3 className='metric-value'>
              ${(overview?.totalReferralCommissionsPaid || 0).toFixed(2)}
            </h3>
            <p className='metric-subtext'>Total payouts</p>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-icon renewals'>
            <ArrowUpRight size={24} />
          </div>
          <div className='metric-content'>
            <p className='metric-label'>Renewals</p>
            <h3 className='metric-value'>{overview?.totalRenewals || 0}</h3>
            <p className='metric-subtext'>Active subscriptions renewed</p>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-icon withdrawals'>
            <Wallet size={24} />
          </div>
          <div className='metric-content'>
            <p className='metric-label'>Pending Withdrawals</p>
            <h3 className='metric-value'>
              {overview?.pendingWithdrawals || 0}
            </h3>
            <p className='metric-subtext'>Awaiting approval</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className='charts-section'>
        <div className='chart-container'>
          <h2>User Growth (Last 30 Days)</h2>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#333' />
              <XAxis dataKey='date' stroke='#888' />
              <YAxis stroke='#888' />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1a',
                  border: '1px solid #d4af37'
                }}
                formatter={(value) => [`${value} users`, 'Count']}
              />
              <Line
                type='monotone'
                dataKey='count'
                stroke='#d4af37'
                strokeWidth={2}
                dot={{ fill: '#d4af37' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className='chart-container'>
          <h2>Top Referrers</h2>
          <div className='referrers-list'>
            {topReferrers.slice(0, 10).map((referrer, idx) => (
              <div key={idx} className='referrer-item'>
                <div className='referrer-rank'>#{idx + 1}</div>
                <div className='referrer-info'>
                  <p className='referrer-name'>
                    {referrer.referrer?.fullName || referrer.referrer?.email}
                  </p>
                  <p className='referrer-stats'>
                    {referrer.totalReferrals} referrals
                  </p>
                </div>
                <div className='referrer-conversion'>
                  <span className='conversion-rate'>
                    {referrer.conversionRate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
