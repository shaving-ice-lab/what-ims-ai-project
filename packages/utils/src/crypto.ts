/**
 * 加密工具函数
 *
 * 提供密码哈希、签名验证、加解密等功能
 * 注意：部分函数仅适用于Node.js环境（后端）
 */

import * as crypto from "crypto";

/**
 * 密码哈希配置
 */
const HASH_CONFIG = {
  iterations: 10000,
  keyLength: 64,
  digest: "sha512" as const,
};

/**
 * AES加密配置
 */
const AES_CONFIG = {
  algorithm: "aes-256-gcm" as const,
  ivLength: 16,
  tagLength: 16,
};

/**
 * 生成随机盐值
 * @param length 盐值长度（字节）
 * @returns 十六进制盐值字符串
 */
export function generateSalt(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * 使用PBKDF2进行密码哈希
 * @param password 原始密码
 * @param salt 盐值（可选，不提供则自动生成）
 * @returns 包含盐值和哈希值的对象
 */
export function hashPassword(
  password: string,
  salt?: string,
): { salt: string; hash: string } {
  const actualSalt = salt || generateSalt();
  const hash = crypto
    .pbkdf2Sync(
      password,
      actualSalt,
      HASH_CONFIG.iterations,
      HASH_CONFIG.keyLength,
      HASH_CONFIG.digest,
    )
    .toString("hex");

  return { salt: actualSalt, hash };
}

/**
 * 验证密码
 * @param password 待验证的密码
 * @param storedHash 存储的哈希值
 * @param salt 盐值
 * @returns 密码是否匹配
 */
export function verifyPassword(
  password: string,
  storedHash: string,
  salt: string,
): boolean {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

/**
 * 生成密码哈希（bcrypt风格的单字符串格式）
 * 格式：$pbkdf2$iterations$salt$hash
 * @param password 原始密码
 * @returns 包含所有信息的哈希字符串
 */
export function hashPasswordCompact(password: string): string {
  const { salt, hash } = hashPassword(password);
  return `$pbkdf2$${HASH_CONFIG.iterations}$${salt}$${hash}`;
}

/**
 * 验证密码（bcrypt风格的单字符串格式）
 * @param password 待验证的密码
 * @param hashString 存储的哈希字符串
 * @returns 密码是否匹配
 */
export function verifyPasswordCompact(
  password: string,
  hashString: string,
): boolean {
  const parts = hashString.split("$");
  if (parts.length !== 5 || parts[1] !== "pbkdf2") {
    return false;
  }
  const salt = parts[3];
  const storedHash = parts[4];
  return verifyPassword(password, storedHash, salt);
}

/**
 * 生成HMAC签名
 * @param payload 待签名的数据
 * @param secret 密钥
 * @param algorithm 算法（默认sha256）
 * @returns 签名字符串（十六进制）
 */
export function generateHmacSignature(
  payload: string | object,
  secret: string,
  algorithm: string = "sha256",
): string {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHmac(algorithm, secret).update(data).digest("hex");
}

/**
 * 验证HMAC签名
 * @param payload 原始数据
 * @param signature 待验证的签名
 * @param secret 密钥
 * @param algorithm 算法（默认sha256）
 * @returns 签名是否有效
 */
export function verifyHmacSignature(
  payload: string | object,
  signature: string,
  secret: string,
  algorithm: string = "sha256",
): boolean {
  const expectedSignature = generateHmacSignature(payload, secret, algorithm);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

/**
 * AES-256-GCM加密
 * @param data 待加密的数据
 * @param key 密钥（32字节或64字符十六进制）
 * @returns 加密后的字符串（格式：iv:tag:encrypted）
 */
export function encrypt(data: string, key: string): string {
  const keyBuffer = Buffer.from(
    key.length === 64 ? key : key.padEnd(64, "0"),
    "hex",
  );
  const iv = crypto.randomBytes(AES_CONFIG.ivLength);

  const cipher = crypto.createCipheriv(AES_CONFIG.algorithm, keyBuffer, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
}

/**
 * AES-256-GCM解密
 * @param encryptedData 加密的数据（格式：iv:tag:encrypted）
 * @param key 密钥（32字节或64字符十六进制）
 * @returns 解密后的原始字符串
 */
export function decrypt(encryptedData: string, key: string): string {
  const keyBuffer = Buffer.from(
    key.length === 64 ? key : key.padEnd(64, "0"),
    "hex",
  );
  const parts = encryptedData.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = Buffer.from(parts[0], "hex");
  const tag = Buffer.from(parts[1], "hex");
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(AES_CONFIG.algorithm, keyBuffer, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * 生成安全随机字符串
 * @param length 长度
 * @param charset 字符集（默认字母数字）
 * @returns 随机字符串
 */
export function generateSecureRandom(
  length: number,
  charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
): string {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length];
  }
  return result;
}

/**
 * 生成API密钥
 * @returns 32字符的API密钥
 */
export function generateApiKey(): string {
  return generateSecureRandom(32);
}

/**
 * 生成API密钥对
 * @returns 包含apiKey和apiSecret的对象
 */
export function generateApiKeyPair(): { apiKey: string; apiSecret: string } {
  return {
    apiKey: `ak_${generateSecureRandom(24)}`,
    apiSecret: `sk_${generateSecureRandom(48)}`,
  };
}

/**
 * 计算MD5哈希
 * @param data 数据
 * @returns MD5哈希值
 */
export function md5(data: string): string {
  return crypto.createHash("md5").update(data).digest("hex");
}

/**
 * 计算SHA256哈希
 * @param data 数据
 * @returns SHA256哈希值
 */
export function sha256(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Base64编码
 * @param data 原始字符串
 * @returns Base64编码字符串
 */
export function base64Encode(data: string): string {
  return Buffer.from(data, "utf8").toString("base64");
}

/**
 * Base64解码
 * @param encoded Base64编码字符串
 * @returns 原始字符串
 */
export function base64Decode(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

/**
 * URL安全的Base64编码
 * @param data 原始字符串
 * @returns URL安全的Base64编码字符串
 */
export function base64UrlEncode(data: string): string {
  return base64Encode(data)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * URL安全的Base64解码
 * @param encoded URL安全的Base64编码字符串
 * @returns 原始字符串
 */
export function base64UrlDecode(encoded: string): string {
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return base64Decode(base64);
}
