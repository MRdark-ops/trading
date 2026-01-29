# نظام الأمان الشامل - Gold Trading DZ VIP Platform

# Complete Security System Documentation

## 📋 نظرة عامة

تم تطبيق نظام أمان متقدم يتضمن:

- 🔐 مصادقة آمنة مع التوكن
- 🚨 نظام كشف الهجمات والأنشطة المريبة
- 📊 نظام تسجيل شامل للأنشطة
- 🖥️ البصمة الرقمية (Digital Fingerprinting)
- 🛡️ حماية من الهجمات الشهيرة (SQL Injection, XSS, CSRF)
- ⏱️ تحديد معدل الطلبات (Rate Limiting)
- 🔒 إدارة التوكن الآمنة

---

## 🔐 1. نظام المصادقة (Authentication)

### الميزات:

✅ **التوكن الآمن**

- توكن فريد لكل مستخدم
- انتهاء الصلاحية بعد 7 أيام
- إمكانية إلغاء التوكن (Revocation)

✅ **منع Brute Force Attacks**

- تحديد 5 محاولات فاشلة في الدقيقة
- قفل الحساب لمدة 15 دقيقة بعد 5 محاولات فاشلة
- تسجيل كل محاولة فاشلة

✅ **التحقق من المدخلات**

- التحقق من صحة البريد الإلكتروني
- التحقق من قوة كلمة المرور (8 أحرف على الأقل)
- تنظيف المدخلات من الأحرف الخطرة

### الاستخدام:

```javascript
// تسجيل الدخول
POST /api/auth/login
{
  "email": "admin@tradingdz.com",
  "password": "admin123456"
}

// الاستجابة
{
  "success": true,
  "token": "7h8e9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z",
  "user": {
    "id": 2,
    "email": "admin@tradingdz.com",
    "role": "admin",
    "fullName": "مسؤول الموقع"
  }
}

// استخدام التوكن في الطلبات
GET /api/admin/users
Authorization: Bearer 7h8e9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
```

---

## 🖥️ 2. نظام البصمة الرقمية (Digital Fingerprinting)

### المعلومات المسجلة:

```javascript
{
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "acceptLanguage": "ar-SA,ar;q=0.9,en-US;q=0.8",
  "acceptEncoding": "gzip, deflate, br",
  "method": "POST",
  "path": "/api/auth/login",
  "referer": "http://localhost:3000/login",
  "origin": "http://localhost:3000",
  "timestamp": "2024-12-29T15:30:45.123Z",
  "fingerprint": "a7f3e2d1c5b8a9f4e3d2c1b0a9f8e7d6"
}
```

### الفوائد:

✅ كشف محاولات تسجيل الدخول من أجهزة غير مألوفة
✅ تحديد الهجمات من عناوين IP متعددة
✅ تتبع حركة المستخدمين على الموقع
✅ كشف جلسات العمل المريبة

---

## 📊 3. نظام تسجيل الأنشطة (Activity Logging)

### الأنشطة المسجلة:

| النشاط       | الكود        | الوصف               |
| ------------ | ------------ | ------------------- |
| تسجيل دخول   | LOGIN        | تسجيل دخول المستخدم |
| تسجيل حساب   | REGISTRATION | إنشاء حساب جديد     |
| تسجيل خروج   | LOGOUT       | تسجيل خروج المستخدم |
| دفع          | PAYMENT      | عملية دفع           |
| سحب          | WITHDRAWAL   | طلب سحب             |
| إحالة        | REFERRAL     | إحالة جديدة         |
| عمولة        | COMMISSION   | كسب عمولة           |
| محاولة خاطئة | FAILED_LOGIN | محاولة دخول فاشلة   |
| نشاط مريب    | SUSPICIOUS   | نشاط غير عادي       |

### الوصول إلى السجلات:

```javascript
// الحصول على أنشطة مستخدم محدد
GET / api / security / user - activities / 1;
Authorization: Bearer <
  admin - token >
  // الاستجابة
  {
    success: true,
    userId: 1,
    activities: [
      {
        id: "a1b2c3d4e5f6g7h8",
        action: "LOGIN",
        timestamp: "2024-12-29T15:30:45.123Z",
        details: {
          email: "user@tradingdz.com",
          ip: "192.168.1.100",
          userAgent: "Mozilla/5.0...",
        },
        fingerprint: "a7f3e2d1c5b8a9f4...",
      },
    ],
    total: 145,
  };
```

---

## ⚠️ 4. نظام كشف الأنشطة المريبة (Threat Detection)

### الأنواع المكتشفة:

#### 🔴 تهديدات حرجة (CRITICAL)

- محاولات SQL Injection
- محاولات XSS
- محاولات CSRF

#### 🟠 تهديدات عالية (HIGH)

- محاولات تسجيل دخول متعددة فاشلة
- محاولات وصول إداري غير مصرح
- IP مشبوهة

#### 🟡 تهديدات متوسطة (MEDIUM)

- تسجيل دخول من موقع جغرافي مختلف
- تسجيل دخول في وقت غير عادي
- جهاز جديد

### API الوصول:

