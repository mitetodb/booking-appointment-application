import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateName,
  validateURL,
  validateTime,
  validateTimeRange,
  validateDate,
  validateFutureDate,
  validateUUID,
  validateAppointmentType,
  validatePaymentType,
  validateDayOfWeek,
  sanitizeString,
  safeJsonParse,
  safeToNumber,
  validateRequired,
} from './validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return valid for a valid email', () => {
      expect(validateEmail('test@example.com')).toEqual({ valid: true });
      expect(validateEmail('user.name@example.co.uk')).toEqual({ valid: true });
    });

    it('should return invalid for empty or missing email', () => {
      expect(validateEmail('')).toEqual({ valid: false, error: 'Email is required' });
      expect(validateEmail(null)).toEqual({ valid: false, error: 'Email is required' });
      expect(validateEmail(undefined)).toEqual({ valid: false, error: 'Email is required' });
      expect(validateEmail('   ')).toEqual({ valid: false, error: 'Email is required' });
    });

    it('should return invalid for invalid email format', () => {
      expect(validateEmail('invalid-email')).toEqual({ valid: false, error: 'Invalid email format' });
      expect(validateEmail('test@')).toEqual({ valid: false, error: 'Invalid email format' });
      expect(validateEmail('@example.com')).toEqual({ valid: false, error: 'Invalid email format' });
      expect(validateEmail('test@example')).toEqual({ valid: false, error: 'Invalid email format' });
    });

    it('should return invalid for email longer than 255 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(validateEmail(longEmail)).toEqual({ valid: false, error: 'Email is too long (max 255 characters)' });
    });
  });

  describe('validatePassword', () => {
    it('should return valid for password with minimum length', () => {
      expect(validatePassword('123456')).toEqual({ valid: true });
      expect(validatePassword('password123')).toEqual({ valid: true });
    });

    it('should return invalid for empty or missing password', () => {
      expect(validatePassword('')).toEqual({ valid: false, error: 'Password is required' });
      expect(validatePassword(null)).toEqual({ valid: false, error: 'Password is required' });
    });

    it('should return invalid for password shorter than minimum length', () => {
      expect(validatePassword('12345')).toEqual({ valid: false, error: 'Password must be at least 6 characters long' });
      expect(validatePassword('abc')).toEqual({ valid: false, error: 'Password must be at least 6 characters long' });
    });

    it('should return invalid for password longer than 128 characters', () => {
      const longPassword = 'a'.repeat(129);
      expect(validatePassword(longPassword)).toEqual({ valid: false, error: 'Password is too long (max 128 characters)' });
    });

    it('should accept custom minimum length', () => {
      expect(validatePassword('1234', 4)).toEqual({ valid: true });
      expect(validatePassword('123', 4)).toEqual({ valid: false, error: 'Password must be at least 4 characters long' });
    });
  });

  describe('validatePasswordMatch', () => {
    it('should return valid when passwords match', () => {
      expect(validatePasswordMatch('password123', 'password123')).toEqual({ valid: true });
    });

    it('should return invalid when passwords do not match', () => {
      expect(validatePasswordMatch('password123', 'password456')).toEqual({ valid: false, error: 'Passwords do not match' });
    });

    it('should return invalid when passwords are missing', () => {
      expect(validatePasswordMatch('', 'password123')).toEqual({ valid: false, error: 'Both password fields are required' });
      expect(validatePasswordMatch('password123', '')).toEqual({ valid: false, error: 'Both password fields are required' });
      expect(validatePasswordMatch(null, null)).toEqual({ valid: false, error: 'Both password fields are required' });
    });
  });

  describe('validateName', () => {
    it('should return valid for valid names', () => {
      expect(validateName('John')).toEqual({ valid: true });
      expect(validateName('Mary-Jane')).toEqual({ valid: true });
      expect(validateName("O'Brien")).toEqual({ valid: true });
      expect(validateName('José')).toEqual({ valid: true });
    });

    it('should return invalid for empty or missing name', () => {
      expect(validateName('')).toEqual({ valid: false, error: 'Name is required' });
      expect(validateName('   ')).toEqual({ valid: false, error: 'Name is required' });
      expect(validateName(null)).toEqual({ valid: false, error: 'Name is required' });
    });

    it('should return invalid for name shorter than 2 characters', () => {
      expect(validateName('A')).toEqual({ valid: false, error: 'Name must be at least 2 characters long' });
    });

    it('should return invalid for name longer than 50 characters', () => {
      const longName = 'A'.repeat(51);
      expect(validateName(longName)).toEqual({ valid: false, error: 'Name is too long (max 50 characters)' });
    });

    it('should return invalid for names with invalid characters', () => {
      expect(validateName('John123')).toEqual({ valid: false, error: 'Name contains invalid characters' });
      expect(validateName('John@Doe')).toEqual({ valid: false, error: 'Name contains invalid characters' });
    });

    it('should use custom field name in error messages', () => {
      expect(validateName('', 'First Name')).toEqual({ valid: false, error: 'First Name is required' });
      expect(validateName('A', 'Last Name')).toEqual({ valid: false, error: 'Last Name must be at least 2 characters long' });
    });
  });

  describe('validateURL', () => {
    it('should return valid for valid URLs', () => {
      expect(validateURL('https://example.com')).toEqual({ valid: true });
      expect(validateURL('http://example.com/path')).toEqual({ valid: true });
      expect(validateURL('https://www.example.com/page?query=value')).toEqual({ valid: true });
    });

    it('should return valid for empty URL when not required', () => {
      expect(validateURL('')).toEqual({ valid: true });
      expect(validateURL(null)).toEqual({ valid: true });
      expect(validateURL('   ')).toEqual({ valid: true });
    });

    it('should return invalid for empty URL when required', () => {
      expect(validateURL('', true)).toEqual({ valid: false, error: 'URL is required' });
      expect(validateURL(null, true)).toEqual({ valid: false, error: 'URL is required' });
    });

    it('should return invalid for invalid URL format', () => {
      expect(validateURL('not-a-url')).toEqual({ valid: false, error: 'Invalid URL format' });
      expect(validateURL('ftp://example.com')).toEqual({ valid: false, error: 'URL must start with http:// or https://' });
    });
  });

  describe('validateTime', () => {
    it('should return valid for valid time formats', () => {
      expect(validateTime('00:00')).toEqual({ valid: true });
      expect(validateTime('09:30')).toEqual({ valid: true });
      expect(validateTime('23:59')).toEqual({ valid: true });
    });

    it('should return invalid for empty or missing time', () => {
      expect(validateTime('')).toEqual({ valid: false, error: 'Time is required' });
      expect(validateTime(null)).toEqual({ valid: false, error: 'Time is required' });
    });

    it('should return invalid for invalid time formats', () => {
      expect(validateTime('25:00')).toEqual({ valid: false, error: 'Invalid time format (expected HH:MM)' });
      expect(validateTime('09:60')).toEqual({ valid: false, error: 'Invalid time format (expected HH:MM)' });
      expect(validateTime('9:30')).toEqual({ valid: false, error: 'Invalid time format (expected HH:MM)' });
      expect(validateTime('09:5')).toEqual({ valid: false, error: 'Invalid time format (expected HH:MM)' });
    });
  });

  describe('validateTimeRange', () => {
    it('should return valid when start time is before end time', () => {
      expect(validateTimeRange('09:00', '17:00')).toEqual({ valid: true });
      expect(validateTimeRange('00:00', '23:59')).toEqual({ valid: true });
    });

    it('should return invalid when start time is after end time', () => {
      expect(validateTimeRange('17:00', '09:00')).toEqual({ valid: false, error: 'Start time must be before end time' });
    });

    it('should return invalid when times are equal', () => {
      expect(validateTimeRange('09:00', '09:00')).toEqual({ valid: false, error: 'Start time must be before end time' });
    });

    it('should validate individual times first', () => {
      expect(validateTimeRange('invalid', '17:00')).toEqual({ valid: false, error: 'Invalid time format (expected HH:MM)' });
      expect(validateTimeRange('09:00', 'invalid')).toEqual({ valid: false, error: 'Invalid time format (expected HH:MM)' });
    });
  });

  describe('validateDate', () => {
    it('should return valid for valid Date objects', () => {
      expect(validateDate(new Date())).toEqual({ valid: true });
      expect(validateDate(new Date('2024-01-01'))).toEqual({ valid: true });
    });

    it('should return invalid for missing date', () => {
      expect(validateDate(null)).toEqual({ valid: false, error: 'Date is required' });
      expect(validateDate(undefined)).toEqual({ valid: false, error: 'Date is required' });
    });

    it('should return invalid for non-Date objects', () => {
      expect(validateDate('2024-01-01')).toEqual({ valid: false, error: 'Invalid date object' });
      expect(validateDate(123456)).toEqual({ valid: false, error: 'Invalid date object' });
    });

    it('should return invalid for invalid Date values', () => {
      expect(validateDate(new Date('invalid'))).toEqual({ valid: false, error: 'Invalid date value' });
    });
  });

  describe('validateFutureDate', () => {
    it('should return valid for future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(validateFutureDate(futureDate)).toEqual({ valid: true });
    });

    it('should return invalid for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(validateFutureDate(pastDate)).toEqual({ valid: false, error: 'Date must be in the future' });
    });

    it('should return invalid for current date', () => {
      const now = new Date();
      expect(validateFutureDate(now)).toEqual({ valid: false, error: 'Date must be in the future' });
    });
  });

  describe('validateUUID', () => {
    it('should return valid for valid UUIDs', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      expect(validateUUID(validUUID)).toEqual({ valid: true });
      expect(validateUUID('00000000-0000-0000-0000-000000000000')).toEqual({ valid: true });
    });

    it('should return invalid for empty or missing UUID', () => {
      expect(validateUUID('')).toEqual({ valid: false, error: 'ID is required' });
      expect(validateUUID(null)).toEqual({ valid: false, error: 'ID is required' });
    });

    it('should return invalid for invalid UUID format', () => {
      expect(validateUUID('not-a-uuid')).toEqual({ valid: false, error: 'Invalid ID format' });
      expect(validateUUID('123e4567-e89b-12d3-a456')).toEqual({ valid: false, error: 'Invalid ID format' });
      expect(validateUUID('123e4567e89b12d3a456426614174000')).toEqual({ valid: false, error: 'Invalid ID format' });
    });

    it('should be case insensitive', () => {
      const uppercaseUUID = '123E4567-E89B-12D3-A456-426614174000';
      expect(validateUUID(uppercaseUUID)).toEqual({ valid: true });
    });
  });

  describe('validateAppointmentType', () => {
    it('should return valid for valid appointment types', () => {
      expect(validateAppointmentType('PRIMARY')).toEqual({ valid: true });
      expect(validateAppointmentType('FOLLOW_UP')).toEqual({ valid: true });
    });

    it('should return invalid for invalid appointment types', () => {
      expect(validateAppointmentType('INVALID')).toEqual({ valid: false, error: 'Invalid appointment type. Must be one of: PRIMARY, FOLLOW_UP' });
      expect(validateAppointmentType('')).toEqual({ valid: false, error: 'Invalid appointment type. Must be one of: PRIMARY, FOLLOW_UP' });
      expect(validateAppointmentType(null)).toEqual({ valid: false, error: 'Invalid appointment type. Must be one of: PRIMARY, FOLLOW_UP' });
    });
  });

  describe('validatePaymentType', () => {
    it('should return valid for valid payment types', () => {
      expect(validatePaymentType('PRIVATE')).toEqual({ valid: true });
      expect(validatePaymentType('NHIF')).toEqual({ valid: true });
    });

    it('should return invalid for invalid payment types', () => {
      expect(validatePaymentType('INVALID')).toEqual({ valid: false, error: 'Invalid payment type. Must be one of: PRIVATE, NHIF' });
      expect(validatePaymentType('')).toEqual({ valid: false, error: 'Invalid payment type. Must be one of: PRIVATE, NHIF' });
      expect(validatePaymentType(null)).toEqual({ valid: false, error: 'Invalid payment type. Must be one of: PRIVATE, NHIF' });
    });
  });

  describe('validateDayOfWeek', () => {
    it('should return valid for valid days (0-6)', () => {
      for (let i = 0; i <= 6; i++) {
        expect(validateDayOfWeek(i)).toEqual({ valid: true });
      }
    });

    it('should return invalid for invalid days', () => {
      expect(validateDayOfWeek(-1)).toEqual({ valid: false, error: 'Invalid day of week (must be 0-6)' });
      expect(validateDayOfWeek(7)).toEqual({ valid: false, error: 'Invalid day of week (must be 0-6)' });
      expect(validateDayOfWeek('invalid')).toEqual({ valid: false, error: 'Invalid day of week (must be 0-6)' });
    });
  });

  describe('sanitizeString', () => {
    it('should trim whitespace from strings', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
      expect(sanitizeString('test\n\t')).toBe('test');
    });

    it('should return empty string for non-string input', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(123)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      expect(safeJsonParse('{"key":"value"}')).toEqual({ key: 'value' });
      expect(safeJsonParse('[1,2,3]')).toEqual([1, 2, 3]);
    });

    it('should return default value for invalid JSON', () => {
      expect(safeJsonParse('invalid json')).toBe(null);
      expect(safeJsonParse('invalid json', {})).toEqual({});
      expect(safeJsonParse('', [])).toEqual([]);
    });
  });

  describe('safeToNumber', () => {
    it('should convert valid numbers', () => {
      expect(safeToNumber('123')).toBe(123);
      expect(safeToNumber(456)).toBe(456);
      expect(safeToNumber('12.34')).toBe(12.34);
    });

    it('should return default value for invalid numbers', () => {
      expect(safeToNumber('invalid')).toBe(0);
      expect(safeToNumber(null)).toBe(0);
      expect(safeToNumber(undefined)).toBe(0);
      expect(safeToNumber('', 42)).toBe(42);
    });
  });

  describe('validateRequired', () => {
    it('should return valid for non-empty values', () => {
      expect(validateRequired('text')).toEqual({ valid: true });
      expect(validateRequired(0)).toEqual({ valid: true });
      expect(validateRequired(false)).toEqual({ valid: true });
      expect(validateRequired([1, 2, 3])).toEqual({ valid: true });
    });

    it('should return invalid for null or undefined', () => {
      expect(validateRequired(null)).toEqual({ valid: false, error: 'Field is required' });
      expect(validateRequired(undefined)).toEqual({ valid: false, error: 'Field is required' });
    });

    it('should return invalid for empty strings', () => {
      expect(validateRequired('')).toEqual({ valid: false, error: 'Field is required' });
      expect(validateRequired('   ')).toEqual({ valid: false, error: 'Field is required' });
    });

    it('should return invalid for empty arrays', () => {
      expect(validateRequired([])).toEqual({ valid: false, error: 'Field is required' });
    });

    it('should use custom field name in error messages', () => {
      expect(validateRequired(null, 'Email')).toEqual({ valid: false, error: 'Email is required' });
      expect(validateRequired('', 'Password')).toEqual({ valid: false, error: 'Password is required' });
    });
  });
});

