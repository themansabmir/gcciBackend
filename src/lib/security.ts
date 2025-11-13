/**
 * Security utilities for input sanitization and validation
 * Prevents NoSQL injection and other security vulnerabilities
 */

/**
 * Sanitize user input to prevent NoSQL injection
 * Converts objects to strings and escapes special regex characters
 * 
 * @param input - User-provided input that needs sanitization
 * @returns Sanitized string safe for use in MongoDB queries
 * 
 * @example
 * const safeSearch = sanitizeInput(req.query.search);
 * // Input: { "$ne": null } -> Output: "[object Object]"
 * // Input: "test.*" -> Output: "test\\.\\*"
 */
export function sanitizeInput(input: any): string {
  // Convert non-string inputs to strings (prevents object injection)
  if (typeof input !== 'string') {
    return String(input);
  }
  
  // Escape special regex characters to prevent regex injection
  // Escapes: . * + ? ^ $ { } ( ) | [ ] \
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate that a field name is safe for use in MongoDB queries
 * Only allows alphanumeric characters, underscores, and dots
 * Prevents field injection attacks
 * 
 * @param field - Field name to validate
 * @returns True if field name is safe, false otherwise
 * 
 * @example
 * isValidFieldName('user_name') // true
 * isValidFieldName('user.profile.email') // true
 * isValidFieldName('$where') // false
 * isValidFieldName('user[name]') // false
 */
export function isValidFieldName(field: string): boolean {
  return /^[a-zA-Z0-9_.]+$/.test(field);
}

/**
 * Sanitize and validate pagination parameters
 * Ensures page and limit are positive integers within safe bounds
 * 
 * @param page - Page number from user input
 * @param limit - Items per page from user input
 * @param maxLimit - Maximum allowed limit (default: 100)
 * @returns Sanitized pagination object
 * 
 * @example
 * const { page, limit, skip } = sanitizePagination(req.query.page, req.query.limit);
 */
export function sanitizePagination(
  page: any,
  limit: any,
  maxLimit: number = 100
): { page: number; limit: number; skip: number } {
  const sanitizedPage = Math.max(1, parseInt(String(page), 10) || 1);
  const sanitizedLimit = Math.min(
    maxLimit,
    Math.max(1, parseInt(String(limit), 10) || 10)
  );
  const skip = (sanitizedPage - 1) * sanitizedLimit;

  return {
    page: sanitizedPage,
    limit: sanitizedLimit,
    skip,
  };
}

/**
 * Validate enum value against allowed values
 * Prevents injection of unexpected values
 * 
 * @param value - Value to validate
 * @param allowedValues - Array of allowed values
 * @param fieldName - Name of the field (for error messages)
 * @returns Sanitized value if valid
 * @throws Error if value is not in allowed list
 * 
 * @example
 * const type = validateEnum(req.query.type, ['IMP', 'EXP'], 'shipment_type');
 */
export function validateEnum<T extends string>(
  value: any,
  allowedValues: readonly T[],
  fieldName: string = 'value'
): T {
  const sanitized = String(value);
  
  if (!allowedValues.includes(sanitized as T)) {
    throw new Error(
      `Invalid ${fieldName}. Must be one of: ${allowedValues.join(', ')}`
    );
  }
  
  return sanitized as T;
}

/**
 * Sanitize sort parameters
 * Validates field name and ensures order is either 'asc' or 'desc'
 * 
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order ('asc' or 'desc')
 * @param allowedFields - Optional array of allowed sort fields
 * @returns Sanitized sort object for MongoDB
 * 
 * @example
 * const sort = sanitizeSortParams(req.query.sortBy, req.query.sortOrder, ['name', 'createdAt']);
 */
export function sanitizeSortParams(
  sortBy: any,
  sortOrder: any = 'asc',
  allowedFields?: string[]
): Record<string, 1 | -1> {
  if (!sortBy) {
    return { createdAt: -1 }; // Default sort
  }

  const sanitizedSortBy = String(sortBy);
  
  // Validate field name format
  if (!isValidFieldName(sanitizedSortBy)) {
    throw new Error(`Invalid sort field: ${sanitizedSortBy}`);
  }
  
  // Validate against allowed fields if provided
  if (allowedFields && !allowedFields.includes(sanitizedSortBy)) {
    throw new Error(
      `Sort field must be one of: ${allowedFields.join(', ')}`
    );
  }
  
  // Sanitize sort order
  const sanitizedOrder = String(sortOrder).toLowerCase() === 'desc' ? -1 : 1;
  
  return { [sanitizedSortBy]: sanitizedOrder };
}

/**
 * Remove MongoDB operators from user input
 * Prevents operator injection attacks
 * 
 * @param obj - Object to sanitize
 * @returns Sanitized object without MongoDB operators
 * 
 * @example
 * const safe = removeMongoOperators({ name: 'test', $where: 'malicious' });
 * // Returns: { name: 'test' }
 */
export function removeMongoOperators(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeMongoOperators);
  }

  const sanitized: any = {};
  
  for (const key in obj) {
    // Skip keys that start with $ (MongoDB operators)
    if (!key.startsWith('$')) {
      sanitized[key] = removeMongoOperators(obj[key]);
    }
  }
  
  return sanitized;
}

/**
 * Validate MongoDB ObjectId format
 * Prevents invalid ID injection
 * 
 * @param id - ID to validate
 * @returns True if valid ObjectId format
 * 
 * @example
 * if (!isValidObjectId(req.params.id)) {
 *   throw new Error('Invalid ID format');
 * }
 */
export function isValidObjectId(id: any): boolean {
  if (typeof id !== 'string') {
    return false;
  }
  
  // MongoDB ObjectId is 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Sanitize string for safe use in MongoDB text search
 * Removes special characters that could cause issues
 * 
 * @param text - Text to sanitize
 * @returns Sanitized text
 * 
 * @example
 * const safeText = sanitizeTextSearch(req.query.q);
 */
export function sanitizeTextSearch(text: any): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  // Remove quotes and backslashes that could break text search
  return text.replace(/["\\]/g, '').trim();
}
