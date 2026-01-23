import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const WithdrawalButton = () => {
  return (
    <Link
      to="/withdrawal"
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-md inline-flex"
      title="انتقل لصفحة سحب الأرباح"
      style={{ textDecoration: 'none' }}
    >
      <Wallet size={20} />
      <span>سحب الأرباح</span>
    </Link>
  );
};

export default WithdrawalButton;