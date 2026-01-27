import React from 'react'

function ProtectedRoute ({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-dark'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gold mb-4'>Access Denied</h1>
          <p className='text-gray-400 mb-6'>Please log in to continue</p>
          <a
            href='/login'
            className='inline-block px-8 py-3 bg-gold text-dark rounded-lg font-bold hover:bg-yellow-400'
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
