import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import api from '../api/client';
import { Send, Copy, Check, AlertCircle, Loader } from 'lucide-react';
import './SubscriptionPayment.css';

function SubscriptionPayment() {
  const navigate = useNavigate();
  const { user, handleLogin } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);

  const SUBSCRIPTION_AMOUNT = 25; // USDT

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  const fetchWalletInfo = async () => {
    try {
      const res = await api.get('/payment/usdt-wallet');
      if (res.data.success) {
        setWalletInfo(res.data.wallet);
      }
    } catch (err) {
      console.error('Error fetching wallet info:', err);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletInfo?.address || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!txHash.trim()) {
        setError('الرجاء إدخال معرّف المعاملة');
        setLoading(false);
        return;
      }

      const res = await api.post('/payment/submit-subscription', {
        txHash,
        amount: SUBSCRIPTION_AMOUNT
      });

      if (res.data.success) {
        setSuccess(true);
        localStorage.setItem('subscriptionActive', 'true');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(res.data.error || 'حدث خطأ في معالجة الدفع');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.error || 'فشل إرسال الدفع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="page-title">🔒 تفعيل الاشتراك الشهري</h1>
        <p className="page-subtitle">ادفع 25 USDT للحصول على الوصول إلى القناة الحصرية على Telegram</p>

        {/* Steps Indicator */}
        <div className="steps-container">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">بيانات المحفظة</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">تأكيد الدفع</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">تم التفعيل</span>
          </div>
        </div>

        {/* Step 1: Wallet Information */}
        {step === 1 && walletInfo && (
          <div className="payment-card step-card">
            <h2>📋 بيانات المحفظة</h2>

            <div className="wallet-info">
              <div className="info-item">
                <label>شبكة الدفع:</label>
                <p className="info-value">{walletInfo.network}</p>
              </div>

              <div className="info-item">
                <label>رابط الدفع (Binance Pay):</label>
                <div className="wallet-address-box">
                  <a href="https://s.binance.com/PB0rA7lm" target="_blank" rel="noopener noreferrer" className="payment-link">
                    https://s.binance.com/PB0rA7lm
                  </a>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText('https://s.binance.com/PB0rA7lm');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'تم النسخ' : 'نسخ'}
                  </button>
                </div>
              </div>

              <div className="info-item">
                <label>المبلغ المطلوب:</label>
                <p className="info-value highlight">
                  💰 {walletInfo.amount} {walletInfo.currency}
                </p>
              </div>

              <div className="info-item">
                <label>الغرض:</label>
                <p className="info-value">{walletInfo.purpose}</p>
              </div>
            </div>

            <div className="instructions-box">
              <h3>📝 خطوات الدفع:</h3>
              <ol>
                <li>اضغط على الرابط أعلاه للدفع عبر <strong>Binance Pay</strong></li>
                <li>أو قم بمسح رمز QR إذا كنت تستخدم جهازاً آخر</li>
                <li>أكمل عملية الدفع بقيمة <strong>25 USDT</strong></li>
                <li>بعد إتمام الدفع، انسخ معرّف المعاملة (Transaction ID / Order ID)</li>
                <li>عد إلى هنا وأدخل المعرّف في الخطوة التالية للتفعيل</li>
              </ol>
            </div>

            <button
              className="next-btn"
              onClick={() => setStep(2)}
            >
              ✅ لقد أرسلت المبلغ - تابع
            </button>
          </div>
        )}

        {/* Step 2: Confirm Payment */}
        {step === 2 && (
          <div className="payment-card step-card">
            <h2>🔍 تأكيد معرّف المعاملة</h2>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPayment} className="form">
              <div className="form-group">
                <label>معرّف المعاملة (Transaction Hash / TXID):</label>
                <input
                  type="text"
                  placeholder="مثال: 0x1234567890abcdef..."
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  disabled={loading}
                  required
                  autoFocus
                />
                <small>
                  يمكنك الحصول عليه من: محفظتك → التاريخ → انسخ معرّف المعاملة
                </small>
              </div>

              <div className="confirmation-box">
                <h3>ملخص الدفع:</h3>
                <div className="confirmation-item">
                  <span>المبلغ:</span>
                  <span className="amount">25 USDT</span>
                </div>
                <div className="confirmation-item">
                  <span>الشبكة:</span>
                  <span>TRON (TRC-20)</span>
                </div>
                <div className="confirmation-item">
                  <span>المميزات:</span>
                  <span>✅ وصول VIP • ✅ قناة Telegram • ✅ محتوى حصري</span>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <Loader size={18} className="spinner" />
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    تأكيد الدفع والتفعيل
                  </>
                )}
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                ← العودة
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Success */}
        {success && (
          <div className="payment-card step-card success-card">
            <div className="success-icon">✅</div>
            <h2>تم تفعيل الاشتراك بنجاح!</h2>

            <div className="success-details">
              <p>مبروك! لقد تم تفعيل اشتراكك الشهري بنجاح.</p>

              <div className="benefits-list">
                <h3>المميزات التي حصلت عليها:</h3>
                <ul>
                  <li>✅ وصول كامل إلى لوحة التحكم</li>
                  <li>✅ الوصول إلى قناة Telegram الحصرية: <strong>@trading_dz_vip</strong></li>
                  <li>✅ محتوى وتحليلات تجارية حصرية</li>
                  <li>✅ دعم فني متميز</li>
                  <li>✅ سحب الأرباح بدون حد أدنى إضافي</li>
                </ul>
              </div>

              <div className="telegram-link">
                <p>رابط قناة Telegram:</p>
                <a href="https://t.me/trading_dz_vip" target="_blank" rel="noopener noreferrer">
                  👉 انضم إلى @trading_dz_vip
                </a>
              </div>

              <p className="redirect-text">سيتم تحويلك إلى لوحة التحكم تلقائياً...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionPayment;
