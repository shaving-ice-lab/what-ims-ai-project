import { describe, expect, it } from 'vitest';
import {
  isInteger,
  isNumber,
  isPositiveInteger,
  isValidBankCard,
  isValidChineseName,
  isValidCreditCode,
  isValidEmail,
  isValidIdCard,
  isValidIP,
  isValidLicensePlate,
  isValidPassword,
  isValidPhone,
  isValidUrl,
} from '../validation';

describe('validation utils', () => {
  describe('isValidPhone', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhone('13800138000')).toBe(true);
      expect(isValidPhone('15912345678')).toBe(true);
      expect(isValidPhone('18888888888')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('12345678901')).toBe(false); // starts with 1 but second digit < 3
      expect(isValidPhone('1380013800')).toBe(false); // too short
      expect(isValidPhone('138001380001')).toBe(false); // too long
      expect(isValidPhone('23800138000')).toBe(false); // not starting with 1
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate password with default options', () => {
      const result = isValidPassword('Password123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short password', () => {
      const result = isValidPassword('Pass1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密码长度至少8位');
    });

    it('should reject password without uppercase', () => {
      const result = isValidPassword('password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密码必须包含大写字母');
    });

    it('should reject password without lowercase', () => {
      const result = isValidPassword('PASSWORD123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密码必须包含小写字母');
    });

    it('should reject password without number', () => {
      const result = isValidPassword('Passworddd');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密码必须包含数字');
    });

    it('should require special char when option is set', () => {
      const result = isValidPassword('Password123', { requireSpecialChar: true });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密码必须包含特殊字符');
    });
  });

  describe('isValidIdCard', () => {
    it('should validate correct 18-digit ID card', () => {
      // Using test ID numbers (not real)
      expect(isValidIdCard('110101199003077758')).toBe(true);
    });

    it('should reject invalid ID card', () => {
      expect(isValidIdCard('12345678901234567X')).toBe(false);
      expect(isValidIdCard('123')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://www.example.com')).toBe(true);
      expect(isValidUrl('example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
    });
  });

  describe('isValidCreditCode', () => {
    it('should validate correct credit codes', () => {
      expect(isValidCreditCode('91110000100000000X')).toBe(true);
    });

    it('should reject invalid credit codes', () => {
      expect(isValidCreditCode('123456')).toBe(false);
    });
  });

  describe('isValidLicensePlate', () => {
    it('should validate correct license plates', () => {
      expect(isValidLicensePlate('京A12345')).toBe(true);
      expect(isValidLicensePlate('粤B88888')).toBe(true);
    });

    it('should reject invalid license plates', () => {
      expect(isValidLicensePlate('AB12345')).toBe(false);
      expect(isValidLicensePlate('123')).toBe(false);
    });
  });

  describe('isValidBankCard', () => {
    it('should validate correct bank card numbers', () => {
      // Test with a valid Luhn number
      expect(isValidBankCard('4111111111111111')).toBe(true);
    });

    it('should reject invalid bank card numbers', () => {
      expect(isValidBankCard('1234567890123456')).toBe(false);
      expect(isValidBankCard('123')).toBe(false);
    });
  });

  describe('isValidIP', () => {
    it('should validate correct IPv4 addresses', () => {
      expect(isValidIP('192.168.1.1')).toBe(true);
      expect(isValidIP('10.0.0.1')).toBe(true);
      expect(isValidIP('255.255.255.255')).toBe(true);
    });

    it('should reject invalid IPv4 addresses', () => {
      expect(isValidIP('256.1.1.1')).toBe(false);
      expect(isValidIP('192.168.1')).toBe(false);
    });
  });

  describe('isValidChineseName', () => {
    it('should validate correct Chinese names', () => {
      expect(isValidChineseName('张三')).toBe(true);
      expect(isValidChineseName('李四五')).toBe(true);
    });

    it('should reject invalid Chinese names', () => {
      expect(isValidChineseName('张')).toBe(false); // too short
      expect(isValidChineseName('John')).toBe(false); // not Chinese
    });
  });

  describe('isNumber', () => {
    it('should validate numbers', () => {
      expect(isNumber('123')).toBe(true);
      expect(isNumber('123.45')).toBe(true);
      expect(isNumber('-123')).toBe(true);
    });

    it('should reject non-numbers', () => {
      expect(isNumber('abc')).toBe(false);
      expect(isNumber('12abc')).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('should validate integers', () => {
      expect(isInteger('123')).toBe(true);
      expect(isInteger('-456')).toBe(true);
      expect(isInteger('0')).toBe(true);
    });

    it('should reject non-integers', () => {
      expect(isInteger('123.45')).toBe(false);
      expect(isInteger('abc')).toBe(false);
    });
  });

  describe('isPositiveInteger', () => {
    it('should validate positive integers', () => {
      expect(isPositiveInteger('123')).toBe(true);
      expect(isPositiveInteger('1')).toBe(true);
    });

    it('should reject non-positive integers', () => {
      expect(isPositiveInteger('0')).toBe(false);
      expect(isPositiveInteger('-1')).toBe(false);
      expect(isPositiveInteger('1.5')).toBe(false);
    });
  });
});
