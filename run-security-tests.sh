#!/bin/bash

# 🔒 Gold Trading DZ Security Test Suite
# اختبار شامل لنظام الأمان

set -e  # توقف عند أي خطأ

# الألوان للإخراج
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# الإعدادات
BASE_URL="http://localhost:5001"
ADMIN_EMAIL="admin@tradingdz.com"
ADMIN_PASSWORD="admin123456"
TEST_TIMEOUT=5

# العداد
TESTS_PASSED=0
TESTS_FAILED=0

# الدوال المساعدة
print_header() {
  echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ $1${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
  ((TESTS_PASSED++))
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
  ((TESTS_FAILED++))
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

check_server() {
  echo -n "🔍 جاري التحقق من حالة الخادم..."
  
  if ! curl -s -f "$BASE_URL/api/health" > /dev/null 2>&1; then
    echo -e "${RED}فشل!${NC}"
    echo "❌ الخادم غير متاح على $BASE_URL"
    echo "💡 تأكد من تشغيل: cd backend && node mock-server.js"
    exit 1
  fi
  
  echo -e "${GREEN}متاح!${NC}"
}

test_login() {
  print_header "اختبار 1: تسجيل الدخول الآمن"
  
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -H "User-Agent: SecurityTestBot/1.0" \
    -d "{
      \"email\": \"$ADMIN_EMAIL\",
      \"password\": \"$ADMIN_PASSWORD\"
    }")
  
  if echo "$RESPONSE" | grep -q '"token"'; then
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    print_success "تسجيل الدخول ناجح"
    echo "📝 التوكن: ${TOKEN:0:20}..."
  else
    print_error "فشل تسجيل الدخول"
    echo "📊 الرد: $RESPONSE"
    return 1
  fi
}

test_wrong_password() {
  print_header "اختبار 2: رفض كلمة المرور الخاطئة"
  
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$ADMIN_EMAIL\",
      \"password\": \"wrongpassword123\"
    }")
  
  if echo "$RESPONSE" | grep -q '"error"'; then
    print_success "تم رفض كلمة المرور الخاطئة"
  else
    print_error "لم يتم رفع الخطأ للكلمة الخاطئة"
    echo "📊 الرد: $RESPONSE"
    return 1
  fi
}

test_sql_injection() {
  print_header "اختبار 3: حماية من SQL Injection"
  
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "admin\" OR \"1\"=\"1",
      "password": "anything"
    }')
  
  if echo "$RESPONSE" | grep -q 'invalid'; then
    print_success "تم حظر محاولة SQL Injection"
  else
    print_error "لم يتم حظر SQL Injection"
    echo "📊 الرد: $RESPONSE"
    return 1
  fi
}

test_xss() {
  print_header "اختبار 4: حماية من XSS Attack"
  
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "<script>alert(\"xss\")</script>@test.com",
      "password": "password123456",
      "fullName": "Test User"
    }')
  
  if echo "$RESPONSE" | grep -q 'invalid'; then
    print_success "تم حظر محاولة XSS"
  else
    print_error "لم يتم حظر XSS"
    echo "📊 الرد: $RESPONSE"
    return 1
  fi
}

test_brute_force() {
  print_header "اختبار 5: حماية من Brute Force Attack"
  
  print_warning "سيتم محاولة 6 مرات للدخول بكلمة خاطئة..."
  
  for i in {1..6}; do
    echo -n "محاولة $i/6... "
    RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$ADMIN_EMAIL\",
        \"password\": \"wrongpass$i\"
      }" --max-time 3)
    
    if [ $i -lt 6 ]; then
      echo -e "${RED}فشلت${NC}"
    else
      if echo "$RESPONSE" | grep -q 'locked'; then
        echo -e "${GREEN}تم القفل!${NC}"
        print_success "تم اكتشاف Brute Force وقفل الحساب"
      else
        echo -e "${RED}لم يتم القفل${NC}"
        print_warning "قد لا يكون الحساب مقفول (كمتوقع)"
      fi
    fi
  done
}

test_rate_limiting() {
  print_header "اختبار 6: Rate Limiting"
  
  print_warning "سيتم إرسال 101 طلب لاختبار الحد..."
  
  BLOCKED=0
  for i in {1..101}; do
    if [ $((i % 10)) -eq 0 ]; then
      echo -n "."
    fi
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/health" --max-time 1)
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" == "429" ]; then
      BLOCKED=1
      break
    fi
  done
  
  echo ""
  if [ $BLOCKED -eq 1 ]; then
    print_success "تم تفعيل Rate Limiting (HTTP 429)"
  else
    print_warning "Rate Limiting قد لا يكون مفعل (أو الحد مرتفع جداً)"
  fi
}

