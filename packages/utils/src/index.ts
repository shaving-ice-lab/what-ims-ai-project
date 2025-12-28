/**
 * @project/utils - 共享工具函数包
 *
 * 导出所有工具函数，供前后端共享使用
 */

// 日期处理工具
export * from "./date";

// 金额计算工具
export * from "./money";

// 字符串处理工具
export * from "./string";

// 验证工具（排除与string模块重名的函数）
export {
  isValidPhone,
  isValidEmail,
  isValidIdCard,
  isValidPassword,
  getPasswordStrength,
  isValidUsername,
  isValidUrl,
  isPositiveInteger,
  isNonNegative,
  isValidAmount,
  hasDuplicates,
  isLengthBetween,
  isNumberBetween,
  isValidBarcode,
  isNumeric,
  type PasswordStrength,
} from "./validate";
export {
  isEmpty as isEmptyValue,
  isNotEmpty as isNotEmptyValue,
} from "./validate";

// 通用工具
export * from "./common";

// 加密工具（仅Node.js环境可用）
export * from "./crypto";

// 数据脱敏工具（高级脱敏，包含对象和数组脱敏）
export {
  maskName,
  maskAddress,
  maskString,
  maskObject,
  maskArray,
  type MaskConfig,
} from "./mask";
