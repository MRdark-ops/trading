import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import api from '../api/client'
import {
  Send,
  AlertCircle,
  Check,
  Users,
  TrendingUp,
  Wallet,
  Clock,
  Copy,
  X
} from 'lucide-react'
import './Withdrawal.css'

function Withdrawal () {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [withdrawalData, setWithdrawalData] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [copied, setCopied] = useState(false)
  const [previousRequests, setPreviousRequests] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [withdrawalMethod, setWithdrawalMethod] = useState('USDT')
  const [withdrawalNote, setWithdrawalNote] = useState('')

  // Get user referrals and earnings
  useEffect(() => {
    fetchWithdrawalData()
    fetchPreviousRequests()
  }, [])

  const fetchWithdrawalData = async () => {
    try {
      const referralsRes = await api.get('/referrals/user/' + user?.id)
      console.log('Referrals data:', referralsRes.data)

      // حساب الأرباح: عدد الإحالات × 100 دولار
      const referralsCount = referralsRes.data.stats?.totalReferrals || 0
      const totalEarnings = referralsCount * 100 // 100$ لكل إحالة

      setWithdrawalData({
        referralsCount,
        totalEarnings: user?.earnings || referralsCount * 100,
        status: 'Ready to withdraw'
      })

      console.log('✅ Withdrawal Data:', { referralsCount, totalEarnings })
    } catch (err) {
      console.error('❌ Error fetching withdrawal data:', err)
      // استخدم البيانات من user object مباشرة
      setWithdrawalData({
        referralsCount: 3, // مثال
        totalEarnings: user?.earnings || 0,
        status: 'Ready to withdraw'
      })
    }
  }

  const fetchPreviousRequests = async () => {
    try {
      const res = await api.get('/withdrawal/requests')
      if (res.data.success) {
        setPreviousRequests(res.data.withdrawals || [])
      }
    } catch (err) {
      console.error('Error fetching previous requests:', err)
    }
  }

  const handleWithdrawalRequest = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!walletAddress.trim()) {
        setError('الرجاء إدخال عنوان محفظتك')
        setLoading(false)
        return
      }

      if (walletAddress.length < 20) {
        setError('عنوان المحفظة قصير جداً. تحقق من أنك نسخت العنوان الكامل.')
        setLoading(false)
        return
      }

      const res = await api.post('/withdrawal/request', {
        walletAddress,
        amount: withdrawalData?.totalEarnings || 0
      })

      if (res.data.success) {
        setSuccess(
          '✅ تم تقديم طلب السحب بنجاح!\nسيتم مراجعته من قبل فريق الإدارة خلال 24-48 ساعة.'
        )
        setWalletAddress('')
        setTimeout(() => {
          fetchWithdrawalData()
          fetchPreviousRequests()
        }, 1500)
      } else {
        setError(res.data.error || 'حدث خطأ في تقديم الطلب')
      }
    } catch (err) {
      console.error('Withdrawal error:', err)
      setError(err.response?.data?.error || 'حدث خطأ في الطلب. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validation
      if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
        setError('الرجاء إدخال مبلغ صحيح')
        setLoading(false)
        return
      }

      if (parseFloat(withdrawalAmount) > (withdrawalData?.totalEarnings || 0)) {
        setError('المبلغ المطلوب أكبر من الرصيد المتاح')
        setLoading(false)
        return
      }

      if (!walletAddress.trim()) {
        setError('الرجاء إدخال عنوان المحفظة')
        setLoading(false)
        return
      }

      if (walletAddress.length < 20) {
        setError('عنوان المحفظة قصير جداً. تحقق من أنك نسخت العنوان الكامل.')
        setLoading(false)
        return
      }

      // Submit withdrawal request
      const res = await api.post('/withdrawal/request', {
        walletAddress,
        amount: parseFloat(withdrawalAmount),
        method: withdrawalMethod,
        note: withdrawalNote
      })

      if (res.data.success) {
        setSuccess(
          '✅ تم تقديم طلب السحب بنجاح!\nسيتم مراجعته من قبل فريق الإدارة خلال 24-48 ساعة.'
        )
        setShowModal(false)
        setWithdrawalAmount('')
        setWalletAddress('')
        setWithdrawalMethod('USDT')
        setWithdrawalNote('')
        setTimeout(() => {
          fetchWithdrawalData()
          fetchPreviousRequests()
        }, 1500)
      } else {
        setError(res.data.error || 'حدث خطأ في تقديم الطلب')
      }
    } catch (err) {
      console.error('Modal withdrawal error:', err)
      setError(err.response?.data?.error || 'حدث خطأ في الطلب. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { label: '⏳ قيد المراجعة', color: '#FFA500' },
      approved: { label: '✅ موافق عليه', color: '#2ed573' },
      completed: { label: '✔️ مكتمل', color: '#00d4ff' },
      rejected: { label: '❌ مرفوض', color: '#e74c3c' }
    }
    return statuses[status] || { label: 'غير معروف', color: '#888' }
  }

  return (
    <div className='withdrawal-page'>
      <div className='withdrawal-container'>
        {/* Header */}
        <div className='withdrawal-header'>
          <div className='header-content'>
            <h1 className='page-title'>💰 طلب السحب</h1>
            <p className='page-subtitle'>اسحب أرباحك من الإحالات بسهولة</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='stats-grid'>
          {/* Referrals Card */}
          <div className='stat-card referrals-card'>
            <div className='stat-icon'>
              <Users size={32} />
            </div>
            <div className='stat-content'>
              <span className='stat-label'>عدد الإحالات</span>
              <span className='stat-value'>
                {withdrawalData?.referralsCount || 0}
              </span>
              <span className='stat-unit'>شخص أحضرتهم</span>
            </div>
          </div>

          {/* Earnings Card */}
          <div className='stat-card earnings-card'>
            <div className='stat-icon'>
              <TrendingUp size={32} />
            </div>
            <div className='stat-content'>
              <span className='stat-label'>إجمالي الأرباح</span>
              <span className='stat-value'>
                ${withdrawalData?.totalEarnings || 0}
              </span>
              <span className='stat-unit'>USDT</span>
            </div>
          </div>

          {/* Available Balance Card */}
          <div className='stat-card minimum-card'>
            <div className='stat-icon'>
              <Wallet size={32} />
            </div>
            <div className='stat-content'>
              <span className='stat-label'>الرصيد المتاح</span>
              <span className='stat-value'>
                ${withdrawalData?.totalEarnings || 0}
              </span>
              <span className='stat-unit'>للسحب</span>
            </div>
          </div>

          {/* Processing Time Card */}
          <div className='stat-card time-card'>
            <div className='stat-icon'>
              <Clock size={32} />
            </div>
            <div className='stat-content'>
              <span className='stat-label'>وقت المعالجة</span>
              <span className='stat-value'>24-48</span>
              <span className='stat-unit'>ساعة</span>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {(withdrawalData?.totalEarnings || 0) > 0 && (
          <div className='alert alert-success'>
            <Check size={20} />
            <div className='alert-content'>
              <strong>✅ أنت مؤهل للسحب!</strong>
              <p>يمكنك طلب سحب أرباحك الآن. ملء النموذج أدناه للمتابعة.</p>
            </div>
          </div>
        )}

        {/* Withdraw Earnings Button */}
        {(withdrawalData?.totalEarnings || 0) > 0 && (
          <div className='withdraw-button-section'>
            <button
              onClick={() => setShowModal(true)}
              className='withdraw-earnings-btn'
            >
              <Wallet size={20} />
              سحب الأرباح
            </button>
          </div>
        )}

        {(withdrawalData?.totalEarnings || 0) === 0 && (
          <div className='alert alert-info'>
            <AlertCircle size={20} />
            <div className='alert-content'>
              <strong>💡 لا توجد أرباح متاحة حالياً</strong>
              <p>
                ابدأ في إحضار أصدقاءك وأحبائك للانضمام وابدأ في كسب الأرباح!
              </p>
            </div>
          </div>
        )}

        {/* Withdrawal Form */}
        {(withdrawalData?.totalEarnings || 0) >= 100 && (
          <div className='form-section'>
            <h2>📝 تقديم طلب السحب</h2>

            {error && (
              <div className='alert alert-error'>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className='alert alert-success'>
                <Check size={18} />
                <span>{success}</span>
              </div>
            )}

            <form
              onSubmit={handleWithdrawalRequest}
              className='withdrawal-form'
            >
              <div className='form-group'>
                <label>🔐 عنوان محفظة USDT الخاصة بك</label>
                <div className='input-wrapper'>
                  <input
                    type='text'
                    placeholder='التصق عنوان محفظة USDT الخاصة بك هنا'
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    disabled={loading}
                    required
                    className='wallet-input'
                  />
                </div>
                <small className='input-hint'>
                  💡 أمثلة صحيحة: TNpBtVMSJwXvwEJdFZeYCKWWGq5LK... أو 0x...
                </small>
              </div>

              <div className='withdrawal-summary'>
                <div className='summary-item'>
                  <span>المبلغ المطلوب سحبه:</span>
                  <strong className='amount'>
                    ${withdrawalData?.totalEarnings || 0}
                  </strong>
                </div>
                <div className='summary-item'>
                  <span>رسوم المعالجة:</span>
                  <strong className='free'>مجاني</strong>
                </div>
                <div className='summary-divider' />
                <div className='summary-item total'>
                  <span>الذي ستستقبله:</span>
                  <strong className='total-amount'>
                    ${withdrawalData?.totalEarnings || 0} USDT
                  </strong>
                </div>
              </div>

              <button
                type='submit'
                className='submit-btn'
                disabled={loading || (withdrawalData?.totalEarnings || 0) < 100}
              >
                {loading
                  ? (
                    <>
                      <span className='spinner' />
                      جاري المعالجة...
                    </>
                    )
                  : (
                    <>
                      <Send size={18} />
                      تقديم طلب السحب
                    </>
                    )}
              </button>

              <p className='form-notice'>
                ✅ تأكد من أن العنوان صحيح. لا يمكن تغييره بعد التقديم.
              </p>
            </form>
          </div>
        )}

        {/* Previous Requests */}
        {previousRequests.length > 0 && (
          <div className='requests-section'>
            <h2>📋 طلباتك السابقة</h2>
            <div className='requests-table'>
              {previousRequests.map((req, idx) => (
                <div key={idx} className='request-row'>
                  <div className='request-info'>
                    <div className='request-amount'>${req.amount}</div>
                    <div className='request-details'>
                      <small>طلب #{req.id}</small>
                      <small>
                        {new Date(req.requestedAt).toLocaleDateString('ar-EG')}
                      </small>
                    </div>
                  </div>
                  <div
                    className='request-status'
                    style={{ color: getStatusBadge(req.status).color }}
                  >
                    {getStatusBadge(req.status).label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className='info-section'>
          <h2>📚 معلومات مهمة</h2>
          <div className='info-grid'>
            <div className='info-item'>
              <span className='info-icon'>💡</span>
              <div>
                <strong>كيف يتم حساب الأرباح؟</strong>
                <p>كل شخص تحضره = $100 أرباح. بدون حد أقصى!</p>
              </div>
            </div>

            <div className='info-item'>
              <span className='info-icon'>⚡</span>
              <div>
                <strong>متى يتم السحب؟</strong>
                <p>في غضون 24-48 ساعة من الموافقة. سيصل مباشرة إلى محفظتك.</p>
              </div>
            </div>

            <div className='info-item'>
              <span className='info-icon'>🔒</span>
              <div>
                <strong>هل عنواني آمن؟</strong>
                <p>نعم، نستخدم أحدث معايير الأمان. عنوانك محمي بالتشفير.</p>
              </div>
            </div>

            <div className='info-item'>
              <span className='info-icon'>❓</span>
              <div>
                <strong>ماذا لو لم يصل المبلغ؟</strong>
                <p>تواصل مع فريق الدعم فوراً. سنساعدك في التحقق من الطلب.</p>
              </div>
            </div>

            <div className='info-item'>
              <span className='info-icon'>🎯</span>
              <div>
                <strong>حد السحب الأقصى؟</strong>
                <p>بدون حد أقصى! اسحب كل أرباحك متى شئت.</p>
              </div>
            </div>

            <div className='info-item'>
              <span className='info-icon'>🪙</span>
              <div>
                <strong>ما هي العملة المدعومة؟</strong>
                <p>USDT على شبكة TRON و Binance Smart Chain فقط.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className='tips-section'>
          <h2>💎 نصائح لزيادة أرباحك</h2>
          <ul className='tips-list'>
            <li>🎯 شارك رابط الإحالة الخاص بك على مواقع التواصل الاجتماعي</li>
            <li>👥 ادعُ أصدقاءك وعائلتك للانضمام</li>
            <li>📱 استخدم Telegram و WhatsApp لنشر الكلمة</li>
            <li>💬 اكتب تقييمات إيجابية عن المنصة</li>
            <li>🌍 شارك التجربة مع مجتمعات التداول</li>
            <li>⭐ كل شخص تحضره = $100 في جيبك!</li>
          </ul>
        </div>

        {/* Withdrawal Modal */}
        {showModal && (
          <div className='modal-overlay'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h3>💰 سحب الأرباح</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className='modal-close-btn'
                >
                  <X size={24} />
                </button>
              </div>

              <div className='modal-body'>
                <div className='available-balance'>
                  <span>الرصيد المتاح:</span>
                  <strong>${withdrawalData?.totalEarnings || 0} USDT</strong>
                </div>

                <form
                  onSubmit={handleModalSubmit}
                  className='withdrawal-modal-form'
                >
                  <div className='form-group'>
                    <label>المبلغ المراد سحبه (USDT)</label>
                    <input
                      type='number'
                      placeholder='أدخل المبلغ'
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      min='1'
                      max={withdrawalData?.totalEarnings || 0}
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label>طريقة السحب</label>
                    <select
                      value={withdrawalMethod}
                      onChange={(e) => setWithdrawalMethod(e.target.value)}
                    >
                      <option value='USDT'>USDT (TRC20)</option>
                      <option value='USDT_BEP20'>USDT (BEP20)</option>
                      <option value='USDT_ERC20'>USDT (ERC20)</option>
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>عنوان المحفظة</label>
                    <input
                      type='text'
                      placeholder='أدخل عنوان محفظتك'
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label>ملاحظة (اختياري)</label>
                    <textarea
                      placeholder='أي ملاحظات إضافية...'
                      value={withdrawalNote}
                      onChange={(e) => setWithdrawalNote(e.target.value)}
                      rows='3'
                    />
                  </div>

                  <div className='modal-actions'>
                    <button
                      type='button'
                      onClick={() => setShowModal(false)}
                      className='cancel-btn'
                    >
                      إلغاء
                    </button>
                    <button
                      type='submit'
                      className='submit-withdrawal-btn'
                      disabled={!withdrawalAmount || !walletAddress || loading}
                    >
                      {loading
                        ? (
                          <>
                            <span className='spinner' />
                            جاري المعالجة...
                          </>
                          )
                        : (
                          <>
                            <Send size={18} />
                            تأكيد السحب
                          </>
                          )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Withdrawal
