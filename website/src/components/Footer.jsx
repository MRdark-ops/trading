import React from 'react'
import './Footer.css'

function Footer () {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-section'>
          <h3>Trading DZ</h3>
          <p>Professional Affiliate Marketing Platform</p>
        </div>

        <div className='footer-section'>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href='/'>Home</a>
            </li>
            <li>
              <a href='/terms'>Terms</a>
            </li>
            <li>
              <a href='/privacy'>Privacy</a>
            </li>
          </ul>
        </div>

        <div className='footer-section'>
          <h4>Contact</h4>
          <p>Email: support@tradingdz.com</p>
          <p>Telegram: @tradingdz</p>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>&copy; {currentYear} Trading DZ. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
