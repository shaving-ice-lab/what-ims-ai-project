import { describe, expect, it } from 'vitest';

// Format utilities for testing
const formatCurrency = (amount: number, currency = '¥'): string => {
  return `${currency}${amount.toFixed(2)}`;
};

const formatDate = (date: Date | string, format = 'YYYY-MM-DD'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return format.replace('YYYY', String(year)).replace('MM', month).replace('DD', day);
};

const formatPhone = (phone: string): string => {
  if (phone.length !== 11) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(7)}`;
};

const formatOrderNo = (orderNo: string): string => {
  return orderNo.replace(/(.{4})/g, '$1 ').trim();
};

describe('Format Utilities', () => {
  describe('formatCurrency', () => {
    it('formats number to currency string', () => {
      expect(formatCurrency(100)).toBe('¥100.00');
      expect(formatCurrency(99.9)).toBe('¥99.90');
      expect(formatCurrency(0)).toBe('¥0.00');
    });

    it('supports custom currency symbol', () => {
      expect(formatCurrency(100, '$')).toBe('$100.00');
      expect(formatCurrency(100, '€')).toBe('€100.00');
    });

    it('handles decimal precision', () => {
      expect(formatCurrency(99.999)).toBe('¥100.00');
      expect(formatCurrency(99.994)).toBe('¥99.99');
    });
  });

  describe('formatDate', () => {
    it('formats date to YYYY-MM-DD', () => {
      const date = new Date(2024, 0, 15);
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('formats date string', () => {
      expect(formatDate('2024-01-15')).toBe('2024-01-15');
    });

    it('pads single digit month and day', () => {
      const date = new Date(2024, 0, 5);
      expect(formatDate(date)).toBe('2024-01-05');
    });
  });

  describe('formatPhone', () => {
    it('masks phone number', () => {
      expect(formatPhone('13800138000')).toBe('138****8000');
    });

    it('returns original for invalid length', () => {
      expect(formatPhone('123456')).toBe('123456');
      expect(formatPhone('123456789012')).toBe('123456789012');
    });
  });

  describe('formatOrderNo', () => {
    it('adds spaces every 4 characters', () => {
      expect(formatOrderNo('ORD20240115001')).toBe('ORD2 0240 1150 01');
    });

    it('handles short order numbers', () => {
      expect(formatOrderNo('ORD1')).toBe('ORD1');
    });
  });
});
