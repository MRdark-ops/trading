import React from 'react';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="back-home-btn">
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
