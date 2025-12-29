import * as crypto from 'crypto';

/**
 * 密码哈希（使用PBKDF2）
 */
export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const useSalt = salt || crypto.randomBytes(16).toString('hex');
  
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, useSalt, 10000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      else resolve({
        hash: derivedKey.toString('hex'),
        salt: useSalt,
      });
    });
  });
}

/**
 * 密码验证
 */
export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const result = await hashPassword(password, salt);
  return result.hash === hash;
}

/**
 * 生成HMAC签名
 */
export function generateHmacSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * 验证HMAC签名
 */
export function verifyHmacSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = generateHmacSignature(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

/**
 * AES-256-GCM加密
 */
export function encrypt(text: string, key: string): {
  encrypted: string;
  iv: string;
  authTag: string;
} {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

/**
 * AES-256-GCM解密
 */
export function decrypt(encrypted: string, key: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * 生成随机密钥
 */
export function generateKey(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * MD5哈希
 */
export function md5(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

/**
 * SHA256哈希
 */
export function sha256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Base64编码
 */
export function base64Encode(text: string): string {
  return Buffer.from(text, 'utf8').toString('base64');
}

/**
 * Base64解码
 */
export function base64Decode(encoded: string): string {
  return Buffer.from(encoded, 'base64').toString('utf8');
}

/**
 * 生成RSA密钥对
 */
export function generateRSAKeyPair(): {
  publicKey: string;
  privateKey: string;
} {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  
  return { publicKey, privateKey };
}
