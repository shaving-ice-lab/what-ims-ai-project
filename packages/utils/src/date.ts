/**
 * 日期处理工具函数（基于dayjs）
 */

import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/zh-cn";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";

// 加载插件
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(relativeTime);

// 设置中文
dayjs.locale("zh-cn");

/** 日期格式常量 */
export const DATE_FORMAT = {
  /** 年月日 */
  DATE: "YYYY-MM-DD",
  /** 年月日时分 */
  DATETIME: "YYYY-MM-DD HH:mm",
  /** 年月日时分秒 */
  DATETIME_FULL: "YYYY-MM-DD HH:mm:ss",
  /** 时分 */
  TIME: "HH:mm",
  /** 时分秒 */
  TIME_FULL: "HH:mm:ss",
  /** 年月 */
  MONTH: "YYYY-MM",
  /** 中文日期 */
  DATE_CN: "YYYY年MM月DD日",
  /** 中文日期时间 */
  DATETIME_CN: "YYYY年MM月DD日 HH:mm",
} as const;

/** 日期范围类型 */
export type DateRangeType =
  | "today"
  | "yesterday"
  | "week"
  | "month"
  | "year"
  | "last7days"
  | "last30days";

/**
 * 格式化日期
 * @param date 日期（Date、字符串、时间戳、dayjs对象）
 * @param format 格式化模板，默认 YYYY-MM-DD
 */
export function formatDate(
  date: Date | string | number | Dayjs | null | undefined,
  format: string = DATE_FORMAT.DATE,
): string {
  if (!date) return "";
  return dayjs(date).format(format);
}

/**
 * 格式化日期时间
 * @param date 日期
 * @param full 是否包含秒，默认false
 */
export function formatDateTime(
  date: Date | string | number | Dayjs | null | undefined,
  full: boolean = false,
): string {
  return formatDate(
    date,
    full ? DATE_FORMAT.DATETIME_FULL : DATE_FORMAT.DATETIME,
  );
}

/**
 * 解析日期字符串
 * @param dateStr 日期字符串
 * @param format 格式化模板
 */
export function parseDate(dateStr: string, format?: string): Date | null {
  if (!dateStr) return null;
  const parsed = format ? dayjs(dateStr, format) : dayjs(dateStr);
  return parsed.isValid() ? parsed.toDate() : null;
}

/**
 * 获取相对时间描述
 * @param date 日期
 * @example getRelativeTime('2024-01-01') // '3个月前'
 */
export function getRelativeTime(date: Date | string | number | Dayjs): string {
  return dayjs(date).fromNow();
}

/**
 * 获取日期范围
 * @param type 范围类型
 */
export function getDateRange(type: DateRangeType): {
  startDate: Date;
  endDate: Date;
} {
  const now = dayjs();
  let startDate: Dayjs;
  let endDate: Dayjs = now.endOf("day");

  switch (type) {
    case "today":
      startDate = now.startOf("day");
      break;
    case "yesterday":
      startDate = now.subtract(1, "day").startOf("day");
      endDate = now.subtract(1, "day").endOf("day");
      break;
    case "week":
      startDate = now.startOf("week");
      break;
    case "month":
      startDate = now.startOf("month");
      break;
    case "year":
      startDate = now.startOf("year");
      break;
    case "last7days":
      startDate = now.subtract(6, "day").startOf("day");
      break;
    case "last30days":
      startDate = now.subtract(29, "day").startOf("day");
      break;
    default:
      startDate = now.startOf("day");
  }

  return {
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  };
}

/**
 * 判断是否是配送日
 * @param date 日期
 * @param deliveryDays 配送日数组（1-7代表周一到周日）
 */
export function isDeliveryDay(
  date: Date | string | number | Dayjs,
  deliveryDays: number[],
): boolean {
  if (!deliveryDays || deliveryDays.length === 0) return false;
  // dayjs的day()返回0-6（周日到周六），需要转换
  const dayOfWeek = dayjs(date).day();
  // 转换为1-7格式（周一到周日）
  const weekDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  return deliveryDays.includes(weekDay);
}

/**
 * 获取下一个配送日
 * @param deliveryDays 配送日数组（1-7代表周一到周日）
 * @param fromDate 起始日期，默认今天
 */
export function getNextDeliveryDate(
  deliveryDays: number[],
  fromDate?: Date | string | number | Dayjs,
): Date | null {
  if (!deliveryDays || deliveryDays.length === 0) return null;

  let current = dayjs(fromDate || new Date()).startOf("day");

  // 最多查找7天
  for (let i = 0; i < 7; i++) {
    if (isDeliveryDay(current, deliveryDays)) {
      return current.toDate();
    }
    current = current.add(1, "day");
  }

  return null;
}

/**
 * 判断日期是否在范围内
 * @param date 要判断的日期
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param inclusivity 包含性，默认 '[]' 表示包含两端
 */
export function isDateBetween(
  date: Date | string | number | Dayjs,
  startDate: Date | string | number | Dayjs,
  endDate: Date | string | number | Dayjs,
  inclusivity: "()" | "[]" | "[)" | "(]" = "[]",
): boolean {
  return dayjs(date).isBetween(startDate, endDate, "day", inclusivity);
}

/**
 * 判断日期是否是今天
 */
export function isToday(date: Date | string | number | Dayjs): boolean {
  return dayjs(date).isSame(dayjs(), "day");
}

/**
 * 判断日期是否是过去
 */
export function isPast(date: Date | string | number | Dayjs): boolean {
  return dayjs(date).isBefore(dayjs(), "day");
}

/**
 * 判断日期是否是未来
 */
export function isFuture(date: Date | string | number | Dayjs): boolean {
  return dayjs(date).isAfter(dayjs(), "day");
}

/**
 * 获取两个日期之间的天数差
 */
export function getDaysDiff(
  date1: Date | string | number | Dayjs,
  date2: Date | string | number | Dayjs,
): number {
  return Math.abs(dayjs(date1).diff(dayjs(date2), "day"));
}

/**
 * 添加/减少天数
 */
export function addDays(
  date: Date | string | number | Dayjs,
  days: number,
): Date {
  return dayjs(date).add(days, "day").toDate();
}

/**
 * 获取星期几文本
 */
export function getWeekdayText(date: Date | string | number | Dayjs): string {
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekdays[dayjs(date).day()];
}

/**
 * 获取当前时间戳（毫秒）
 */
export function now(): number {
  return Date.now();
}

/**
 * 获取当前时间戳（秒）
 */
export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

// 导出dayjs实例，便于直接使用
export { dayjs };
