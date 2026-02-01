import { describe, expect, it } from 'vitest';
import {
  add,
  calculateMarkup,
  calculateServiceFee,
  calculateTotal,
  centsToYuan,
  compareMoney,
  divide,
  formatMoney,
  multiply,
  subtract,
  yuanToCents,
} from '../money';

describe('money utils', () => {
  describe('add', () => {
    it('should add two numbers correctly', () => {
      expect(add(0.1, 0.2)).toBe(0.3);
      expect(add(100, 200)).toBe(300);
    });

    it('should handle string inputs', () => {
      expect(add('0.1', '0.2')).toBe(0.3);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers correctly', () => {
      expect(subtract(0.3, 0.1)).toBe(0.2);
      expect(subtract(300, 100)).toBe(200);
    });

    it('should handle negative results', () => {
      expect(subtract(100, 200)).toBe(-100);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      expect(multiply(0.1, 0.2)).toBe(0.02);
      expect(multiply(10, 20)).toBe(200);
    });

    it('should handle decimal multiplication', () => {
      expect(multiply(19.9, 3)).toBe(59.7);
    });
  });

  describe('divide', () => {
    it('should divide two numbers correctly', () => {
      expect(divide(10, 2)).toBe(5);
      expect(divide(100, 3)).toBeCloseTo(33.333, 2);
    });

    it('should throw error for division by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });

  describe('formatMoney', () => {
    it('should format money with default options', () => {
      expect(formatMoney(1234.56)).toBe('¥1,234.56');
    });

    it('should format with custom symbol', () => {
      expect(formatMoney(1234.56, { symbol: '$' })).toBe('$1,234.56');
    });

    it('should format with custom decimals', () => {
      expect(formatMoney(1234.5, { decimals: 0, symbol: '' })).toBe('1,235');
    });

    it('should handle large numbers', () => {
      expect(formatMoney(1234567.89)).toBe('¥1,234,567.89');
    });
  });

  describe('calculateMarkup', () => {
    it('should calculate fixed markup', () => {
      const result = calculateMarkup(100, {
        markupType: 'fixed',
        markupValue: 10,
      });
      expect(result).toBe(10);
    });

    it('should calculate percent markup', () => {
      const result = calculateMarkup(100, {
        markupType: 'percent',
        markupValue: 0.1,
      });
      expect(result).toBe(10);
    });

    it('should apply min markup', () => {
      const result = calculateMarkup(10, {
        markupType: 'percent',
        markupValue: 0.01,
        minMarkup: 5,
      });
      expect(result).toBe(5);
    });

    it('should apply max markup', () => {
      const result = calculateMarkup(1000, {
        markupType: 'percent',
        markupValue: 0.5,
        maxMarkup: 100,
      });
      expect(result).toBe(100);
    });
  });

  describe('calculateServiceFee', () => {
    it('should calculate service fee', () => {
      expect(calculateServiceFee(100, 0.05)).toBe(5);
      expect(calculateServiceFee(200, 0.1)).toBe(20);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total from items', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 20, quantity: 3 },
      ];
      expect(calculateTotal(items)).toBe(80);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });
  });

  describe('compareMoney', () => {
    it('should return -1 when a < b', () => {
      expect(compareMoney(10, 20)).toBe(-1);
    });

    it('should return 1 when a > b', () => {
      expect(compareMoney(20, 10)).toBe(1);
    });

    it('should return 0 when a === b', () => {
      expect(compareMoney(10, 10)).toBe(0);
    });
  });

  describe('yuanToCents', () => {
    it('should convert yuan to cents', () => {
      expect(yuanToCents(10)).toBe(1000);
      expect(yuanToCents(10.5)).toBe(1050);
      expect(yuanToCents(10.99)).toBe(1099);
    });

    it('should round correctly', () => {
      expect(yuanToCents(10.999)).toBe(1100);
    });
  });

  describe('centsToYuan', () => {
    it('should convert cents to yuan', () => {
      expect(centsToYuan(1000)).toBe(10);
      expect(centsToYuan(1050)).toBe(10.5);
      expect(centsToYuan(1099)).toBe(10.99);
    });
  });
});
