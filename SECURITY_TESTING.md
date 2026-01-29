# 🧪 دليل اختبار نظام الأمان

## 📝 متطلبات الاختبار

- تثبيت Postman أو curl
- تشغيل الخادم على http://localhost:5001
- توفر الوقت (30 دقيقة)

---

## 🚀 اختبار 1: المصادقة الآمنة والبصمة الرقمية

### الخطوة 1: تسجيل دخول ناجح

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  -d '{
    "email": "admin@tradingdz.com",
    "password": "admin123456"
  }'
```

**الرد المتوقع:**

```json
{
  "success": true,
  "token": "a7f3e2d1c5b8a9f4...",
  "user": {
    "id": 2,
    "email": "admin@tradingdz.com",
    "role": "admin",
    "fullName": "مسؤول الموقع"
  }
}
```

**ما يتم تسجيله:**
✅ البريد الإلكتروني
✅ كلمة المرور (للتحقق)
✅ عنوان IP
✅ User Agent
✅ معرّف الجلسة
✅ الطابع الزمني
✅ البصمة الرقمية

---

## 🚀 اختبار 2: كشف Brute Force Attack

### الخطوة 1: محاولات دخول فاشلة متعددة

احفظ التوكن من الاختبار السابق، ثم:

```bash
# محاولة 1 (خاطئة)
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tradingdz.com",
    "password": "wrongpassword1"
  }'

# محاولة 2 (خاطئة)
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tradingdz.com",
    "password": "wrongpassword2"
  }'

# ... كرر 5 مرات
```

### النتيجة المتوقعة بعد المحاولة الخامسة:

```json
{
  "success": false,
  "error": "🔒 Account locked. Too many failed attempts."
}
```

### التحقق من الأنشطة المريبة:

```bash
curl -X GET http://localhost:5001/api/security/suspicious-activities \
  -H "Authorization: Bearer <your-token>"
```

**ستجد:**

```json
{
  "activities": [
    {
      "type": "MULTIPLE_FAILED_LOGINS",
      "severity": "HIGH",
      "email": "admin@tradingdz.com",
      "ip": "192.168.1.100",
      "details": {
        "attempts": 5,
        "lockedUntil": "2024-12-29T15:45:00Z"
      }
    }
  ]
}
```

---

## 🚀 اختبار 3: كشف SQL Injection

### محاولة هجوم SQL Injection:

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin\" OR \"1\"=\"1",
    "password": "anything"
  }'
```

**النتيجة المتوقعة:**

```json
{
  "success": false,
  "error": "Email contains invalid characters"
}
```

### التحقق من تسجيل التهديد:

```bash
curl -X GET http://localhost:5001/api/security/suspicious-activities \
  -H "Authorization: Bearer <token>"
```

ستجد تهديد مع:

- `type`: "INVALID_INPUT"
- `severity`: "HIGH" أو "CRITICAL"

---

## 🚀 اختبار 4: كشف XSS Attack

### محاولة هجوم XSS:

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "<script>alert(\"xss\")</script>@test.com",
    "password": "password123456",
    "fullName": "Test User"
  }'
```

**النتيجة المتوقعة:**

```json
{
  "success": false,
  "error": "Email contains invalid characters"
}
```

---

## 🚀 اختبار 5: Rate Limiting

### الخطوة: ارسل 101 طلب في دقيقة واحدة

```bash
#!/bin/bash
for i in {1..101}; do
  curl -X GET http://localhost:5001/api/health
  if [ $i -eq 101 ]; then
    echo "Request $i - Should be rate limited"
  fi
done
```

**النتيجة المتوقعة على الطلب 101:**

```json
{
  "success": false,
  "error": "⏰ Too many requests. Please try again later."
}
```

**HTTP Status:** 429 (Too Many Requests)

---

## 🚀 اختبار 6: البصمة الرقمية (Digital Fingerprinting)

### الخطوة: عرض البصمة الرقمية لمستخدم

```bash
# استخدم توكن إداري
curl -X GET http://localhost:5001/api/security/fingerprint/1 \
  -H "Authorization: Bearer <admin-token>"
```

**الرد المتوقع:**

```json
{
  "success": true,
  "userId": 1,
  "user": {
    "email": "user@tradingdz.com",
    "fullName": "محمد أحمد",
    "registeredIP": "192.168.1.100",
    "lastLogin": "2024-12-29T15:30:00Z"
  },
  "fingerprints": [
    "a7f3e2d1c5b8a9f4...",
    "b8g4h5i6j7k8l9m0...",
    "c9h5i6j7k8l9m0n1..."
  ],
  "totalUniqueFingerprints": 3,
  "suspiciousSignIns": 0
}
```

**ما يعني:**
✅ هذا المستخدم سجّل دخول من 3 أجهزة مختلفة
✅ آخر دخول من نفس الـ IP الأصلي
✅ لا توجد علامات اشتباه

---

## 🚀 اختبار 7: حظر IP اليدوي

### الخطوة: حظر عنوان IP

```bash
curl -X POST http://localhost:5001/api/security/block-ip \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ip": "203.0.113.45",
    "duration": 3600000
  }'
```

**الرد:**

```json
{
  "success": true,
  "message": "IP 203.0.113.45 has been blocked"
}
```

### التحقق: محاولة الوصول من نفس IP

```bash
# سيتم رفضه فوراً
curl -X GET http://localhost:5001/api/health \
  --header "X-Forwarded-For: 203.0.113.45"
```

**النتيجة:**

```json
{
  "success": false,
  "error": "🚫 Your IP has been temporarily blocked due to suspicious activity"
}
```

---

## 🚀 اختبار 8: لوحة التحكم الأمنية

### عرض حالة الأمان:

```bash
curl -X GET http://localhost:5001/api/security/status \
  -H "Authorization: Bearer <admin-token>"
