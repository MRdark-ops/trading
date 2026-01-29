import React, { useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertCircle
} from 'lucide-react'

const AdminWithdrawalPanel = () => {
  // محاكاة لقاعدة البيانات - هذه البيانات تأتي عادة من Backend
  const [requests, setRequests] = useState([
    {
      id: 101,
      user: 'user@tradingdz.com',
      amount: 150,
      method: 'USDT (TRC20)',
      date: '2025-01-02',
      status: 'pending'
    },
    {
      id: 102,
      user: 'ahmed@gmail.com',
      amount: 200,
      method: 'CCP',
      date: '2025-01-01',
      status: 'completed'
    },
    {
      id: 103,
      user: 'sara@hotmail.com',
      amount: 50,
      method: 'BaridiMob',
      date: '2024-12-30',
      status: 'failed'
    },
    {
      id: 104,
      user: 'karim@tradingdz.com',
      amount: 500,
      method: 'USDT (TRC20)',
      date: '2025-01-02',
      status: 'pending'
    }
  ])

  // دالة لتغيير حالة الطلب
  const handleStatusChange = (id, newStatus) => {
    if (
      window.confirm(
        `هل أنت متأكد من تغيير حالة الطلب إلى ${newStatus === 'completed' ? 'مكتمل' : 'مرفوض'}؟`
      )
    ) {
      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      )
    }
  }

  // دالة مساعدة لتحديد لون الحالة
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className='flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-bold'>
            <CheckCircle size={16} /> مكتمل
          </span>
        )
      case 'failed':
        return (
          <span className='flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-bold'>
            <XCircle size={16} /> مرفوض
          </span>
        )
      default:
        return (
          <span className='flex items-center gap-1 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm font-bold'>
            <Clock size={16} /> قيد المعالجة
          </span>
        )
    }
  }

  return (
    <div
      className='bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto my-8'
      dir='rtl'
    >
      <div className='flex items-center justify-between mb-6 border-b pb-4'>
        <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
          <DollarSign className='text-green-600' />
          إدارة طلبات السحب
        </h2>
        <span className='bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded'>
          {requests.filter((r) => r.status === 'pending').length} طلبات جديدة
        </span>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-right'>
          <thead className='bg-gray-50 text-gray-600 uppercase text-sm leading-normal'>
            <tr>
              <th className='py-3 px-4 text-right'>المستخدم</th>
              <th className='py-3 px-4 text-right'>المبلغ</th>
              <th className='py-3 px-4 text-right'>طريقة السحب</th>
              <th className='py-3 px-4 text-right'>التاريخ</th>
              <th className='py-3 px-4 text-center'>الحالة</th>
              <th className='py-3 px-4 text-center'>الإجراءات</th>
            </tr>
          </thead>
          <tbody className='text-gray-700 text-sm'>
            {requests.map((req) => (
              <tr
                key={req.id}
                className='border-b border-gray-200 hover:bg-gray-50 transition-colors'
              >
                <td className='py-3 px-4 font-medium'>{req.user}</td>
                <td className='py-3 px-4 font-bold text-green-700'>
                  ${req.amount}
                </td>
                <td className='py-3 px-4'>{req.method}</td>
                <td className='py-3 px-4'>{req.date}</td>
                <td className='py-3 px-4 flex justify-center'>
                  {getStatusBadge(req.status)}
                </td>
                <td className='py-3 px-4 text-center'>
                  {req.status === 'pending'
                    ? (
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          onClick={() => handleStatusChange(req.id, 'completed')}
                          className='bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors shadow-sm'
                          title='قبول (تحويل إلى مكتمل)'
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(req.id, 'failed')}
                          className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-sm'
                          title='رفض (تحويل إلى فشل)'
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                      )
                    : (
                      <span className='text-gray-400 text-xs'>
                        تم اتخاذ القرار
                      </span>
                      )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests.length === 0 && (
          <div className='text-center py-8 text-gray-500 flex flex-col items-center'>
            <AlertCircle size={48} className='mb-2 opacity-50' />
            <p>لا توجد طلبات سحب حالياً</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminWithdrawalPanel
