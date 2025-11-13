# API Rate Limiting Implementation

## 🛡️ Overview

Rate limiting has been implemented to protect the API from:
- **Brute force attacks** (especially on authentication endpoints)
- **DDoS attacks** and traffic spikes
- **API abuse** and excessive usage
- **Resource exhaustion**
- **Automated scraping**

---

## 📦 Package Installed

```json
{
  "dependencies": {
    "express-rate-limit": "^7.x.x"
  },
  "devDependencies": {
    "@types/express-rate-limit": "^6.x.x"
  }
}
```

---

## 🎯 Rate Limiters Implemented

### 1. General API Limiter
**Applied to:** All API routes  
**Limit:** 100 requests per 15 minutes per IP  
**Use case:** General protection for all endpoints

```typescript
// Middleware: generalLimiter
windowMs: 15 minutes
max: 100 requests
```

### 2. Authentication Limiter (Strict)
**Applied to:** `/api` auth routes (login, signup, etc.)  
**Limit:** 5 failed attempts per 15 minutes per IP  
**Use case:** Prevent brute force attacks on authentication

```typescript
// Middleware: authLimiter
windowMs: 15 minutes
max: 5 failed requests
skipSuccessfulRequests: true
```

### 3. Create Operations Limiter
**Applied to:** POST endpoints for data creation  
**Limit:** 20 requests per 15 minutes per IP  
**Use case:** Prevent spam and abuse of create operations

```typescript
// Middleware: createLimiter
windowMs: 15 minutes
max: 20 requests
```

### 4. File Upload Limiter (Very Strict)
**Applied to:** File upload endpoints  
**Limit:** 10 uploads per hour per IP  
**Use case:** Prevent abuse of file upload functionality

```typescript
// Middleware: uploadLimiter
windowMs: 1 hour
max: 10 requests
```

### 5. Password Reset Limiter (Very Strict)
**Applied to:** Password reset endpoints  
**Limit:** 3 requests per hour per IP  
**Use case:** Prevent abuse of password reset

```typescript
// Middleware: passwordResetLimiter
windowMs: 1 hour
max: 3 requests
```

### 6. Read Operations Limiter (Lenient)
**Applied to:** GET endpoints  
**Limit:** 200 requests per 15 minutes per IP  
**Use case:** Allow more reads, restrict writes

```typescript
// Middleware: readLimiter
windowMs: 15 minutes
max: 200 requests
```

### 7. API Key Limiter (Future Use)
**Applied to:** Routes with API key authentication  
**Limit:** 1000 requests per 15 minutes per API key  
**Use case:** Higher limits for authenticated API consumers

```typescript
// Middleware: apiKeyLimiter
windowMs: 15 minutes
max: 1000 requests
keyGenerator: API key from header
```

---

## 🔧 Current Implementation

### App.ts Configuration

```typescript
// Global rate limiter (100 req/15min)
app.use(generalLimiter);

// Global API logger
app.use(apiLogger);

// Auth routes with strict limiting (5 failed/15min)
app.use('/api', authLimiter, authRouter);

// Other routes protected by general limiter
app.use('/api/shipment', validateToken, shipmentRouter);
// ... other routes
```

### Middleware Order (Important!)
1. **CORS** - Allow cross-origin requests
2. **JSON Parser** - Parse request bodies
3. **General Rate Limiter** - Apply to all routes
4. **API Logger** - Log all requests
5. **Route-specific limiters** - Apply stricter limits where needed
6. **Routes** - Handle requests
7. **Error Handler** - Catch and format errors

---

## 📊 Rate Limit Response

### When Limit is Exceeded

**HTTP Status:** `429 Too Many Requests`

**Response Headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1699876543
Retry-After: 900
```

**Response Body:**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later.",
  "retryAfter": "900"
}
```

### Logging

All rate limit violations are logged with:
- IP address
- Request path
- HTTP method
- User agent
- Timestamp

```typescript
Logger.warn('Rate limit exceeded', {
  ip: '192.168.1.1',
  path: '/api/login',
  method: 'POST',
  userAgent: 'Mozilla/5.0...'
});
```

---

## 🎨 Usage Examples

### Example 1: Apply to Specific Route

```typescript
import { uploadLimiter } from '@middleware/rate-limiter';

// Apply upload limiter to file upload endpoint
router.post('/upload', uploadLimiter, uploadController);
```

### Example 2: Apply to Router

```typescript
import { createLimiter } from '@middleware/rate-limiter';

// Apply create limiter to all routes in this router
router.use(createLimiter);

router.post('/shipment', createShipment);
router.post('/invoice', createInvoice);
```

