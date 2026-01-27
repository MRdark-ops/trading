import React from 'react'
import { Link } from 'react-router-dom'
import { Users, CreditCard, TrendingUp, LogOut, Home } from 'lucide-react'
import WithdrawalButton from '../components/WithdrawalButton'

const Dashboard = () => {
  // بيانات وهمية للمستخدم (عادة تأتي من API)
  const userInfo = {
    name: 'محمد أحمد',
    email: 'user@tradingdz.com',
    balance: 1250.0,
    referralsCount: 12,
    subscription: 'Pro Plan'
  }

  return (
    <div className='min-h-screen bg-gray-100 font-sans' dir='rtl'>
      {/* الشريط العلوي */}
      <nav className='bg-white shadow-sm px-6 py-4 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <div className='bg-blue-600 text-white p-2 rounded-lg'>
            <Home size={24} />
          </div>
          <span className='text-xl font-bold text-gray-800'>لوحة التحكم</span>
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-gray-600 hidden md:block'>
            {userInfo.email}
          </span>
          <button
            className='text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors'
            title='تسجيل الخروج'
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className='container mx-auto px-4 py-8'>
        {/* رسالة الترحيب */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            مرحباً، {userInfo.name} 👋
          </h1>
          <p className='text-gray-600'>
            إليك نظرة عامة على حسابك وأرباحك اليوم.
          </p>
        </div>

        {/* البطاقات الإحصائية */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {/* بطاقة الرصيد */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between'>
            <div>
              <div className='flex justify-between items-start mb-4'>
                <div className='p-3 bg-green-100 text-green-600 rounded-xl'>
                  <TrendingUp size={24} />
                </div>
                <span className='text-sm text-gray-400'>الرصيد الحالي</span>
              </div>
              <h2 className='text-4xl font-bold text-gray-800 mb-1'>
                ${userInfo.balance}
              </h2>
              <p className='text-sm text-green-600 flex items-center gap-1'>
                +15% <span className='text-gray-400'>من الشهر الماضي</span>
              </p>
            </div>
            <div className='mt-6'>
              {/* زر السحب الذي تم إنشاؤه سابقاً */}
              <WithdrawalButton />
            </div>
          </div>

          {/* بطاقة الإحالات */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-start mb-4'>
              <div className='p-3 bg-purple-100 text-purple-600 rounded-xl'>
                <Users size={24} />
              </div>
              <span className='text-sm text-gray-400'>الإحالات</span>
            </div>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>
              {userInfo.referralsCount}
            </h2>
            <p className='text-gray-500 text-sm mb-6'>
              شخص قاموا بالتسجيل من خلالك
            </p>
            <Link
              to='/referrals'
              className='text-purple-600 font-medium hover:text-purple-700 text-sm flex items-center gap-1'
            >
              عرض التفاصيل &rarr;
            </Link>
          </div>

          {/* بطاقة الاشتراك */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-start mb-4'>
              <div className='p-3 bg-blue-100 text-blue-600 rounded-xl'>
                <CreditCard size={24} />
              </div>
              <span className='text-sm text-gray-400'>الاشتراك</span>
            </div>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>
              {userInfo.subscription}
            </h2>
            <p className='text-green-500 text-sm font-medium mb-6'>
              ● نشط حالياً
            </p>
            <Link
              to='/subscription-payment'
              className='w-full block text-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg transition-colors text-sm font-medium'
            >
              إدارة الاشتراك
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
