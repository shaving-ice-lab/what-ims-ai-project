import { describe, expect, it } from 'vitest';
import {
  formatDate,
  getDateRange,
  getDaysBetween,
  getNextDeliveryDate,
  isDateInRange,
  isDeliveryDay,
  parseDate,
} from '../date';

describe('date utils', () => {
  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDate(date);
      expect(result).toMatch(/2024-01-15 10:30:00/);
    });

    it('should format date with custom format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'YYYY/MM/DD');
      expect(result).toBe('2024/01/15');
    });

    it('should handle string input', () => {
      const result = formatDate('2024-01-15', 'YYYY-MM-DD');
      expect(result).toBe('2024-01-15');
    });
  });

  describe('parseDate', () => {
    it('should parse date string', () => {
      const result = parseDate('2024-01-15');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
    });

    it('should parse date with custom format', () => {
      const result = parseDate('15/01/2024', 'DD/MM/YYYY');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(15);
    });
  });

  describe('getDateRange', () => {
    it('should return today range', () => {
      const result = getDateRange('today');
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
      expect(result.start.getTime()).toBeLessThan(result.end.getTime());
    });

    it('should return week range', () => {
      const result = getDateRange('week');
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });

    it('should return month range', () => {
      const result = getDateRange('month');
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });

    it('should return year range', () => {
      const result = getDateRange('year');
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });
  });

  describe('isDeliveryDay', () => {
    it('should return true for delivery day', () => {
      // Monday = 1
      const monday = new Date('2024-01-15'); // This is a Monday
      expect(isDeliveryDay(monday, [1, 3, 5])).toBe(true);
    });

    it('should return false for non-delivery day', () => {
      const tuesday = new Date('2024-01-16'); // This is a Tuesday
      expect(isDeliveryDay(tuesday, [1, 3, 5])).toBe(false);
    });
  });

  describe('getNextDeliveryDate', () => {
    it('should return next delivery date', () => {
      const result = getNextDeliveryDate([1, 3, 5]);
      expect(result).toBeInstanceOf(Date);
    });

    it('should return null for empty delivery days', () => {
      const result = getNextDeliveryDate([]);
      expect(result).toBeNull();
    });
  });

  describe('getDaysBetween', () => {
    it('should calculate days between dates', () => {
      const result = getDaysBetween('2024-01-01', '2024-01-10');
      expect(result).toBe(9);
    });

    it('should return 0 for same date', () => {
      const result = getDaysBetween('2024-01-01', '2024-01-01');
      expect(result).toBe(0);
    });

    it('should return negative for reversed dates', () => {
      const result = getDaysBetween('2024-01-10', '2024-01-01');
      expect(result).toBe(-9);
    });
  });

  describe('isDateInRange', () => {
    it('should return true when date is in range', () => {
      const result = isDateInRange('2024-01-15', '2024-01-01', '2024-01-31');
      expect(result).toBe(true);
    });

    it('should return true for boundary dates', () => {
      expect(isDateInRange('2024-01-01', '2024-01-01', '2024-01-31')).toBe(true);
      expect(isDateInRange('2024-01-31', '2024-01-01', '2024-01-31')).toBe(true);
    });

    it('should return false when date is outside range', () => {
      const result = isDateInRange('2024-02-15', '2024-01-01', '2024-01-31');
      expect(result).toBe(false);
    });
  });
});
