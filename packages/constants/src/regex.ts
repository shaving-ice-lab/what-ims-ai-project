/**
 * 正则表达式常量
 */

/** 手机号正则（中国大陆） */
export const PHONE_REGEX = /^1[3-9]\d{9}$/;

/** 邮箱正则 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** 身份证正则（18位） */
export const ID_CARD_REGEX = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;

/** 密码正则（8-20位，必须包含字母和数字） */
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/;

/** 弱密码正则（仅数字或仅字母） */
export const WEAK_PASSWORD_REGEX = /^(\d+|[A-Za-z]+)$/;

/** 用户名正则（4-20位，字母数字下划线） */
export const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;

/** URL正则 */
export const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

/** 金额正则（最多两位小数） */
export const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;

/** 正整数正则 */
export const POSITIVE_INTEGER_REGEX = /^[1-9]\d*$/;

/** 非负整数正则 */
export const NON_NEGATIVE_INTEGER_REGEX = /^\d+$/;

/** 订单编号正则（14位时间戳+6位随机数） */
export const ORDER_NO_REGEX = /^\d{20}$/;

/** 中文正则 */
export const CHINESE_REGEX = /[\u4e00-\u9fa5]/;

/** 只包含中文正则 */
export const ONLY_CHINESE_REGEX = /^[\u4e00-\u9fa5]+$/;

/** 条形码正则（EAN-13） */
export const BARCODE_REGEX = /^\d{13}$/;

/** IPv4正则 */
export const IPV4_REGEX = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

/** 微信OpenID正则 */
export const WECHAT_OPENID_REGEX = /^o[A-Za-z0-9_-]{27}$/;

/** 验证函数 */
export const validators = {
  /** 验证手机号 */
  isPhone: (value: string): boolean => PHONE_REGEX.test(value),
  /** 验证邮箱 */
  isEmail: (value: string): boolean => EMAIL_REGEX.test(value),
  /** 验证身份证 */
  isIdCard: (value: string): boolean => ID_CARD_REGEX.test(value),
  /** 验证密码强度 */
  isStrongPassword: (value: string): boolean => PASSWORD_REGEX.test(value) && !WEAK_PASSWORD_REGEX.test(value),
  /** 验证用户名 */
  isUsername: (value: string): boolean => USERNAME_REGEX.test(value),
  /** 验证URL */
  isUrl: (value: string): boolean => URL_REGEX.test(value),
  /** 验证金额 */
  isAmount: (value: string): boolean => AMOUNT_REGEX.test(value),
  /** 验证正整数 */
  isPositiveInteger: (value: string): boolean => POSITIVE_INTEGER_REGEX.test(value),
  /** 验证条形码 */
  isBarcode: (value: string): boolean => BARCODE_REGEX.test(value),
};
