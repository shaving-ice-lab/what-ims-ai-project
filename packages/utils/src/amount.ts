import Decimal from 'decimal.js';

/**
 * 精确加法
 */
export function add(a: number | string, b: number | string): number {
  return new Decimal(a).plus(b).toNumber();
}

/**
 * 精确减法
 */
export function subtract(a: number | string, b: number | string): number {
  return new Decimal(a).minus(b).toNumber();
}

/**
 * 精确乘法
 */
export function multiply(a: number | string, b: number | string): number {
  return new Decimal(a).times(b).toNumber();
}

/**
 * 精确除法
 */
export function divide(a: number | string, b: number | string): number {
  if (new Decimal(b).isZero()) {
    throw new Error('Division by zero');
  }
  return new Decimal(a).dividedBy(b).toNumber();
}

/**
 * 金额格式化
 * @param amount 金额
 * @param options 格式化选项
 */
export function formatMoney(
  amount: number | string,
  options: {
    prefix?: string;
    suffix?: string;
    thousandSeparator?: string;
    decimalSeparator?: string;
    decimals?: number;
  } = {}
): string {
  const {
    prefix = '¥',
    suffix = '',
    thousandSeparator = ',',
    decimalSeparator = '.',
    decimals = 2,
  } = options;

  const decimal = new Decimal(amount);
  const fixed = decimal.toFixed(decimals);
  const parts = fixed.split('.');
  
  // Add thousand separators
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
  // Join with decimal separator
  const formatted = parts.join(decimalSeparator);
  
  return `${prefix}${formatted}${suffix}`;
}

/**
 * 计算加价
 * @param price 原价
 * @param rule 加价规则
 */
export function calculateMarkup(
  price: number | string,
  rule: {
    type: 'fixed' | 'percent';
    value: number;
    minMarkup?: number;
    maxMarkup?: number;
  }
): number {
  const originalPrice = new Decimal(price);
  let markup: Decimal;

  if (rule.type === 'fixed') {
    markup = new Decimal(rule.value);
  } else {
    // Percent markup
    markup = originalPrice.times(rule.value).dividedBy(100);
    
    // Apply min/max limits for percent markup
    if (rule.minMarkup !== undefined && markup.lessThan(rule.minMarkup)) {
      markup = new Decimal(rule.minMarkup);
    }
    if (rule.maxMarkup !== undefined && markup.greaterThan(rule.maxMarkup)) {
      markup = new Decimal(rule.maxMarkup);
    }
  }

  return markup.toNumber();
}

/**
 * 计算服务费
 * @param amount 金额
 * @param rate 费率（如0.003表示0.3%）
 */
export function calculateServiceFee(amount: number | string, rate: number): number {
  return new Decimal(amount).times(rate).toNumber();
}

/**
 * 计算最终价格（原价 + 加价）
 */
export function calculateFinalPrice(originalPrice: number | string, markupAmount: number | string): number {
  return add(originalPrice, markupAmount);
}

/**
 * 计算折扣价格
 * @param originalPrice 原价
 * @param discountRate 折扣率（如0.8表示8折）
 */
export function calculateDiscountPrice(originalPrice: number | string, discountRate: number): number {
  return new Decimal(originalPrice).times(discountRate).toNumber();
}

/**
 * 计算总价
 * @param unitPrice 单价
 * @param quantity 数量
 */
export function calculateTotal(unitPrice: number | string, quantity: number): number {
  return multiply(unitPrice, quantity);
}

/**
 * 比较两个金额
 * @returns 1 if a > b, -1 if a < b, 0 if a = b
 */
export function compareAmount(a: number | string, b: number | string): number {
  const decimalA = new Decimal(a);
  const decimalB = new Decimal(b);
  
  if (decimalA.greaterThan(decimalB)) return 1;
  if (decimalA.lessThan(decimalB)) return -1;
  return 0;
}

/**
 * 四舍五入到指定小数位
 */
export function round(amount: number | string, decimals: number = 2): number {
  return new Decimal(amount).toDecimalPlaces(decimals).toNumber();
}

/**
 * 向上取整到指定小数位
 */
export function ceil(amount: number | string, decimals: number = 2): number {
  return new Decimal(amount).toDecimalPlaces(decimals, Decimal.ROUND_UP).toNumber();
}

/**
 * 向下取整到指定小数位
 */
export function floor(amount: number | string, decimals: number = 2): number {
  return new Decimal(amount).toDecimalPlaces(decimals, Decimal.ROUND_DOWN).toNumber();
}

/**
 * 验证是否为有效的金额
 */
export function isValidAmount(amount: any): boolean {
  if (amount === null || amount === undefined || amount === '') {
    return false;
  }
  
  try {
    const decimal = new Decimal(amount);
    return decimal.isFinite() && !decimal.isNaN() && decimal.greaterThanOrEqualTo(0);
  } catch {
    return false;
  }
}
