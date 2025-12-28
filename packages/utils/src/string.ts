/**
 * 字符串处理工具函数
 */

/**
 * 手机号脱敏
 * @param phone 手机号
 * @example maskPhone('13812345678') // '138****5678'
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone || phone.length < 7) return phone || "";
  return phone.replace(/(\d{3})\d{4}(\d+)/, "$1****$2");
}

/**
 * 身份证脱敏
 * @param idCard 身份证号
 * @example maskIdCard('110101199001011234') // '110***********1234'
 */
export function maskIdCard(idCard: string | null | undefined): string {
  if (!idCard || idCard.length < 8) return idCard || "";
  return idCard.replace(/(\d{3})\d+(\d{4})/, "$1***********$2");
}

/**
 * 邮箱脱敏
 * @param email 邮箱
 * @example maskEmail('test@example.com') // 't***@example.com'
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email || !email.includes("@")) return email || "";
  const [local, domain] = email.split("@");
  if (local.length <= 1) return email;
  return `${local[0]}***@${domain}`;
}

/**
 * 银行卡号脱敏
 * @param cardNo 银行卡号
 * @example maskBankCard('6222021234567890123') // '6222 **** **** 0123'
 */
export function maskBankCard(cardNo: string | null | undefined): string {
  if (!cardNo || cardNo.length < 8) return cardNo || "";
  const first4 = cardNo.slice(0, 4);
  const last4 = cardNo.slice(-4);
  return `${first4} **** **** ${last4}`;
}

/**
 * API密钥脱敏（显示前4位和后4位）
 * @param key API密钥
 * @example maskApiKey('sk-1234567890abcdef') // 'sk-1****cdef'
 */
export function maskApiKey(key: string | null | undefined): string {
  if (!key || key.length < 8) return key || "";
  const first4 = key.slice(0, 4);
  const last4 = key.slice(-4);
  return `${first4}****${last4}`;
}

/**
 * 字符串截断
 * @param str 字符串
 * @param length 最大长度
 * @param suffix 后缀，默认 '...'
 */
export function truncate(
  str: string | null | undefined,
  length: number,
  suffix: string = "...",
): string {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * 生成订单编号
 * @param prefix 前缀，默认空
 * @example generateOrderNo() // '20240115143025123456'
 */
export function generateOrderNo(prefix: string = ""): string {
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
  const random = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  return `${prefix}${timestamp}${random}`;
}

/**
 * 生成随机字符串
 * @param length 长度
 * @param charset 字符集，默认字母数字
 */
export function generateRandomCode(
  length: number,
  charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * 生成数字验证码
 * @param length 长度，默认6
 */
export function generateNumericCode(length: number = 6): string {
  return generateRandomCode(length, "0123456789");
}

/**
 * 生成UUID v4
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 首字母大写
 * @param str 字符串
 */
export function capitalize(str: string | null | undefined): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 驼峰转下划线
 * @param str 字符串
 * @example camelToSnake('orderStatus') // 'order_status'
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * 下划线转驼峰
 * @param str 字符串
 * @example snakeToCamel('order_status') // 'orderStatus'
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 去除字符串两端空白
 * @param str 字符串
 */
export function trim(str: string | null | undefined): string {
  return str?.trim() || "";
}

/**
 * 判断字符串是否为空
 * @param str 字符串
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim() === "";
}

/**
 * 判断字符串是否不为空
 * @param str 字符串
 */
export function isNotEmpty(str: string | null | undefined): str is string {
  return !isEmpty(str);
}

/**
 * 填充字符串
 * @param str 字符串
 * @param length 目标长度
 * @param char 填充字符
 * @param direction 填充方向
 */
export function pad(
  str: string | number,
  length: number,
  char: string = "0",
  direction: "left" | "right" = "left",
): string {
  const s = String(str);
  if (s.length >= length) return s;
  const padding = char.repeat(length - s.length);
  return direction === "left" ? padding + s : s + padding;
}

/**
 * 解析JSON字符串，失败返回默认值
 * @param jsonStr JSON字符串
 * @param defaultValue 默认值
 */
export function parseJSON<T>(
  jsonStr: string | null | undefined,
  defaultValue: T,
): T {
  if (!jsonStr) return defaultValue;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * 安全的JSON序列化
 * @param value 值
 * @param space 缩进
 */
export function toJSON(value: unknown, space?: number): string {
  try {
    return JSON.stringify(value, null, space);
  } catch {
    return "";
  }
}

/**
 * 转义HTML特殊字符
 * @param str 字符串
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 计算字符串的字节长度（中文算2字节）
 * @param str 字符串
 */
export function byteLength(str: string): number {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    length += str.charCodeAt(i) > 255 ? 2 : 1;
  }
  return length;
}