```

**الرد المتوقع:**

```json
{
  "success": true,
  "status": {
    "totalActivities": 1234,
    "suspiciousActivities": 12,
    "blockedIPs": 3,
    "criticalThreats": 1,
    "highThreat": 5,
    "activeSessions": 23,
    "revokedTokens": 8
  },
  "recentThreats": [
    {
      "type": "MULTIPLE_FAILED_LOGINS",
      "severity": "HIGH",
      "email": "admin@tradingdz.com",
      "ip": "192.168.1.100"
    }
  ]
}
```

---

## 🚀 اختبار 9: تسجيل الأنشطة

### عرض أنشطة مستخدم:

```bash
curl -X GET http://localhost:5001/api/security/user-activities/1 \
  -H "Authorization: Bearer <admin-token>"
```

**الرد المتوقع:**

```json
{
  "success": true,
  "userId": 1,
  "activities": [
    {
      "id": "activity_123",
      "action": "LOGIN",
      "timestamp": "2024-12-29T15:30:00Z",
      "details": {
        "email": "user@tradingdz.com",
        "ip": "192.168.1.100",
        "userAgent": "Mozilla/5.0..."
      },
      "fingerprint": "a7f3e2d1c5b8a9f4..."
    },
    {
      "id": "activity_124",
      "action": "PAYMENT",
      "timestamp": "2024-12-29T15:35:00Z",
      "details": {...}
    }
  ],
  "total": 45
}
```

---

## 🚀 اختبار 10: الأنشطة المريبة

### عرض جميع الأنشطة المريبة:

```bash
curl -X GET http://localhost:5001/api/security/suspicious-activities \
  -H "Authorization: Bearer <admin-token>"
```

**الرد:**

```json
{
  "success": true,
  "activities": [
    {
      "type": "MULTIPLE_FAILED_LOGINS",
      "severity": "HIGH",
      "email": "attacker@unknown.com",
      "ip": "203.0.113.45",
      "timestamp": "2024-12-29T15:25:00Z"
    },
    {
      "type": "SUSPICIOUS_INPUT",
      "severity": "CRITICAL",
      "email": "attacker@unknown.com",
      "ip": "203.0.113.46",
      "timestamp": "2024-12-29T15:26:00Z"
    }
  ],
  "total": 12,
  "critical": 2,
  "high": 8
}
```

---

## 📊 ملخص النتائج المتوقعة

| الاختبار                  | النتيجة                  | الحالة |
| ------------------------- | ------------------------ | ------ |
| 1. المصادقة الآمنة        | دخول ناجح + بصمة رقمية   | ✅     |
| 2. Brute Force            | قفل الحساب بعد 5 محاولات | ✅     |
| 3. SQL Injection          | رفع الطلب                | ✅     |
| 4. XSS Attack             | رفع الطلب                | ✅     |
| 5. Rate Limiting          | 429 Too Many Requests    | ✅     |
| 6. Digital Fingerprinting | عرض البصمات المختلفة     | ✅     |
| 7. IP Blocking            | حظر تلقائي               | ✅     |
| 8. Security Dashboard     | عرض الإحصائيات           | ✅     |
| 9. Activity Logging       | تسجيل كل نشاط            | ✅     |
| 10. Threat Detection      | كشف التهديدات            | ✅     |

---

## 🎓 ملاحظات مهمة

### ✅ علامات النظام الصحيحة:

1. تسجيل الأنشطة يتم فوراً
2. التهديدات تُكتشف في الحال
3. IP تُحظر دون تأخير
4. البصمات الرقمية متطابقة لنفس الجهاز
5. كل طلب يحتوي على معرّف فريد

### ⚠️ علامات تحذيرية:

1. عدم تسجيل الأنشطة ❌
2. التهديدات لا تُكتشف ❌
3. IP محظورة لكن تزال تعمل ❌
4. لا توجد بصمات رقمية ❌
5. الطلبات لا تتم معاملتها ❌

---

## 🐛 استكشاف الأخطاء

### المشكلة: "Token not found"

```bash
# تأكد من استخدام التوكن الصحيح
curl -X GET http://localhost:5001/api/security/status \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```

### المشكلة: "Admin access only"

```bash
# تأكد من أن الحساب له دور admin
# استخدم: admin@tradingdz.com أو support@tradingdz.com أو manager@tradingdz.com
```

### المشكلة: "Connection refused"

```bash
# تأكد من تشغيل الخادم
cd backend
node mock-server.js

# يجب أن ترى: ✅ Server running on port 5001
```

---

## 📝 نموذج اختبار شامل (Shell Script)

```bash
#!/bin/bash

echo "🧪 بدء اختبار نظام الأمان..."

# 1. تسجيل دخول
echo -e "\n1️⃣ اختبار تسجيل الدخول..."
TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tradingdz.com",
    "password": "admin123456"
  }' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ فشل تسجيل الدخول"
  exit 1
fi

echo "✅ تم الدخول بنجاح"
echo "Token: $TOKEN"

# 2. عرض حالة الأمان
echo -e "\n2️⃣ اختبار لوحة التحكم الأمنية..."
curl -s -X GET http://localhost:5001/api/security/status \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. عرض الأنشطة المريبة
echo -e "\n3️⃣ اختبار كشف التهديدات..."
curl -s -X GET http://localhost:5001/api/security/suspicious-activities \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n✅ اكتمل الاختبار بنجاح!"
```

---

**🎉 اختبر الأمان الآن!**

الملاحظات: جميع النتائج يجب أن تحدث فوراً < 1 ثانية
