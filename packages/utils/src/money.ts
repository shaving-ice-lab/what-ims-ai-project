/**
 * 金额计算工具函数（基于decimal.js，避免浮点精度问题）
 */

import Decimal from "decimal.js";

// 配置Decimal精度
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
});

/**
 * 精确加法
 * @param a 被加数
 * @param b 加数
 */
export function add(a: number | string, b: number | string): number {
  return new Decimal(a).plus(b).toNumber();
}

/**
 * 精确减法
 * @param a 被减数
 * @param b 减数
 */
export function subtract(a: number | string, b: number | string): number {
  return new Decimal(a).minus(b).toNumber();
}

/**
 * 精确乘法
 * @param a 被乘数
 * @param b 乘数
 */
export function multiply(a: number | string, b: number | string): number {
  return new Decimal(a).times(b).toNumber();
}

/**
 * 精确除法
 * @param a 被除数
 * @param b 除数
 */
export function divide(a: number | string, b: number | string): number {
  if (new Decimal(b).equals(0)) {
    throw new Error("Division by zero");
  }
  return new Decimal(a).dividedBy(b).toNumber();
}

/**
 * 四舍五入到指定小数位
 * @param value 数值
 * @param decimals 小数位数，默认2
 */
export function round(value: number | string, decimals: number = 2): number {
  return new Decimal(value)
    .toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP)
    .toNumber();
}

/**
 * 向上取整到指定小数位
 * @param value 数值
 * @param decimals 小数位数，默认2
 */
export function ceil(value: number | string, decimals: number = 2): number {
  return new Decimal(value)
    .toDecimalPlaces(decimals, Decimal.ROUND_UP)
    .toNumber();
}

/**
 * 向下取整到指定小数位
 * @param value 数值
 * @param decimals 小数位数，默认2
 */
export function floor(value: number | string, decimals: number = 2): number {
  return new Decimal(value)
    .toDecimalPlaces(decimals, Decimal.ROUND_DOWN)
    .toNumber();
}

/** 金额格式化选项 */
export interface FormatMoneyOptions {
  /** 货币符号，默认 ¥ */
  symbol?: string;
  /** 小数位数，默认2 */
  decimals?: number;
  /** 千分位分隔符，默认 , */
  thousandsSeparator?: string;
  /** 小数分隔符，默认 . */
  decimalSeparator?: string;
  /** 是否显示正号，默认false */
  showPlus?: boolean;
}

/**
 * 金额格式化
 * @param amount 金额
 * @param options 格式化选项
 * @example formatMoney(1234.5) // '¥1,234.50'
 * @example formatMoney(1234.5, { symbol: '$' }) // '$1,234.50'
 */
export function formatMoney(
  amount: number | string | null | undefined,
  options: FormatMoneyOptions = {},
): string {
  const {
    symbol = "¥",
    decimals = 2,
    thousandsSeparator = ",",
    decimalSeparator = ".",
    showPlus = false,
  } = options;

  if (amount === null || amount === undefined || amount === "") {
    return `${symbol}0${decimalSeparator}${"0".repeat(decimals)}`;
  }

  const num = new Decimal(amount).toDecimalPlaces(
    decimals,
    Decimal.ROUND_HALF_UP,
  );
  const isNegative = num.isNegative();
  const absNum = num.abs();

  // 分离整数和小数部分
  const [intPart, decPart = ""] = absNum.toFixed(decimals).split(".");

  // 添加千分位分隔符
  const formattedInt = intPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandsSeparator,
  );

  // 组合结果
  let result =
    decimals > 0
      ? `${formattedInt}${decimalSeparator}${decPart.padEnd(decimals, "0")}`
      : formattedInt;

  // 添加符号
  if (isNegative) {
    result = `-${symbol}${result}`;
  } else if (showPlus && num.greaterThan(0)) {
    result = `+${symbol}${result}`;
  } else {
    result = `${symbol}${result}`;
  }

  return result;
}

/**
 * 分转元
 * @param cents 分
 */
export function centsToYuan(cents: number | string): number {
  return divide(cents, 100);
}

/**
 * 元转分
 * @param yuan 元
 */
export function yuanToCents(yuan: number | string): number {
  return round(multiply(yuan, 100), 0);
}

/** 加价规则 */
export interface MarkupRule {
  /** 加价方式：fixed-固定金额，percent-百分比 */
  type: "fixed" | "percent";
  /** 加价值 */
  value: number;
  /** 最低加价金额（百分比时使用） */
  minMarkup?: number;
  /** 最高加价金额（百分比时使用） */
  maxMarkup?: number;
}

/**
 * 计算加价金额
 * @param price 原价
 * @param rule 加价规则
 */
export function calculateMarkup(
  price: number | string,
  rule: MarkupRule,
): number {
  if (rule.type === "fixed") {
    return rule.value;
  }

  // 百分比加价
  let markup = multiply(price, rule.value);

  // 应用最低/最高限制
  if (rule.minMarkup !== undefined && markup < rule.minMarkup) {
    markup = rule.minMarkup;
  }
  if (rule.maxMarkup !== undefined && markup > rule.maxMarkup) {
    markup = rule.maxMarkup;
  }

  return round(markup, 2);
}

/**
 * 计算加价后价格
 * @param price 原价
 * @param rule 加价规则
 */
export function calculateFinalPrice(
  price: number | string,
  rule: MarkupRule,
): number {
  const markup = calculateMarkup(price, rule);
  return round(add(price, markup), 2);
}

/**
 * 计算服务费
 * @param amount 金额
 * @param rate 费率，默认0.003（3‰）
 */
export function calculateServiceFee(
  amount: number | string,
  rate: number = 0.003,
): number {
  return round(multiply(amount, rate), 2);
}

/**
 * 计算订单总金额
 * @param goodsAmount 商品金额
 * @param serviceFeeRate 服务费费率
 */
export function calculateOrderTotal(
  goodsAmount: number | string,
  serviceFeeRate: number = 0.003,
): {
  goodsAmount: number;
  serviceFee: number;
  totalAmount: number;
} {
  const goods = round(goodsAmount, 2);
  const serviceFee = calculateServiceFee(goods, serviceFeeRate);
  const totalAmount = round(add(goods, serviceFee), 2);

  return {
    goodsAmount: goods,
    serviceFee,
    totalAmount,
  };
}

/**
 * 比较两个金额是否相等（考虑精度）
 * @param a 金额1
 * @param b 金额2
 * @param precision 精度，默认2位小数
 */
export function isAmountEqual(
  a: number | string,
  b: number | string,
  precision: number = 2,
): boolean {
  const aRounded = round(a, precision);
  const bRounded = round(b, precision);
  return new Decimal(aRounded).equals(bRounded);
}

/**
 * 判断金额是否大于等于
 * @param a 金额1
 * @param b 金额2
 */
export function isAmountGte(a: number | string, b: number | string): boolean {
  return new Decimal(a).greaterThanOrEqualTo(b);
}

/**
 * 求和
 * @param values 数值数组
 */
export function sum(...values: (number | string)[]): number {
  return values.reduce<number>((acc, val) => add(acc, val), 0);
}

// 导出Decimal类，便于复杂计算
export { Decimal };
