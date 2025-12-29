import Decimal from 'decimal.js';

/**
 * 精确加法
 */
export function add(a: number | string, b: number | string): number {
  return new Decimal(a).add(new Decimal(b)).toNumber();
}

/**
 * 精确减法
 */
export function subtract(a: number | string, b: number | string): number {
  return new Decimal(a).minus(new Decimal(b)).toNumber();
}

/**
 * 精确乘法
 */
export function multiply(a: number | string, b: number | string): number {
  return new Decimal(a).mul(new Decimal(b)).toNumber();
}

/**
 * 精确除法
 */
export function divide(a: number | string, b: number | string): number {
  if (new Decimal(b).isZero()) {
    throw new Error('Division by zero');
  }
  return new Decimal(a).div(new Decimal(b)).toNumber();
}

/**
 * 金额格式化
 */
export function formatMoney(
  amount: number | string,
  options: {
    symbol?: string;
    decimals?: number;
    thousandsSeparator?: string;
    decimalSeparator?: string;
  } = {}
): string {
  const {
    symbol = '¥',
    decimals = 2,
    thousandsSeparator = ',',
    decimalSeparator = '.',
  } = options;

  const value = new Decimal(amount).toFixed(decimals);
  const parts = value.split('.');
  
  // 添加千分位
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
  const formatted = parts.join(decimalSeparator);
  
  return symbol ? `${symbol}${formatted}` : formatted;
}

/**
 * 计算加价
 */
export function calculateMarkup(
  price: number | string,
  rule: {
    markupType: 'fixed' | 'percent';
    markupValue: number | string;
    minMarkup?: number | string;
    maxMarkup?: number | string;
  }
): number {
  const priceDecimal = new Decimal(price);
  const markupValue = new Decimal(rule.markupValue);

  let markup: Decimal;

  if (rule.markupType === 'fixed') {
    // 固定加价
    markup = markupValue;
  } else {
    // 百分比加价
    markup = priceDecimal.mul(markupValue);
    
    // 应用最小最大限制
    if (rule.minMarkup !== undefined) {
      const minMarkup = new Decimal(rule.minMarkup);
      if (markup.lessThan(minMarkup)) {
        markup = minMarkup;
      }
    }
    
    if (rule.maxMarkup !== undefined) {
      const maxMarkup = new Decimal(rule.maxMarkup);
      if (markup.greaterThan(maxMarkup)) {
        markup = maxMarkup;
      }
    }
  }

  return markup.toNumber();
}

/**
 * 计算服务费
 */
export function calculateServiceFee(amount: number | string, rate: number | string): number {
  return new Decimal(amount).mul(new Decimal(rate)).toNumber();
}

/**
 * 计算总价
 */
export function calculateTotal(
  items: Array<{
    price: number | string;
    quantity: number;
  }>
): number {
  return items.reduce((total, item) => {
    const itemTotal = multiply(item.price, item.quantity);
    return add(total, itemTotal);
  }, 0);
}

/**
 * 比较金额大小
 */
export function compareMoney(a: number | string, b: number | string): -1 | 0 | 1 {
  const aDecimal = new Decimal(a);
  const bDecimal = new Decimal(b);
  
  if (aDecimal.lessThan(bDecimal)) return -1;
  if (aDecimal.greaterThan(bDecimal)) return 1;
  return 0;
}

/**
 * 金额转换为分（用于支付接口）
 */
export function yuanToCents(yuan: number | string): number {
  return new Decimal(yuan).mul(100).round().toNumber();
}

/**
 * 分转换为元
 */
export function centsToYuan(cents: number | string): number {
  return new Decimal(cents).div(100).toNumber();
}