### Example 3: Combine Multiple Limiters

```typescript
import { authLimiter, createLimiter } from '@middleware/rate-limiter';

// Apply both auth and create limiters
router.post('/signup', authLimiter, createLimiter, signupController);
```

### Example 4: Custom Limiter

```typescript
import rateLimit from 'express-rate-limit';

const customLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50,
  message: 'Custom rate limit message',
  standardHeaders: true,
  legacyHeaders: false,
});

router.use('/custom-route', customLimiter);
```

---

## 🔍 Monitoring & Analytics

### Check Rate Limit Status

Clients can check their rate limit status from response headers:

```javascript
// Frontend example
fetch('/api/shipment')
  .then(response => {
    console.log('Limit:', response.headers.get('RateLimit-Limit'));
    console.log('Remaining:', response.headers.get('RateLimit-Remaining'));
    console.log('Reset:', response.headers.get('RateLimit-Reset'));
  });
```

### Server-side Monitoring

Rate limit violations are logged and can be monitored via:
- Log aggregation tools (e.g., ELK stack)
- Application monitoring (e.g., Sentry, DataDog)
- Custom analytics dashboards

---

## ⚙️ Configuration Options

### Environment Variables (Optional)

Add to `.env` for dynamic configuration:

```env
# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
UPLOAD_RATE_LIMIT_MAX=10
```

### Update Middleware

```typescript
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  // ... other options
});
```

---

## 🧪 Testing Rate Limits

### Test Script

```bash
# Test general limiter (should fail after 100 requests)
for i in {1..105}; do
  curl http://localhost:3000/api/shipment
  echo "Request $i"
done

# Test auth limiter (should fail after 5 failed attempts)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@email.com","password":"wrong"}'
  echo "Attempt $i"
done
```

### Expected Behavior

1. **Requests 1-100:** Normal responses (200, 400, etc.)
2. **Request 101:** `429 Too Many Requests`
3. **After 15 minutes:** Counter resets, requests allowed again

---

## 🚀 Production Considerations

### 1. Behind Reverse Proxy

If behind nginx/Apache, configure trust proxy:

```typescript
// In app.ts
app.set('trust proxy', 1); // Trust first proxy
```

### 2. Redis Store (Recommended for Production)

For distributed systems, use Redis store:

```bash
npm install rate-limit-redis redis
```

```typescript
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

export const generalLimiter = rateLimit({
  store: new RedisStore({
    client: client,
    prefix: 'rl:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

### 3. IP Whitelisting

Whitelist trusted IPs:

```typescript
export const generalLimiter = rateLimit({
  // ... other options
  skip: (req) => {
    const trustedIPs = ['127.0.0.1', '10.0.0.1'];
    return trustedIPs.includes(req.ip || '');
  },
});
```

### 4. Custom Key Generator

Use user ID instead of IP for authenticated routes:

```typescript
export const userLimiter = rateLimit({
  keyGenerator: (req) => {
    return req.user?.id || req.ip || 'anonymous';
  },
  // ... other options
});
```

---

## 📈 Recommended Limits by Endpoint Type

| Endpoint Type | Window | Max Requests | Limiter |
|--------------|--------|--------------|---------|
| Authentication | 15 min | 5 (failed) | authLimiter |
| Password Reset | 1 hour | 3 | passwordResetLimiter |
| File Upload | 1 hour | 10 | uploadLimiter |
| Create Operations | 15 min | 20 | createLimiter |
| Read Operations | 15 min | 200 | readLimiter |
| General API | 15 min | 100 | generalLimiter |
| API Key Access | 15 min | 1000 | apiKeyLimiter |

---

## 🔐 Security Best Practices

1. ✅ **Always apply rate limiting** to authentication endpoints
2. ✅ **Use stricter limits** for sensitive operations
3. ✅ **Log rate limit violations** for security monitoring
4. ✅ **Combine with other security measures** (CORS, helmet, input validation)
5. ✅ **Monitor and adjust limits** based on actual usage patterns
6. ✅ **Use Redis** in production for distributed rate limiting
7. ✅ **Whitelist trusted IPs** if needed
8. ✅ **Return proper HTTP 429** status codes

---

## 📚 Additional Resources

- [express-rate-limit Documentation](https://github.com/express-rate-limit/express-rate-limit)
- [OWASP Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [HTTP 429 Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)

---

**Implemented:** November 13, 2025  
**Package Version:** express-rate-limit@^7.x.x  
**Status:** ✅ Active in Production
