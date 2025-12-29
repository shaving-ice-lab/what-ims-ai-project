/**
 * 延时函数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  times = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < times - 1) {
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof Array) {
    const cloneArr: any[] = [];
    for (let i = 0; i < obj.length; i++) {
      cloneArr[i] = deepClone(obj[i]);
    }
    return cloneArr as any;
  }
  
  if (obj instanceof Object) {
    const cloneObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloneObj[key] = deepClone(obj[key]);
      }
    }
    return cloneObj;
  }
  
  return obj;
}

/**
 * 对象属性省略
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * 对象属性选取
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * 分组函数
 */
export function groupBy<T>(
  array: T[],
  key: keyof T | ((item: T) => string | number)
): Record<string | number, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    const groupKeyStr = String(groupKey);
    
    if (!groups[groupKeyStr]) {
      groups[groupKeyStr] = [];
    }
    groups[groupKeyStr].push(item);
    
    return groups;
  }, {} as Record<string | number, T[]>);
}

/**
 * 数组去重
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * 数组分块
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 扁平化对象
 */
export function flatten(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flatten(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  
  return result;
}

/**
 * 安全的JSON解析
 */
export function safeJSONParse<T = any>(str: string, defaultValue?: T): T | undefined {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

/**
 * 获取嵌套对象的值
 */
export function get(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }
  
  return result;
}

/**
 * 设置嵌套对象的值
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  
  let current = obj;
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
}
