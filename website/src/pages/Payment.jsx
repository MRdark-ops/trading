import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import api from '../api/client'
import { Zap, AlertCircle, CheckCircle } from 'lucide-react'
import './Payment.css'

function Payment () {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState('binance')
  const [step, setStep] = useState(1)
  const [txId, setTxId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const SUBSCRIPTION_AMOUNT = 250
  const WALLET_ADDRESS = '0x22951c64910503f0825fd15667918c6bf0dce1ed'

  const handleSubmitPayment = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/payments', {
        userId: user.id,
        amount: SUBSCRIPTION_AMOUNT,
        paymentMethod: 'Crypto',
        type: 'First Payment',
        transactionId: txId
      })

      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Payment submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='payment-page'>
      <div className='payment-container'>
        <div className='payment-box'>
          <h1 className='payment-title'>Activate Subscription</h1>
          <p className='payment-subtitle'>Join our exclusive community</p>

          {success && (
            <div className='success-message'>
              <CheckCircle size={24} />
              <h3>Payment Submitted!</h3>
              <p>Your payment has been received. Redirecting to dashboard...</p>
            </div>
          )}

          {!success && (
            <>
              {/* Step Indicator */}
              <div className='step-indicator'>
                <div className={`step ${step === 1 ? 'active' : 'done'}`}>
                  <span>1</span>
                  <p>Payment Details</p>
                </div>
                <div className={`step-line ${step > 1 ? 'active' : ''}`} />
                <div
                  className={`step ${step === 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}
                >
                  <span>2</span>
                  <p>Confirm Payment</p>
                </div>
              </div>

              {/* Step 1: Payment Details */}
              {step === 1 && (
                <div className='step-content'>
                  <div className='payment-info'>
                    <h2>Subscription Fee</h2>
                    <div className='amount-display'>
                      <span className='amount'>${SUBSCRIPTION_AMOUNT}</span>
                      <span className='currency'>USDT</span>
                    </div>
                    <p className='amount-description'>
                      One-time payment for lifetime access
                    </p>
                  </div>

                  <div className='payment-method'>
                    <h3>Payment Method</h3>
                    <div className='method-option selected'>
                      <input
                        type='radio'
                        id='binance'
                        name='method'
                        value='binance'
                        checked={paymentMethod === 'binance'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label htmlFor='binance'>
                        <span className='method-name'>
                          Binance (Recommended)
                        </span>
                        <span className='method-desc'>USDT TRC20 or BEP20</span>
                      </label>
                    </div>
                  </div>

                  <div className='wallet-details'>
                    <h3>Send Payment To:</h3>
                    <div className='wallet-address-box'>
                      <p className='label'>
                        Wallet Address (ERC20/TRC20/BEP20):
                      </p>
                      <div className='address-display'>
                        <code>{WALLET_ADDRESS}</code>
                        <button
                          type='button'
                          onClick={() => {
                            navigator.clipboard.writeText(WALLET_ADDRESS)
                            alert('Address copied!')
                          }}
                          className='copy-address-btn'
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className='amount-to-send'>
                      <p className='label'>Amount to Send:</p>
                      <div className='amount-box'>
                        <span className='amount'>
                          {SUBSCRIPTION_AMOUNT} USDT
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='payment-instructions'>
                    <h4>Instructions:</h4>
                    <ol>
                      <li>
                        Send exactly <strong>{SUBSCRIPTION_AMOUNT} USDT</strong>{' '}
                        to the wallet address above
                      </li>
                      <li>
                        You can use Binance or any other exchange that supports
                        USDT transfers
                      </li>
                      <li>Wait for the transaction to complete</li>
                      <li>
                        Copy your transaction ID (TXID) and submit it in the
                        next step
                      </li>
                    </ol>
                  </div>

                  <button onClick={() => setStep(2)} className='next-btn'>
                    I've Sent the Payment
                  </button>
                </div>
              )}

              {/* Step 2: Confirm Payment */}
              {step === 2 && (
                <div className='step-content'>
                  {error && (
                    <div className='error-message'>
                      <AlertCircle size={20} />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitPayment} className='payment-form'>
                    <div className='form-group'>
                      <label>Transaction ID (TXID)</label>
                      <p className='form-hint'>
                        Enter the transaction hash/ID from your USDT transfer
                      </p>
                      <input
                        type='text'
                        value={txId}
                        onChange={(e) => setTxId(e.target.value)}
                        placeholder='0x... or transaction hash'
                        required
                        disabled={loading}
                        className='form-input'
                      />
                    </div>

                    <div className='confirmation-checklist'>
                      <h4>Please confirm:</h4>
                      <label>
                        <input type='checkbox' required disabled={loading} />I
                        have sent {SUBSCRIPTION_AMOUNT} USDT to the wallet
                        address
                      </label>
                      <label>
                        <input type='checkbox' required disabled={loading} />I
                        have copied the correct transaction ID
                      </label>
                      <label>
                        <input type='checkbox' required disabled={loading} />I
                        agree to the terms and conditions
                      </label>
                    </div>

                    <div className='form-buttons'>
                      <button
                        type='button'
                        onClick={() => setStep(1)}
                        className='back-btn'
                        disabled={loading}
                      >
                        Back
                      </button>
                      <button
                        type='submit'
                        className='submit-btn'
                        disabled={loading}
                      >
                        {loading ? 'Submitting...' : 'Submit Payment'}
                      </button>
                    </div>
                  </form>

                  <div className='payment-note'>
                    <Zap size={16} />
                    <p>
                      Your payment will be verified within 24 hours. You'll
                      receive confirmation via email.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Info Panel */}
        <div className='info-panel'>
          <h3>What You Get</h3>
          <ul className='benefits-list'>
            <li>
              <span className='check'>✓</span>
              <span>Access to exclusive Telegram channel</span>
            </li>
            <li>
              <span className='check'>✓</span>
              <span>Affiliate dashboard</span>
            </li>
            <li>
              <span className='check'>✓</span>
              <span>Referral tracking tools</span>
            </li>
            <li>
              <span className='check'>✓</span>
              <span>Multi-level commissions</span>
            </li>
            <li>
              <span className='check'>✓</span>
              <span>Real-time earnings tracking</span>
            </li>
            <li>
              <span className='check'>✓</span>
              <span>24/7 support</span>
            </li>
          </ul>

          <div className='commission-preview'>
            <h4>Commission Structure</h4>
            <div className='commission-item'>
              <span>Level 1 (1-10):</span>
              <strong>10%</strong>
            </div>
            <div className='commission-item'>
              <span>Level 2 (11-100):</span>
              <strong>8%</strong>
            </div>
            <div className='commission-item'>
              <span>Level 3 (101-1000):</span>
              <strong>6%</strong>
            </div>
            <div className='commission-item'>
              <span>Level 4 (1001-10000):</span>
              <strong>4%</strong>
            </div>
            <div className='commission-item'>
              <span>Level 5 (10001+):</span>
              <strong>2%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
