# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints require JWT authentication (except login/register).

### Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## Authentication Endpoints

### Login

**POST** `/auth/login`

Request:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response (200):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "fullName": "Admin Name"
  }
}
```

### Register Admin

**POST** `/auth/register`

Request:

```json
{
  "email": "newadmin@example.com",
  "password": "SecurePass123",
  "fullName": "New Admin"
}
```

Response (201):

```json
{
  "message": "Admin created successfully",
  "user": {
    "id": "uuid",
    "email": "newadmin@example.com",
    "fullName": "New Admin"
  }
}
```

### Get Current User

**GET** `/auth/me`

Response (200):

```json
{
  "id": "uuid",
  "email": "admin@example.com",
  "fullName": "Admin Name",
  "status": "Active"
}
```

### Logout

**POST** `/auth/logout`

Response (200):

```json
{
  "message": "Logged out successfully"
}
```

---

## Dashboard Endpoints

### Get Overview

**GET** `/dashboard`

Response (200):

```json
{
  "overview": {
    "totalUsers": 150,
    "activeUsers": 145,
    "internalMembers": 45,
    "externalMembers": 105,
    "totalPaidSubscriptions": 120,
    "totalRenewals": 30,
    "totalRevenue": 30000.5,
    "totalReferralCommissionsPaid": 5250.75,
    "pendingWithdrawals": 5
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Growth Data

**GET** `/dashboard/growth`

Response (200):

```json
[
  {
    "date": "2024-01-01",
    "count": 5
  },
  {
    "date": "2024-01-02",
    "count": 8
  }
]
```

### Get Top Referrers

**GET** `/dashboard/top-referrers`

Response (200):

```json
[
  {
    "referrerId": "uuid",
    "totalReferrals": 15,
    "paidReferrals": 12,
    "conversionRate": "80%",
    "referrer": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "User Name"
    }
  }
]
```

---

## User Endpoints

### List Users

**GET** `/users`

Query Parameters:

- `page` (default: 1)
- `limit` (default: 20)
- `status` (Active, Suspended, Banned)
- `userType` (External Member, Internal Member)
- `subscriptionStatus` (Free, Active, Expired)

Response (200):

```json
{
  "total": 150,
  "page": 1,
  "limit": 20,
  "pages": 8,
  "users": [
    {
      "id": "uuid",
      "username": "user123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "status": "Active",
      "userType": "External Member",
      "currentBalance": 100.5,
      "totalEarnings": 500.0,
      "registrationDate": "2024-01-10T10:00:00Z"
    }
  ]
}
```

### Get User Details

**GET** `/users/:userId`

Response (200):

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phoneNumber": "+213555000001",
    "country": "Algeria",
    "status": "Active",
    "userType": "External Member",
    "subscriptionStatus": "Active",
    "currentBalance": 100.50,
    "totalEarnings": 500.00,
    "totalWithdrawals": 50.00
  },
  "statistics": {
    "totalPayments": 2,
    "firstPaymentDate": "2024-01-10T10:00:00Z",
    "renewalCount": 1,
    "totalReferrals": 5,
    "paidReferrals": 3,
    "directDownline": 5,
    "estimatedEarnings": 250.00
  },
  "payments": [...],
  "referrals": [...]
}
```

### Update User

**PUT** `/users/:userId`

Request:

```json
{
  "fullName": "John Updated",
  "phoneNumber": "+213555000002",
  "country": "Algeria",
  "walletAddress": "0x123abc..."
}
```

Response (200):

```json
{
  "message": "User updated successfully",
  "user": { ... }
}
```

### Change User Status

**PATCH** `/users/:userId/status`

Request:

```json
{
  "status": "Suspended"
}
```

Values: `Active`, `Suspended`, `Banned`

Response (200):

```json
{
  "message": "User status updated",
  "user": { ... }
}
```

### Change User Type

**PATCH** `/users/:userId/type`

Request:

```json
{
  "userType": "Internal Member"
}
```

Values: `External Member`, `Internal Member`

Response (200):

```json
{
  "message": "User type updated",
  "user": { ... }
}
```

### Reset User Earnings

**POST** `/users/:userId/reset-earnings`

Response (200):

```json
{
  "message": "User earnings reset",
  "user": {
    "currentBalance": 0,
    "totalEarnings": 0
  }
}
```

### Adjust User Balance

**POST** `/users/:userId/adjust-balance`

Request:

```json
{
  "amount": 50.0,
  "reason": "Manual adjustment for promotion"
}
```

Response (200):

```json
{
  "message": "Balance adjusted",
  "user": {
    "currentBalance": 150.0
  }
}
```

---

## Payment Endpoints

### List Payments

**GET** `/payments`

Query Parameters:

- `page` (default: 1)
- `limit` (default: 20)
- `type` (First Payment, Renewal)
- `status` (Pending, Completed, Failed, Refunded)
- `userId`

Response (200):

```json
{
  "total": 120,
  "page": 1,
  "limit": 20,
  "pages": 6,
  "payments": [
    {
      "id": "uuid",
      "userId": "uuid",
      "amount": 250.0,
      "paymentMethod": "Credit Card",
      "type": "First Payment",
      "status": "Completed",
      "transactionId": "TXN123...",
      "paymentDate": "2024-01-15T10:00:00Z",
      "User": {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "John Doe"
      }
    }
  ]
}
```

### Create Payment

**POST** `/payments`

Request:

```json
{
  "userId": "uuid",
  "amount": 250.0,
  "paymentMethod": "Bank Transfer",
  "type": "First Payment",
  "subscriptionValidUntil": "2024-02-15"
}
```

Response (201):

```json
{
  "id": "uuid",
  "userId": "uuid",
  "amount": 250.0,
  "status": "Completed",
  "type": "First Payment",
  "transactionId": "MAN-...",
  "paymentDate": "2024-01-15T10:00:00Z"
}
```

### Get Payment Details

**GET** `/payments/:paymentId`

Response (200): Returns full payment object with user details

### Update Payment Status

**PATCH** `/payments/:paymentId/status`

Request:

```json
{
  "status": "Completed"
}
```

Values: `Pending`, `Completed`, `Failed`, `Refunded`

Response (200):

```json
{
  "message": "Payment status updated",
  "payment": { ... }
}
```

---

## Referral Endpoints

### List All Referrals

**GET** `/referrals`

Query Parameters:

- `page` (default: 1)
- `limit` (default: 20)
- `paymentStatus` (Not Paid, Paid, Renewed)

Response (200):

```json
{
  "total": 250,
  "page": 1,
  "referrals": [
    {
      "id": "uuid",
      "referrerId": "uuid",
      "refereeId": "uuid",
      "registrationDate": "2024-01-10T10:00:00Z",
      "paymentStatus": "Paid",
      "firstPaymentDate": "2024-01-12T10:00:00Z",
      "renewalCount": 1
    }
  ]
}
```

### Get User's Referrals

**GET** `/referrals/user/:userId`

Response (200):

```json
{
  "referrerId": "uuid",
  "referralCode": "ABC12345",
  "totalReferrals": 10,
  "paidReferrals": 7,
  "renewedReferrals": 2,
  "referrals": [...]
}
```

### Get Referral Tree

**GET** `/referrals/tree/top`

Response (200):

```json
[
  {
    "referrer": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Top Referrer"
    },
    "totalReferrals": 25,
    "paidReferrals": 20,
    "conversionRate": "80%"
  }
]
```

### Reset Referrals

**POST** `/referrals/:userId/reset`

Response (200):

```json
{
  "message": "Referral statistics reset",
  "deletedCount": 10
}
```

---

## Withdrawal Endpoints

### List Withdrawals

**GET** `/withdrawals`

Query Parameters:

- `page` (default: 1)
- `limit` (default: 20)
- `status` (Pending, Approved, Rejected, Paid)

Response (200):

```json
{
  "total": 45,
  "withdrawals": [
    {
      "id": "uuid",
      "userId": "uuid",
      "amount": 100.0,
      "walletAddress": "0x123...",
      "status": "Pending",
      "requestedAt": "2024-01-15T10:00:00Z",
      "User": {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "John Doe"
      }
    }
  ]
}
```

### Get Pending Withdrawals

**GET** `/withdrawals/pending/list`

Response (200): Returns only pending withdrawals

### Get Withdrawal Details

**GET** `/withdrawals/:withdrawalId`

Response (200): Returns full withdrawal details

### Approve Withdrawal

**PATCH** `/withdrawals/:withdrawalId/approve`

Response (200):

```json
{
  "message": "Withdrawal approved",
  "withdrawal": {
    "status": "Approved",
    "approvedAt": "2024-01-15T10:15:00Z"
  }
}
```

### Reject Withdrawal

**PATCH** `/withdrawals/:withdrawalId/reject`

Request:

```json
{
  "reason": "Insufficient funds"
}
```

Response (200):

```json
{
  "message": "Withdrawal rejected",
  "withdrawal": {
    "status": "Rejected",
    "rejectionReason": "Insufficient funds"
  }
}
```

### Mark as Paid

**PATCH** `/withdrawals/:withdrawalId/paid`

Request:

```json
{
  "transactionHash": "0x123abc..."
}
```

Response (200):

```json
{
  "message": "Withdrawal marked as paid",
  "withdrawal": {
    "status": "Paid",
    "paidAt": "2024-01-15T11:00:00Z",
    "transactionHash": "0x123abc..."
  }
}
```

---

## Commission Endpoints

### Get User Commissions

**GET** `/commissions/user/:userId`

Response (200):

```json
{
  "userId": "uuid",
  "downlineCount": 25,
  "totalEarnings": 2500.0,
  "breakdown": [
    {
      "level": 1,
      "rate": 10,
      "isActive": true,
      "profitPerPerson": 25.0,
      "totalProfit": 625.0,
      "actualDownlineCount": 25
    },
    {
      "level": 2,
      "rate": 8,
      "isActive": false,
      "profitPerPerson": 20.0,
      "totalProfit": 2000.0,
      "actualDownlineCount": 0
    }
  ]
}
```

### List Commissions

**GET** `/commissions`

Query Parameters:

- `page`, `limit`
- `payoutStatus` (Pending, Paid, Pending Reset)

Response (200): Paginated commissions list

### Get Commission Summary

**GET** `/commissions/summary/all`

Response (200):

```json
{
  "totalCommissionsPaid": 50000.00,
  "topEarners": [...],
  "count": 50
}
```

---

## Activity Log Endpoints

### List Logs

**GET** `/logs`

Query Parameters:

- `page`, `limit`
- `action` (e.g., UPDATE_USER, APPROVE_WITHDRAWAL)
- `entityType`
- `startDate`, `endDate`

Response (200):

```json
{
  "total": 500,
  "page": 1,
  "logs": [
    {
      "id": "uuid",
      "adminId": "uuid",
      "action": "UPDATE_USER",
      "entityType": "User",
      "entityId": "uuid",
      "previousValues": { ... },
      "newValues": { ... },
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get Admin's Logs

**GET** `/logs/admin/:adminId`

Query Parameters:

- `limit` (default: 100)

Response (200): Admin's recent actions

### Get Log Statistics

**GET** `/logs/stats/summary`

Response (200):

```json
[
  {
    "action": "UPDATE_USER",
    "count": 150
  },
  {
    "action": "APPROVE_WITHDRAWAL",
    "count": 45
  }
]
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized

```json
{
  "error": "No token provided"
}
```

### 403 Forbidden

```json
{
  "error": "Admin access required"
}
```

### 404 Not Found

```json
{
  "error": "User not found"
}
```

### 409 Conflict

```json
{
  "error": "Email already exists"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error"
}
```

---

## Rate Limiting

Currently not implemented. Recommended for production:

- 100 requests per minute per IP
- 10 requests per minute for sensitive endpoints

## Pagination

All list endpoints support pagination:

- `page`: Current page (default: 1)
- `limit`: Items per page (default: 20)

Response includes:

```json
{
  "total": 150,
  "page": 1,
  "limit": 20,
  "pages": 8,
  "items": [...]
}
```

## Timestamps

All timestamps are in ISO 8601 format (UTC):

```
2024-01-15T10:30:45.123Z
```
