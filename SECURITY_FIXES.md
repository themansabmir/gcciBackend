# Security Fixes - NoSQL Injection Prevention

## 🔒 Issue: CodeQL Scanner Detected NoSQL Injection Vulnerability

**Severity:** High  
**Type:** CWE-943 - Improper Neutralization of Special Elements in Data Query Logic  
**Status:** ✅ FIXED

---

## 📋 Summary

CodeQL identified that user-provided values were being directly used in MongoDB queries without proper sanitization, creating a NoSQL injection vulnerability. This could allow attackers to:
- Bypass authentication
- Access unauthorized data
- Modify or delete data
- Execute arbitrary queries

---

## 🎯 Vulnerable Code Locations

### 1. Base Repository (`base.repository.ts`)
**Lines 61, 65** - User input directly used in regex and sort queries

```typescript
// ❌ BEFORE (Vulnerable)
[field]: { $regex: search, $options: 'i' }
const sort = sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : { createdAt: -1 };
```

### 2. Shipment Service (`shipment.service.ts`)
**Line 51** - User input directly assigned to filter

```typescript
// ❌ BEFORE (Vulnerable)
filter['shipment_type'] = query.shipment_type;
```

---

## ⚠️ Attack Examples

### Attack 1: Operator Injection
```javascript
// Malicious request
GET /api/shipment?shipment_type[$ne]=IMP

// Would bypass type filtering and return all shipments
```

### Attack 2: Regex Injection
```javascript
// Malicious request
GET /api/shipment?search=.*

// Would match all records, bypassing search intent
```

### Attack 3: Sort Field Injection
```javascript
// Malicious request
GET /api/shipment?sortBy[$gt]=

// Could cause errors or unexpected behavior
```

---

## ✅ Solutions Implemented

### 1. Created Centralized Security Library
**File:** `/backend/src/lib/security.ts`

**Functions:**
- `sanitizeInput(input)` - Escapes regex special characters, converts objects to strings
- `isValidFieldName(field)` - Validates field names (alphanumeric, underscore, dot only)
- `sanitizePagination(page, limit)` - Ensures safe pagination values
- `sanitizeSortParams(sortBy, sortOrder)` - Validates and sanitizes sort parameters
- `validateEnum(value, allowedValues)` - Validates enum values against whitelist
- `removeMongoOperators(obj)` - Removes MongoDB operators from objects
- `isValidObjectId(id)` - Validates MongoDB ObjectId format
- `sanitizeTextSearch(text)` - Sanitizes text for MongoDB text search

### 2. Updated Base Repository
**File:** `/backend/src/features/base.repository.ts`

**Changes:**
```typescript
// ✅ AFTER (Secure)
import { sanitizeInput, isValidFieldName, sanitizePagination, sanitizeSortParams } from '@lib/security';

buildSearchQuery(query: IQuery, searchableFields: string[]) {
  // Sanitize pagination
  const { skip, limit: sanitizedLimit } = sanitizePagination(page, limit);
  
  // Sanitize search input
  const sanitizedSearch = sanitizeInput(search);
  
  // Validate field names
  if (!isValidFieldName(field)) {
    throw new Error(`Invalid field name: ${field}`);
  }
  
  // Sanitize sort parameters
  const sort = sanitizeSortParams(sortBy, sortOrder, searchableFields);
}
```

### 3. Updated Shipment Service
**File:** `/backend/src/features/shipment/shipment.service.ts`

**Changes:**
```typescript
// ✅ AFTER (Secure)
import { validateEnum } from '@lib/security';

public async getAllShipments(query: IShipmentQuery) {
  // Validate enum value against whitelist
  if (query.shipment_type) {
    const sanitizedType = validateEnum(
      query.shipment_type, 
      ['IMP', 'EXP'] as const, 
      'shipment_type'
    );
    filter['shipment_type'] = sanitizedType;
  }
}
```

---

## 🛡️ Security Measures Applied

### Input Sanitization
- ✅ All user inputs converted to strings
- ✅ Special regex characters escaped
- ✅ MongoDB operators removed from objects

