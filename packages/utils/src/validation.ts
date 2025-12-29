/**
 * 手机号验证
 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 邮箱验证
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 密码强度验证
 */
export function isValidPassword(password: string, options: {
  minLength?: number;
  requireUpperCase?: boolean;
  requireLowerCase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
} = {}): {
  valid: boolean;
  errors: string[];
} {
  const {
    minLength = 8,
    requireUpperCase = true,
    requireLowerCase = true,
    requireNumber = true,
    requireSpecialChar = false,
  } = options;
  
  const errors: string[] = [];
  
  if (password.length < minLength) {
    errors.push(`密码长度至少${minLength}位`);
  }
  
  if (requireUpperCase && !/[A-Z]/.test(password)) {
    errors.push('密码必须包含大写字母');
  }
  
  if (requireLowerCase && !/[a-z]/.test(password)) {
    errors.push('密码必须包含小写字母');
  }
  
  if (requireNumber && !/\d/.test(password)) {
    errors.push('密码必须包含数字');
  }
  
  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码必须包含特殊字符');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 身份证验证
 */
export function isValidIdCard(idCard: string): boolean {
  // 15位或18位身份证正则
  const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!pattern.test(idCard)) {
    return false;
  }
  
  // 18位身份证校验码验证
  if (idCard.length === 18) {
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const codes = '10X98765432';
    
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard[i]) * weights[i];
    }
    
    const checkCode = codes[sum % 11];
    return idCard[17].toUpperCase() === checkCode;
  }
  
  return true;
}

/**
 * URL验证
 */
export function isValidUrl(url: string): boolean {
  const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return pattern.test(url);
}

/**
 * 统一社会信用代码验证
 */
export function isValidCreditCode(code: string): boolean {
  return /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(code);
}

/**
 * 车牌号验证
 */
export function isValidLicensePlate(plate: string): boolean {
  const pattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/;
  return pattern.test(plate);
}

/**
 * 银行卡号验证（Luhn算法）
 */
export function isValidBankCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * IP地址验证
 */
export function isValidIP(ip: string): boolean {
  // IPv4
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Pattern.test(ip)) {
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part);
      return num >= 0 && num <= 255;
    });
  }
  
  // IPv6
  const ipv6Pattern = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;
  return ipv6Pattern.test(ip);
}

/**
 * 中文姓名验证
 */
export function isValidChineseName(name: string): boolean {
  return /^[\u4e00-\u9fa5]{2,10}$/.test(name);
}

/**
 * 数字验证
 */
export function isNumber(value: string): boolean {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
}

/**
 * 整数验证
 */
export function isInteger(value: string): boolean {
  return /^-?\d+$/.test(value);
}

/**
 * 正整数验证
 */
export function isPositiveInteger(value: string): boolean {
  return /^[1-9]\d*$/.test(value);
}
