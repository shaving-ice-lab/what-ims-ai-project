/**
 * 数据脱敏工具函数
 */

/**
 * 手机号脱敏
 * 138****8888
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone;
  return phone.replace(/(\d{3})\d{4}(\d+)/, "$1****$2");
}

/**
 * 身份证号脱敏
 * 110***********1234
 */
export function maskIdCard(idCard: string): string {
  if (!idCard || idCard.length < 8) return idCard;
  const len = idCard.length;
  const start = idCard.slice(0, 3);
  const end = idCard.slice(-4);
  return `${start}${"*".repeat(len - 7)}${end}`;
}

/**
 * 邮箱脱敏
 * ab***@example.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [name, domain] = email.split("@");
  if (name.length <= 2) {
    return `${name[0]}***@${domain}`;
  }
  return `${name.slice(0, 2)}***@${domain}`;
}

/**
 * 银行卡号脱敏
 * 6222 **** **** 1234
 */
export function maskBankCard(cardNo: string): string {
  if (!cardNo || cardNo.length < 8) return cardNo;
  const start = cardNo.slice(0, 4);
  const end = cardNo.slice(-4);
  return `${start} **** **** ${end}`;
}

/**
 * 姓名脱敏
 * 张*明 或 张**
 */
export function maskName(name: string): string {
  if (!name || name.length < 2) return name;
  if (name.length === 2) {
    return `${name[0]}*`;
  }
  return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}`;
}

/**
 * 地址脱敏
 * 北京市朝阳区****
 */
export function maskAddress(address: string, keepLength = 8): string {
  if (!address || address.length <= keepLength) return address;
  return `${address.slice(0, keepLength)}****`;
}

/**
 * API密钥脱敏
 * sk-xxxx****xxxx
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return apiKey;
  const start = apiKey.slice(0, 4);
  const end = apiKey.slice(-4);
  return `${start}****${end}`;
}

/**
 * 通用脱敏
 * 保留前后指定位数，中间用*替换
 */
export function maskString(
  str: string,
  keepStart = 3,
  keepEnd = 4,
  maskChar = "*",
): string {
  if (!str || str.length <= keepStart + keepEnd) return str;
  const start = str.slice(0, keepStart);
  const end = str.slice(-keepEnd);
  const maskLength = Math.min(str.length - keepStart - keepEnd, 6);
  return `${start}${maskChar.repeat(maskLength)}${end}`;
}

/**
 * 对象属性脱敏
 * 根据配置自动脱敏对象中的敏感字段
 */
export interface MaskConfig {
  phone?: string[];
  idCard?: string[];
  email?: string[];
  bankCard?: string[];
  name?: string[];
  apiKey?: string[];
  address?: string[];
}

const defaultMaskConfig: MaskConfig = {
  phone: ["phone", "mobile", "tel", "telephone"],
  idCard: ["idCard", "idNumber", "identityCard"],
  email: ["email", "mail"],
  bankCard: ["bankCard", "cardNo", "bankCardNo"],
  name: ["realName", "trueName"],
  apiKey: ["apiKey", "apiSecret", "secretKey", "accessKey"],
  address: ["address", "detailAddress"],
};

export function maskObject<T extends Record<string, unknown>>(
  obj: T,
  config: MaskConfig = defaultMaskConfig,
): T {
  if (!obj || typeof obj !== "object") return obj;

  const result = { ...obj };

  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value !== "string") continue;

    if (config.phone?.includes(key)) {
      (result as Record<string, unknown>)[key] = maskPhone(value);
    } else if (config.idCard?.includes(key)) {
      (result as Record<string, unknown>)[key] = maskIdCard(value);
    } else if (config.email?.includes(key)) {
      (result as Record<string, unknown>)[key] = maskEmail(value);
    } else if (config.bankCard?.includes(key)) {
      (result as Record<string, unknown>)[key] = maskBankCard(value);
    } else if (config.name?.includes(key)) {
      (result as Record<string, unknown>)[key] = maskName(value);
    } else if (config.apiKey?.includes(key)) {
      (result as Record<string, unknown>)[key] = maskApiKey(value);
    } else if (config.address?.includes(key)) {
      (result as Record<string, unknown>)[key] = maskAddress(value);
    }
  }

  return result;
}

/**
 * 脱敏数组中的对象
 */
export function maskArray<T extends Record<string, unknown>>(
  arr: T[],
  config: MaskConfig = defaultMaskConfig,
): T[] {
  if (!Array.isArray(arr)) return arr;
  return arr.map((item) => maskObject(item, config));
}