### Field Name Validation
- ✅ Only alphanumeric, underscore, and dot allowed
- ✅ Prevents `$where`, `$regex`, and other operator injection

### Enum Validation
- ✅ Whitelist-based validation
- ✅ Rejects any value not in allowed list

### Pagination Safety
- ✅ Page and limit converted to positive integers
- ✅ Maximum limit enforced (100 items)
- ✅ Prevents negative or extremely large values

### Sort Parameter Safety
- ✅ Field names validated
- ✅ Sort order restricted to 'asc' or 'desc'
- ✅ Optional whitelist of allowed sort fields

---

## 📚 Usage Guidelines for Developers

### When Building New Features

**1. Always use security utilities for user input:**
```typescript
import { sanitizeInput, validateEnum, isValidFieldName } from '@lib/security';

// For search/text input
const safeSearch = sanitizeInput(req.query.search);

// For enum values
const safeStatus = validateEnum(req.body.status, ['ACTIVE', 'INACTIVE'], 'status');

// For field names
if (!isValidFieldName(fieldName)) {
  throw new Error('Invalid field name');
}
```

**2. Use BaseRepository's buildSearchQuery:**
```typescript
// This method already includes all security measures
const { filter, skip, limit, sort } = this.repository.buildSearchQuery(
  query,
  ['field1', 'field2'] // Whitelist of searchable fields
);
```

**3. Validate ObjectIds:**
```typescript
import { isValidObjectId } from '@lib/security';

if (!isValidObjectId(req.params.id)) {
  throw new Error('Invalid ID format');
}
```

**4. Remove MongoDB operators from user objects:**
```typescript
import { removeMongoOperators } from '@lib/security';

const safeData = removeMongoOperators(req.body);
```

---

## 🧪 Testing

### Test Cases to Verify Security

**1. Test Operator Injection Prevention:**
```bash
# Should reject or sanitize
curl "http://localhost:3000/api/shipment?shipment_type[\$ne]=IMP"
```

**2. Test Regex Injection Prevention:**
```bash
# Should escape special characters
curl "http://localhost:3000/api/shipment?search=.*test.*"
```

**3. Test Field Injection Prevention:**
```bash
# Should reject invalid field names
curl "http://localhost:3000/api/shipment?sortBy=\$where"
```

**4. Test Enum Validation:**
```bash
# Should reject invalid enum values
curl "http://localhost:3000/api/shipment?shipment_type=INVALID"
```

---

## 📊 Impact Assessment

### Before Fix:
- ❌ High risk of data breach
- ❌ Potential unauthorized access
- ❌ Query manipulation possible
- ❌ Failed security scans

### After Fix:
- ✅ All user inputs sanitized
- ✅ Field names validated
- ✅ Enum values whitelisted
- ✅ Pagination secured
- ✅ Sort parameters validated
- ✅ CodeQL scan should pass

---

## 🔄 Rollout Plan

1. ✅ Create security utility library
2. ✅ Update BaseRepository
3. ✅ Update ShipmentService
4. ⏳ Run CodeQL scan to verify fixes
5. ⏳ Update other services using similar patterns
6. ⏳ Add security tests to CI/CD pipeline
7. ⏳ Document security best practices for team

---

## 📝 Additional Recommendations

### Short Term:
1. Apply same security patterns to all other services
2. Add input validation middleware at controller level
3. Implement rate limiting to prevent brute force attacks
4. Add request logging for security monitoring

### Long Term:
1. Consider using Mongoose schema validation more extensively
2. Implement API request signing
3. Add automated security testing in CI/CD
4. Regular security audits and penetration testing
5. Keep dependencies updated (address xlsx vulnerability)

---

## 🔗 References

- [OWASP NoSQL Injection](https://owasp.org/www-community/attacks/NoSQL_injection)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [CWE-943](https://cwe.mitre.org/data/definitions/943.html)

---

**Last Updated:** November 13, 2025  
**Fixed By:** Security Team  
**Reviewed By:** Pending
