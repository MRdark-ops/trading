// Validation schemas using Joi
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().max(100),
  phoneNumber: Joi.string().pattern(/^[\d\s\-\+\(\)]+$/),
  country: Joi.string().max(50),
  walletAddress: Joi.string().max(255)
});

const paymentSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('Credit Card', 'Bank Transfer', 'Crypto', 'PayPal').required(),
  type: Joi.string().valid('First Payment', 'Renewal').required(),
  subscriptionValidUntil: Joi.date()
});

const withdrawalSchema = Joi.object({
  amount: Joi.number().positive().required(),
  walletAddress: Joi.string().max(255).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  userSchema,
  paymentSchema,
  withdrawalSchema,
  loginSchema
};
