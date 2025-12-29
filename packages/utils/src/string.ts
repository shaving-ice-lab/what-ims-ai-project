/**
 * 手机号脱敏
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 身份证脱敏
 */
export function maskIdCard(idCard: string): string {
  if (!idCard || idCard.length < 15) return idCard;
  const len = idCard.length;
  const start = 3;
  const end = 4;
  return idCard.substring(0, start) + '*'.repeat(len - start - end) + idCard.substring(len - end);
}

/**
 * 字符串截断
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + suffix;
}

/**
 * 生成订单编号
 */
export function generateOrderNo(): string {
  const timestamp = new Date().getTime().toString();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return timestamp + random;
}

/**
 * 生成随机码
 */
export function generateRandomCode(length: number, type: 'number' | 'letter' | 'mixed' = 'mixed'): string {
  let chars = '';
  
  switch (type) {
    case 'number':
      chars = '0123456789';
      break;
    case 'letter':
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      break;
    case 'mixed':
      chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      break;
  }
  
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

/**
 * 生成UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 驼峰转下划线
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * 下划线转驼峰
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 移除HTML标签
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * 转义HTML特殊字符
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
}
