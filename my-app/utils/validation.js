// Validation utilities for form inputs and data

/**
 * Validates an email address
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  
  // RFC 5322 compliant email regex (simplified but practical)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  if (trimmed.length > 255) {
    return { valid: false, error: 'Email is too long (max 255 characters)' };
  }
  
  return { valid: true };
}

/**
 * Validates a password
 */
export function validatePassword(password, minLength = 6) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { valid: false, error: `Password must be at least ${minLength} characters long` };
  }
  
  if (password.length > 128) {
    return { valid: false, error: 'Password is too long (max 128 characters)' };
  }
  
  return { valid: true };
}

/**
 * Validates that passwords match
 */
export function validatePasswordMatch(password, repeatPassword) {
  if (!password || !repeatPassword) {
    return { valid: false, error: 'Both password fields are required' };
  }
  
  if (password !== repeatPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }
  
  return { valid: true };
}

/**
 * Validates a name (first name, last name)
 */
export function validateName(name, fieldName = 'Name') {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  if (trimmed.length < 2) {
    return { valid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: `${fieldName} is too long (max 50 characters)` };
  }
  
  // Allow only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return { valid: false, error: `${fieldName} contains invalid characters` };
  }
  
  return { valid: true };
}

/**
 * Validates a URL
 */
export function validateURL(url, required = false) {
  if (!url || typeof url !== 'string') {
    if (required) {
      return { valid: false, error: 'URL is required' };
    }
    return { valid: true }; // URL is optional
  }
  
  const trimmed = url.trim();
  if (trimmed.length === 0) {
    if (required) {
      return { valid: false, error: 'URL is required' };
    }
    return { valid: true }; // URL is optional
  }
  
  try {
    const urlObj = new URL(trimmed);
    // Allow http, https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must start with http:// or https://' };
    }
    return { valid: true };
  } catch (e) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validates a time string (HH:MM format)
 */
export function validateTime(time) {
  if (!time || typeof time !== 'string') {
    return { valid: false, error: 'Time is required' };
  }
  
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return { valid: false, error: 'Invalid time format (expected HH:MM)' };
  }
  
  return { valid: true };
}

/**
 * Validates that start time is before end time
 */
export function validateTimeRange(startTime, endTime) {
  const startValidation = validateTime(startTime);
  if (!startValidation.valid) {
    return startValidation;
  }
  
  const endValidation = validateTime(endTime);
  if (!endValidation.valid) {
    return endValidation;
  }
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  
  if (startTotal >= endTotal) {
    return { valid: false, error: 'Start time must be before end time' };
  }
  
  return { valid: true };
}

/**
 * Validates a date object
 */
export function validateDate(date) {
  if (!date) {
    return { valid: false, error: 'Date is required' };
  }
  
  if (!(date instanceof Date)) {
    return { valid: false, error: 'Invalid date object' };
  }
  
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date value' };
  }
  
  return { valid: true };
}

/**
 * Validates that a date is in the future
 */
export function validateFutureDate(date) {
  const dateValidation = validateDate(date);
  if (!dateValidation.valid) {
    return dateValidation;
  }
  
  const now = new Date();
  if (date <= now) {
    return { valid: false, error: 'Date must be in the future' };
  }
  
  return { valid: true };
}

/**
 * Validates a UUID
 */
export function validateUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') {
    return { valid: false, error: 'ID is required' };
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    return { valid: false, error: 'Invalid ID format' };
  }
  
  return { valid: true };
}

/**
 * Validates appointment type
 */
export function validateAppointmentType(type) {
  const validTypes = ['PRIMARY', 'FOLLOW_UP'];
  if (!type || !validTypes.includes(type)) {
    return { valid: false, error: `Invalid appointment type. Must be one of: ${validTypes.join(', ')}` };
  }
  return { valid: true };
}

/**
 * Validates payment type
 */
export function validatePaymentType(paymentType) {
  const validTypes = ['PRIVATE', 'NHIF'];
  if (!paymentType || !validTypes.includes(paymentType)) {
    return { valid: false, error: `Invalid payment type. Must be one of: ${validTypes.join(', ')}` };
  }
  return { valid: true };
}

/**
 * Validates day of week (0-6, where 0 is Sunday)
 */
export function validateDayOfWeek(dayOfWeek) {
  const day = Number(dayOfWeek);
  if (isNaN(day) || day < 0 || day > 6) {
    return { valid: false, error: 'Invalid day of week (must be 0-6)' };
  }
  return { valid: true };
}

/**
 * Sanitizes a string input (trims whitespace)
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') {
    return '';
  }
  return input.trim();
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn('Failed to parse JSON:', e);
    return defaultValue;
  }
}

/**
 * Safely converts a value to a number
 */
export function safeToNumber(value, defaultValue = 0) {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    return defaultValue;
  }
  
  return num;
}

/**
 * Validates that a required field is not empty
 */
export function validateRequired(value, fieldName = 'Field') {
  if (value === null || value === undefined) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim().length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  return { valid: true };
}

