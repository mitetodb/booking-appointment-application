import { describe, it, expect } from 'vitest';
import {
  getLocaleFromLanguage,
  toLocalDateTimeString,
  toDateInputValue,
} from './dateUtils';

describe('Date Utilities', () => {
  describe('getLocaleFromLanguage', () => {
    it('should return correct locale for supported languages', () => {
      expect(getLocaleFromLanguage('bg')).toBe('bg-BG');
      expect(getLocaleFromLanguage('en')).toBe('en-GB');
      expect(getLocaleFromLanguage('de')).toBe('de-DE');
    });

    it('should return default locale for unsupported languages', () => {
      expect(getLocaleFromLanguage('fr')).toBe('en-GB');
      expect(getLocaleFromLanguage('unknown')).toBe('en-GB');
    });

    it('should return default locale for invalid input', () => {
      expect(getLocaleFromLanguage(null)).toBe('en-GB');
      expect(getLocaleFromLanguage(undefined)).toBe('en-GB');
      expect(getLocaleFromLanguage('')).toBe('en-GB');
      expect(getLocaleFromLanguage(123)).toBe('en-GB');
    });
  });

  describe('toLocalDateTimeString', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T14:30:45');
      const result = toLocalDateTimeString(date);
      expect(result).toBe('2024-01-15T14:30:45');
    });

    it('should format date with single digit values correctly', () => {
      const date = new Date('2024-01-05T09:05:03');
      const result = toLocalDateTimeString(date);
      expect(result).toBe('2024-01-05T09:05:03');
    });

    it('should handle Date object created from string', () => {
      const date = new Date('2024-12-25T00:00:00');
      const result = toLocalDateTimeString(date);
      expect(result).toBe('2024-12-25T00:00:00');
    });

    it('should handle date string input', () => {
      const result = toLocalDateTimeString('2024-01-15T14:30:45');
      expect(result).toBe('2024-01-15T14:30:45');
    });

    it('should handle timestamp input', () => {
      const timestamp = new Date('2024-01-15T14:30:45').getTime();
      const result = toLocalDateTimeString(timestamp);
      expect(result).toMatch(/2024-01-15T14:30:45/);
    });

    it('should throw error for null or undefined', () => {
      expect(() => toLocalDateTimeString(null)).toThrow();
      expect(() => toLocalDateTimeString(undefined)).toThrow();
    });

    it('should throw error for invalid date', () => {
      expect(() => toLocalDateTimeString(new Date('invalid'))).toThrow();
      expect(() => toLocalDateTimeString('invalid-date')).toThrow();
    });

    it('should throw error for invalid input type', () => {
      expect(() => toLocalDateTimeString({})).toThrow();
      expect(() => toLocalDateTimeString([])).toThrow();
    });
  });

  describe('toDateInputValue', () => {
    it('should format Date object to YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T14:30:45');
      const result = toDateInputValue(date);
      expect(result).toBe('2024-01-15');
    });

    it('should format date with single digit month and day', () => {
      const date = new Date('2024-01-05T00:00:00');
      const result = toDateInputValue(date);
      expect(result).toBe('2024-01-05');
    });

    it('should handle date at end of year', () => {
      const date = new Date('2024-12-31T23:59:59');
      const result = toDateInputValue(date);
      expect(result).toBe('2024-12-31');
    });

    it('should handle date string input', () => {
      const result = toDateInputValue('2024-01-15');
      expect(result).toBe('2024-01-15');
    });

    it('should throw error for null or undefined', () => {
      expect(() => toDateInputValue(null)).toThrow();
      expect(() => toDateInputValue(undefined)).toThrow();
    });

    it('should throw error for invalid date', () => {
      expect(() => toDateInputValue(new Date('invalid'))).toThrow();
      expect(() => toDateInputValue('invalid-date')).toThrow();
    });
  });
});

