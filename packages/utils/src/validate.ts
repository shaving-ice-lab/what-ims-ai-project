/**
 * 验证工具函数
 */

/** 手机号正则（中国大陆） */
const PHONE_REGEX = /^1[3-9]\d{9}$/;

/** 邮箱正则 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** 身份证正则（18位） */
const ID_CARD_REGEX =
  /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;

/** 密码正则（8-20位，必须包含字母和数字） */
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/;

/** 弱密码正则（仅数字或仅字母） */
const WEAK_PASSWORD_REGEX = /^(\d+|[A-Za-z]+)$/;

/** 用户名正则（4-20位，字母开头，可包含字母数字下划线） */
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;

/** URL正则 */
const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

/**
 * 验证手机号
 * @param phone 手机号
 */
export function isValidPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  return PHONE_REGEX.test(phone);
}

/**
 * 验证邮箱
 * @param email 邮箱
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email);
}

/**
 * 验证身份证号
 * @param idCard 身份证号
 */
export function isValidIdCard(idCard: string | null | undefined): boolean {
  if (!idCard) return false;
  if (!ID_CARD_REGEX.test(idCard)) return false;

  // 校验码验证
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i], 10) * weights[i];
  }
  const checkCode = checkCodes[sum % 11];
  return idCard[17].toUpperCase() === checkCode;
}

/** 密码强度等级 */
export type PasswordStrength = "weak" | "medium" | "strong";

/**
 * 验证密码强度
 * @param password 密码
 */
export function isValidPassword(password: string | null | undefined): boolean {
  if (!password) return false;
  return PASSWORD_REGEX.test(password) && !WEAK_PASSWORD_REGEX.test(password);
}

/**
 * 获取密码强度等级
 * @param password 密码
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password || password.length < 8) return "weak";

  let score = 0;

  // 长度评分
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // 字符类型评分
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 3) return "weak";
  if (score <= 5) return "medium";
  return "strong";
}

/**
 * 验证用户名
 * @param username 用户名
 */
export function isValidUsername(username: string | null | undefined): boolean {
  if (!username) return false;
  return USERNAME_REGEX.test(username);
}

/**
 * 验证URL
 * @param url URL
 */
export function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return URL_REGEX.test(url);
}

/**
 * 验证是否为正整数
 * @param value 值
 */
export function isPositiveInteger(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0;
  }
  if (typeof value === "string") {
    const num = parseInt(value, 10);
    return !isNaN(num) && num > 0 && String(num) === value;
  }
  return false;
}

/**
 * 验证是否为非负数
 * @param value 值
 */
export function isNonNegative(value: unknown): boolean {
  if (typeof value === "number") {
    return value >= 0 && isFinite(value);
  }
  if (typeof value === "string") {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
  }
  return false;
}

/**
 * 验证金额格式（最多两位小数）
 * @param amount 金额
 */
export function isValidAmount(
  amount: string | number | null | undefined,
): boolean {
  if (amount === null || amount === undefined || amount === "") return false;
  const str = String(amount);
  return /^\d+(\.\d{1,2})?$/.test(str);
}

/**
 * 验证是否为空
 * @param value 值
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * 验证是否不为空
 * @param value 值
 */
export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value);
}

/**
 * 验证数组是否包含重复元素
 * @param arr 数组
 */
export function hasDuplicates<T>(arr: T[]): boolean {
  return new Set(arr).size !== arr.length;
}

/**
 * 验证字符串长度范围
 * @param str 字符串
 * @param min 最小长度
 * @param max 最大长度
 */
export function isLengthBetween(
  str: string | null | undefined,
  min: number,
  max: number,
): boolean {
  if (!str) return min === 0;
  return str.length >= min && str.length <= max;
}

/**
 * 验证数值范围
 * @param value 数值
 * @param min 最小值
 * @param max 最大值
 */
export function isNumberBetween(
  value: number | null | undefined,
  min: number,
  max: number,
): boolean {
  if (value === null || value === undefined) return false;
  return value >= min && value <= max;
}

/**
 * 验证条形码（EAN-13）
 * @param barcode 条形码
 */
export function isValidBarcode(barcode: string | null | undefined): boolean {
  if (!barcode || barcode.length !== 13) return false;
  if (!/^\d{13}$/.test(barcode)) return false;

  // 校验码验证
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(barcode[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return parseInt(barcode[12], 10) === checkDigit;
}

/**
 * 验证是否为数字
 * @param value 值
 */
export function isNumeric(value: unknown): boolean {
  if (typeof value === "number") return isFinite(value);
  if (typeof value === "string")
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  return false;
}
