# دليل تفعيل نظام الأمان الشامل

## 🚀 البدء السريع

### 1. تشغيل الخادم الآمن:

```bash
cd backend
node mock-server.js
```

### 2. اختبار المصادقة الآمنة:

```bash
# تسجيل دخول إداري
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tradingdz.com",
    "password": "admin123456"
  }'
```

### الاستجابة:
```json
{
  "success": true,
  "token": "a7f3e2d1c5b8a9f4e3d2c1b0a9f8e7d6c5b4a39f8e7d6c5b4a39f8e7d6c5b4a39",
  "user": {
    "id": 2,
    "email": "admin@tradingdz.com",
    "role": "admin",
    "fullName": "مسؤول الموقع"
  }
}
```

---

## 🛡️ ميزات الأمان النشطة

### 1️⃣ حماية من Brute Force Attacks

❌ **ممنوع:** محاولة تسجيل دخول متكررة

```javascript
// محاولة 5 فاشلة في دقيقة واحدة = قفل الحساب
⏰ 429 Too Many Requests
"⏰ Too many login attempts. Please try again later."
```

✅ **محمي:** بعد 15 دقيقة، يمكن المحاولة مرة أخرى

### 2️⃣ حماية من SQL Injection

```javascript
// محاولة هجوم SQL
email: "admin' OR '1'='1' --"

❌ فشل: "Email contains invalid characters"
```

### 3️⃣ حماية من XSS

```javascript
// محاولة إدراج script
password: "<script>alert('xss')</script>"

❌ فشل: "Password contains invalid characters"
```

### 4️⃣ تتبع البصمة الرقمية

```javascript
// تسجيل تلقائي لـ:
✅ عنوان IP
✅ User Agent
✅ نوع المتصفح
✅ اللغة
✅ وقت الطلب
✅ عنوان المرجع
```

---

## 📊 عرض السجلات والمراقبة

### 1. عرض حالة الأمان:

```bash
curl -X GET http://localhost:5001/api/security/status \
  -H "Authorization: Bearer <admin-token>"
```

**الاستجابة:**
```json
{
  "status": {
    "totalActivities": 1234,
    "suspiciousActivities": 23,
    "blockedIPs": 5,
    "criticalThreats": 2,
    "highThreat": 8,
    "activeSessions": 45,
    "revokedTokens": 12
  },
  "recentThreats": [...]
}
```

### 2. عرض أنشطة مستخدم:

```bash
curl -X GET http://localhost:5001/api/security/user-activities/1 \
  -H "Authorization: Bearer <admin-token>"
```

### 3. عرض الأنشطة المريبة:

```bash
curl -X GET http://localhost:5001/api/security/suspicious-activities \
  -H "Authorization: Bearer <admin-token>"
```

---

## 🔒 إدارة الأمان اليدوية

### 1. حظر عنوان IP:

```bash
curl -X POST http://localhost:5001/api/security/block-ip \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ip": "203.0.113.45",
    "duration": 86400000
  }'
```

### 2. حذف السجلات المريبة:

```bash
curl -X POST http://localhost:5001/api/security/clear-logs \
  -H "Authorization: Bearer <admin-token>"
```

### 3. التحقق من معلومات التوكن:

```bash
curl -X GET "http://localhost:5001/api/security/tokens/<token>" \
  -H "Authorization: Bearer <admin-token>"
```

---

## 📈 مؤشرات الأمان الرئيسية (KPIs)

قم بمراقبة هذه المؤشرات:

| المؤشر | الحد الأخضر | الحد الأصفر | الحد الأحمر |
|--------|-----------|-----------|-----------|
| الأنشطة المريبة | < 5 | 5-20 | > 20 |
| عناوين IP المحظورة | 0 | 1-3 | > 3 |
| محاولات فاشلة | < 10 | 10-30 | > 30 |
| التهديدات الحرجة | 0 | 1-2 | > 2 |
| جلسات نشطة | < 500 | 500-1000 | > 1000 |

---

## 🚨 التنبيهات الأمنية

### تنبيهات يجب الاستجابة لها فوراً:

🔴 **حرجة (Critical)**
- محاولة SQL Injection
- محاولة XSS
- عناوين IP متعددة تحاول جميعها الوصول

🟠 **عالية (High)**
- 5+ محاولات دخول فاشلة من نفس IP
- محاولة وصول إداري غير مصرح
- أنشطة غير عادية من حساب معروف

🟡 **متوسطة (Medium)**
- تسجيل دخول من IP جديد
- تسجيل دخول في وقت غير عادي

---

## 🧪 سيناريوهات الاختبار

### اختبار 1: محاولة Brute Force

```bash
# حاول تسجيل دخول 6 مرات متتالية خلال دقيقة
for i in {1..6}; do
  curl -X POST http://localhost:5001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "wrongpassword'$i'"
    }'
  sleep 2
done

# النتيجة: حظر IP بعد 5 محاولات فاشلة
```

### اختبار 2: SQL Injection Detection

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin\" OR \"1\"=\"1",
    "password": "anything"
  }'

# النتيجة: رفع الطلب + تسجيل التهديد
```

### اختبار 3: حماية XSS

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "<script>alert(\"xss\")</script>@test.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# النتيجة: رفع الطلب + تسجيل محاولة XSS
```

---

## 📱 استخدام مع Frontend

### في React:

```javascript
// تخزين التوكن
const handleLogin = async (email, password) => {
  const response = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
};

// استخدام التوكن في الطلبات
const apiCall = async (endpoint) => {
  const token = localStorage.getItem('token');
  
  return fetch(`http://localhost:5001${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};
```

---

## 🔐 الخطوات التالية

### للإنتاج (Production):

1. **استبدل كلمات المرور:**
   ```javascript
   // استخدم bcrypt
   const bcrypt = require('bcrypt');
   const hashed = await bcrypt.hash(password, 10);
   ```

2. **استخدم قاعدة بيانات حقيقية:**
   ```javascript
   // MongoDB أو PostgreSQL
   const user = await User.findOne({ email });
   ```

3. **فعّل HTTPS:**
   ```bash
   npm install https
   # استخدم شهادات SSL
   ```

4. **ضبط متغيرات البيئة:**
   ```bash
   # .env
   NODE_ENV=production
   JWT_SECRET=very-long-random-string
   DB_URL=mongodb+srv://...
   ```

5. **استخدم قائمة بيضاء (Whitelist):**
   ```javascript
   const allowedOrigins = [
     'https://yoursite.com',
     'https://admin.yoursite.com'
   ];
   ```

---

## 📞 الدعم الفني

اذا واجهت مشاكل:

1. تحقق من السجلات:
   ```bash
   curl http://localhost:5001/api/security/status
   ```

2. تحقق من البريد الإلكتروني والكلمة المرور

3. تأكد من تشغيل الخادم على المنفذ 5001

4. امسح LocalStorage وحاول مرة أخرى:
   ```javascript
   localStorage.clear();
   ```

---

**تم تطوير هذا النظام الأمني بتاريخ:** 29 ديسمبر 2024