```javascript
// الحصول على الأنشطة المريبة
GET / api / security / suspicious - activities;
Authorization: Bearer <
  admin - token >
  // الاستجابة
  {
    success: true,
    activities: [
      {
        id: "suspicious_id_123",
        email: "attacker@unknown.com",
        ip: "203.0.113.45",
        type: "MULTIPLE_FAILED_LOGINS",
        severity: "HIGH",
        details: {
          attempts: 5,
          lockedUntil: "2024-12-29T15:45:45Z",
        },
        timestamp: "2024-12-29T15:30:45Z",
      },
    ],
    total: 23,
    critical: 2,
    high: 8,
  };
```

---

## 🛡️ 5. حماية من الهجمات الشهيرة

### SQL Injection Prevention ✅

```javascript
// محاولة هجوم (محظورة)
email: "admin' OR '1'='1' --"

// النتيجة
❌ "Email contains invalid characters"
```

### XSS Prevention ✅

```javascript
// محاولة هجوم (محظورة)
password: "<script>alert('xss')</script>"

// النتيجة
❌ "Password contains invalid characters"
```

### CSRF Protection ✅

```javascript
// All state-changing requests require valid token
POST /api/auth/login
Authorization: Bearer <valid-token>
```

---

## 🚦 6. تحديد معدل الطلبات (Rate Limiting)

### الحدود:

| النوع        | الحد | الفترة | الإجراء    |
| ------------ | ---- | ------ | ---------- |
| API العام    | 100  | دقيقة  | رفع الطلب  |
| تسجيل الدخول | 5    | دقيقة  | قفل الحساب |
| التسجيل      | 3    | ساعة   | رفع الطلب  |

### مثال:

```javascript
// الطلب السادس في دقيقة واحدة
GET /api/auth/login

// الاستجابة
⏰ 429 Too Many Requests
{
  "success": false,
  "error": "⏰ Too many login attempts. Please try again later."
}
```

---

## 🔑 7. إدارة التوكن (Token Management)

### إنشاء التوكن:

```javascript
// 32 بايت عشوائي
token: "7h8e9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z"

// معلومات التوكن المخزنة
{
  "userId": 1,
  "role": "admin",
  "createdAt": "2024-12-29T15:30:45Z",
  "expiresAt": "2025-01-05T15:30:45Z",
  "isValid": true
}
```

### إلغاء التوكن:

```javascript
// تسجيل الخروج
POST /api/auth/logout
Authorization: Bearer <token>

// النتيجة
✅ التوكن يصبح غير صالح فوراً
```

---

## 📊 8. لوحة التحكم الأمنية

### الوصول:

```javascript
// حالة الأمان
GET / api / security / status;
Authorization: Bearer <
  admin - token >
  // الاستجابة
  {
    success: true,
    status: {
      totalActivities: 1234,
      suspiciousActivities: 23,
      blockedIPs: 5,
      criticalThreats: 2,
      highThreat: 8,
      activeSessions: 45,
      revokedTokens: 12,
    },
    recentThreats: [
      {
        id: "threat_id",
        type: "MULTIPLE_FAILED_LOGINS",
        severity: "HIGH",
        email: "attacker@unknown.com",
        ip: "203.0.113.45",
      },
    ],
  };
```

---

## 🚫 9. حظر IP اليدوي

### حظر IP:

```javascript
// حظر عنوان IP
POST /api/security/block-ip
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "ip": "203.0.113.45",
  "duration": 86400000  // 24 ساعة (بالميلي ثانية)
}

// الاستجابة
{
  "success": true,
  "message": "IP 203.0.113.45 has been blocked"
}
```

---

## 🔒 10. أفضل الممارسات الأمنية

### للمسؤولين:

✅ مراقبة الأنشطة المريبة يومياً
✅ حظر عناوين IP الخطرة فوراً
✅ مراجعة السجلات الأمنية أسبوعياً
✅ تحديث كلمات المرور بانتظام
✅ استخدام توكنات قوية

### للمستخدمين:

✅ استخدام كلمات مرور قوية (8+ أحرف)
✅ عدم مشاركة التوكن أو كلمة المرور
✅ تسجيل الخروج بعد الانتهاء
✅ عدم استخدام WiFi العام للمعاملات الحساسة

---

## 🔧 11. الترقية للإنتاج

### ما يجب تغييره:

1. **التشفير:**

   ```javascript
   // استخدم bcrypt لتشفير كلمات المرور
   const bcrypt = require("bcrypt");
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **قاعدة البيانات:**

   ```javascript
   // استخدم MongoDB أو PostgreSQL
   const mongoose = require("mongoose");
   // بدلاً من قاعدة البيانات في الذاكرة
   ```

3. **متغيرات البيئة:**

   ```javascript
   // .env
   DB_URL=mongodb+srv://user:pass@cluster.mongodb.net
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```

4. **HTTPS:**

   ```javascript
   // استخدم شهادات SSL/TLS
   const https = require("https");
   const fs = require("fs");
   const cert = fs.readFileSync("cert.pem");
   ```

5. **Logging:**
   ```javascript
   // استخدم Winston أو Bunyan
   const winston = require("winston");
   // احفظ السجلات في ملفات آمنة
   ```

---

## 📞 الدعم والمساعدة

للأسئلة أو المشاكل الأمنية:

- 📧 security@tradingdz.com
- 🐛 Report vulnerability: bug@tradingdz.com
- 📋 Check logs: `/api/security/status`

---

**آخر تحديث:** 29 ديسمبر 2024
**الإصدار:** 1.0 (Complete Security Implementation)
