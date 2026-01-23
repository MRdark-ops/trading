const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const configureMiddleware = (app) => {
  // Security
  app.use(helmet());
  
  // CORS
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] 
      : ['http://localhost:3000'],
    credentials: true
  }));
  
  // Logging
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  
  // Parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Request timeout
  app.use((req, res, next) => {
    req.setTimeout(30000);
    res.setTimeout(30000);
    next();
  });
};

module.exports = configureMiddleware;