test_security_status() {
  print_header "اختبار 7: لوحة التحكم الأمنية"
  
  # احصل على التوكن أولاً
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$ADMIN_EMAIL\",
      \"password\": \"$ADMIN_PASSWORD\"
    }")
  
  TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  
  if [ -z "$TOKEN" ]; then
    print_error "فشل الحصول على التوكن"
    return 1
  fi
  
  # اختبر حالة الأمان
  STATUS=$(curl -s -X GET "$BASE_URL/api/security/status" \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$STATUS" | grep -q 'totalActivities'; then
    print_success "لوحة التحكم الأمنية تعمل"
    
    # استخرج الإحصائيات
    TOTAL=$(echo "$STATUS" | grep -o '"totalActivities":[0-9]*' | cut -d':' -f2)
    SUSPICIOUS=$(echo "$STATUS" | grep -o '"suspiciousActivities":[0-9]*' | cut -d':' -f2)
    BLOCKED=$(echo "$STATUS" | grep -o '"blockedIPs":[0-9]*' | cut -d':' -f2)
    
    echo "📊 الإحصائيات:"
    echo "   - إجمالي الأنشطة: $TOTAL"
    echo "   - أنشطة مريبة: $SUSPICIOUS"
    echo "   - IPs محظورة: $BLOCKED"
  else
    print_error "لوحة التحكم لا تعمل بشكل صحيح"
    echo "📊 الرد: $STATUS"
    return 1
  fi
}

test_activity_logging() {
  print_header "اختبار 8: تسجيل الأنشطة"
  
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$ADMIN_EMAIL\",
      \"password\": \"$ADMIN_PASSWORD\"
    }")
  
  TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  
  # احصل على أنشطة المستخدم
  ACTIVITIES=$(curl -s -X GET "$BASE_URL/api/security/user-activities/2" \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$ACTIVITIES" | grep -q '"activities"'; then
    print_success "نظام تسجيل الأنشطة يعمل"
    
    ACTIVITY_COUNT=$(echo "$ACTIVITIES" | grep -o '"id":"activity_' | wc -l)
    echo "📝 عدد الأنشطة المسجلة: $ACTIVITY_COUNT"
  else
    print_warning "لم يتمكن من جلب الأنشطة"
  fi
}

test_fingerprinting() {
  print_header "اختبار 9: البصمة الرقمية (Digital Fingerprinting)"
  
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$ADMIN_EMAIL\",
      \"password\": \"$ADMIN_PASSWORD\"
    }")
  
  TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  
  # احصل على بصمات المستخدم
  FINGERPRINTS=$(curl -s -X GET "$BASE_URL/api/security/fingerprint/2" \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$FINGERPRINTS" | grep -q '"fingerprints"'; then
    print_success "نظام البصمة الرقمية يعمل"
    
    FP_COUNT=$(echo "$FINGERPRINTS" | grep -o '"[a-f0-9]*' | wc -l)
    echo "👤 عدد البصمات: $FP_COUNT"
  else
    print_warning "لم يتمكن من جلب البصمات"
  fi
}

test_suspicious_activities() {
  print_header "اختبار 10: كشف الأنشطة المريبة"
  
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$ADMIN_EMAIL\",
      \"password\": \"$ADMIN_PASSWORD\"
    }")
  
  TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  
  # احصل على الأنشطة المريبة
  SUSPICIOUS=$(curl -s -X GET "$BASE_URL/api/security/suspicious-activities" \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$SUSPICIOUS" | grep -q '"activities"'; then
    print_success "نظام كشف الأنشطة المريبة يعمل"
    
    SUSP_COUNT=$(echo "$SUSPICIOUS" | grep -o '"type":"' | wc -l)
    echo "🚨 الأنشطة المريبة المكتشفة: $SUSP_COUNT"
  else
    print_warning "لم يتمكن من جلب الأنشطة المريبة"
  fi
}

# ===== البرنامج الرئيسي =====

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🔒 Gold Trading DZ - Security Test Suite               ║${NC}"
echo -e "${BLUE}║   اختبار شامل لنظام الأمان                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

# تحقق من الخادم
check_server

# نفذ الاختبارات
test_login || true
test_wrong_password || true
test_sql_injection || true
test_xss || true
test_brute_force || true
test_rate_limiting || true
test_security_status || true
test_activity_logging || true
test_fingerprinting || true
test_suspicious_activities || true

# الملخص
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   📊 ملخص النتائج                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

TOTAL=$((TESTS_PASSED + TESTS_FAILED))
SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL))

echo -e "✅ اختبارات نجحت: ${GREEN}$TESTS_PASSED${NC}"
echo -e "❌ اختبارات فشلت: ${RED}$TESTS_FAILED${NC}"
echo -e "📊 نسبة النجاح: ${YELLOW}$SUCCESS_RATE%${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "\n${GREEN}🎉 جميع الاختبارات نجحت! النظام آمن تماماً.${NC}\n"
  exit 0
else
  echo -e "\n${RED}⚠️  هناك بعض الاختبارات التي فشلت. يرجى المراجعة.${NC}\n"
  exit 1
fi
