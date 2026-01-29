import React, { useState, useEffect } from 'react'
import api from '../api/client'
import { Zap } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './Commissions.css'

function Commissions () {
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalEarnings, setTotalEarnings] = useState(0)

  useEffect(() => {
    fetchCommissions()
  }, [])

  const fetchCommissions = async () => {
    try {
      const res = await api.get('/commissions')
      setCommissions(res.data.commissions || [])
      const total = (res.data.commissions || []).reduce(
        (sum, c) => sum + c.earnings,
        0
      )
      setTotalEarnings(total)
    } catch (err) {
      console.error('Failed to fetch commissions:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='page commissions-page'>
      <header className='page-header'>
        <div>
          <h1>Commission Management</h1>
          <p>Track commission structure and earnings by level</p>
        </div>
      </header>

      <div className='commissions-header'>
        <div className='total-earnings'>
          <Zap size={24} className='icon' />
          <div>
            <p>Total Commission Earnings</p>
            <h2>${totalEarnings.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      {loading
        ? (
          <div className='loading'>Loading commissions...</div>
          )
        : (
          <div className='commissions-content'>
            <div className='commission-chart'>
              <h3>Earnings by Commission Level</h3>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={commissions}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='level' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='earnings' fill='#8884d8' name='Earnings ($)' />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className='commission-table'>
              <h3>Commission Structure</h3>
              <div className='table-header'>
                <div className='col-level'>Level</div>
                <div className='col-rate'>Rate</div>
                <div className='col-earnings'>Total Earnings</div>
                <div className='col-description'>Description</div>
              </div>
              {commissions.map((commission) => (
                <div key={commission.level} className='table-row'>
                  <div className='col-level'>
                    <span className='level-badge'>Level {commission.level}</span>
                  </div>
                  <div className='col-rate'>
                    <span className='rate-badge'>{commission.rate}</span>
                  </div>
                  <div className='col-earnings'>
                    <strong>${commission.earnings.toFixed(2)}</strong>
                  </div>
                  <div className='col-description'>
                    {commission.level === 1
                      ? 'Direct referrals'
                      : `Referrals of Level ${commission.level - 1}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
    </div>
  )
}

export default Commissions
