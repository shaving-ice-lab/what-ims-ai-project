/**
 * 通用工具函数
 */

/**
 * 延时函数
 * @param ms 延时毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 重试函数
 * @param fn 要执行的函数
 * @param times 重试次数
 * @param delay 重试间隔（毫秒）
 */
export async function retry<T>(
  fn: () => Promise<T>,
  times: number = 3,
  delay: number = 1000,
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
 * @param fn 要执行的函数
 * @param wait 等待时间（毫秒）
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param wait 等待时间（毫秒）
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let lastTime = 0;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 深拷贝
 * @param obj 对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * 从对象中排除指定键
 * @param obj 对象
 * @param keys 要排除的键
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * 从对象中选取指定键
 * @param obj 对象
 * @param keys 要选取的键
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * 数组去重
 * @param arr 数组
 * @param key 去重键（对象数组时使用）
 */
export function unique<T>(arr: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(arr)];
  }

  const seen = new Set();
  return arr.filter((item) => {
    const k = item[key];
    if (seen.has(k)) {
      return false;
    }
    seen.add(k);
    return true;
  });
}

/**
 * 数组分组
 * @param arr 数组
 * @param key 分组键
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * 数组转Map
 * @param arr 数组
 * @param key 键
 */
export function arrayToMap<T, K extends keyof T>(
  arr: T[],
  key: K,
): Map<T[K], T> {
  return new Map(arr.map((item) => [item[key], item]));
}

/**
 * 数组转对象
 * @param arr 数组
 * @param key 键
 */
export function arrayToObject<T extends object>(
  arr: T[],
  key: keyof T,
): Record<string, T> {
  return arr.reduce(
    (obj, item) => {
      obj[String(item[key])] = item;
      return obj;
    },
    {} as Record<string, T>,
  );
}

/**
 * 树形结构扁平化
 * @param tree 树形数据
 * @param childrenKey 子节点键名
 */
export function flattenTree<T extends object>(
  tree: T[],
  childrenKey: keyof T = "children" as keyof T,
): T[] {
  const result: T[] = [];

  const flatten = (nodes: T[]) => {
    for (const node of nodes) {
      const { [childrenKey]: children, ...rest } = node as T & {
        [key: string]: unknown;
      };
      result.push(rest as T);
      if (Array.isArray(children) && children.length > 0) {
        flatten(children as T[]);
      }
    }
  };

  flatten(tree);
  return result;
}

/**
 * 扁平数组转树形结构
 * @param arr 扁平数组
 * @param options 配置选项
 */
export function arrayToTree<T extends object>(
  arr: T[],
  options: {
    idKey?: keyof T;
    parentKey?: keyof T;
    childrenKey?: string;
    rootValue?: unknown;
  } = {},
): T[] {
  const {
    idKey = "id" as keyof T,
    parentKey = "parentId" as keyof T,
    childrenKey = "children",
    rootValue = null,
  } = options;

  const map = new Map<unknown, T & { [key: string]: unknown }>();
  const result: T[] = [];

  // 先建立映射
  for (const item of arr) {
    map.set(item[idKey], { ...item, [childrenKey]: [] });
  }

  // 构建树
  for (const item of arr) {
    const node = map.get(item[idKey])!;
    const parentId = item[parentKey];

    if (parentId === rootValue || !map.has(parentId)) {
      result.push(node as T);
    } else {
      const parent = map.get(parentId)!;
      (parent[childrenKey] as T[]).push(node as T);
    }
  }

  return result;
}

/**
 * 获取嵌套对象的值
 * @param obj 对象
 * @param path 路径，如 'a.b.c'
 * @param defaultValue 默认值
 */
export function get<T = unknown>(
  obj: unknown,
  path: string,
  defaultValue?: T,
): T | undefined {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return (result === undefined ? defaultValue : result) as T;
}

/**
 * 设置嵌套对象的值
 * @param obj 对象
 * @param path 路径，如 'a.b.c'
 * @param value 值
 */
export function set<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  let current: Record<string, unknown> = obj as Record<string, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return obj;
}

/**
 * 判断两个值是否相等（深比较）
 * @param a 值1
 * @param b 值2
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (
        !isEqual(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key],
        )
      ) {
        return false;
      }
    }

    return true;
  }

  return false;
}

/**
 * 空函数（占位用）
 */
export function noop(): void {
  // do nothing
}

/**
 * 恒等函数
 * @param value 值
 */
export function identity<T>(value: T): T {
  return value;
}
