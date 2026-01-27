import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { LogOut, Menu, X } from 'lucide-react'
import './Navbar.css'

function Navbar () {
  const { user, handleLogout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogoutClick = () => {
    handleLogout()
    navigate('/login')
  }

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-brand'>
          <h1 className='logo'>Trading DZ</h1>
        </div>

        <div className='navbar-menu'>
          <a href='/dashboard' className='nav-link'>
            📊 لوحتي
          </a>
          <a href='/referrals' className='nav-link'>
            🔗 الإحالات
          </a>
          <a href='/withdrawal' className='nav-link'>
            💰 السحب
          </a>
          {user?.subscriptionStatus === 'Free' ||
          user?.subscriptionStatus === 'Expired'
            ? (
              <a href='/subscription-payment' className='nav-link'>
                💳 الترقية
              </a>
              )
            : null}
        </div>

        <div className='navbar-user'>
          <span className='user-name'>{user?.fullName || user?.email}</span>
          <button onClick={handleLogoutClick} className='logout-btn'>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
