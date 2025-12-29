import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from 'dayjs/plugin/weekday';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(isBetween);

/**
 * 格式化日期
 */
export function formatDate(date: string | Date | dayjs.Dayjs, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format);
}

/**
 * 解析日期字符串
 */
export function parseDate(dateStr: string, format?: string): Date {
  if (format) {
    return dayjs(dateStr, format).toDate();
  }
  return dayjs(dateStr).toDate();
}

/**
 * 获取日期范围
 */
export function getDateRange(type: 'today' | 'week' | 'month' | 'year'): {
  start: Date;
  end: Date;
} {
  const now = dayjs();
  let start: dayjs.Dayjs;
  let end: dayjs.Dayjs;

  switch (type) {
    case 'today':
      start = now.startOf('day');
      end = now.endOf('day');
      break;
    case 'week':
      start = now.startOf('week');
      end = now.endOf('week');
      break;
    case 'month':
      start = now.startOf('month');
      end = now.endOf('month');
      break;
    case 'year':
      start = now.startOf('year');
      end = now.endOf('year');
      break;
  }

  return {
    start: start.toDate(),
    end: end.toDate(),
  };
}

/**
 * 判断是否配送日
 * @param date 要判断的日期
 * @param deliveryDays 配送日数组，如[1,3,5]代表周一三五
 */
export function isDeliveryDay(date: string | Date, deliveryDays: number[]): boolean {
  const weekday = dayjs(date).day();
  // dayjs的day()方法：0是周日，1-6是周一到周六
  // 转换为1-7（周一到周日）
  const adjustedWeekday = weekday === 0 ? 7 : weekday;
  return deliveryDays.includes(adjustedWeekday);
}

/**
 * 获取下一个配送日
 * @param deliveryDays 配送日数组，如[1,3,5]代表周一三五
 * @param fromDate 从哪天开始计算，默认今天
 */
export function getNextDeliveryDate(deliveryDays: number[], fromDate?: Date): Date | null {
  if (!deliveryDays || deliveryDays.length === 0) {
    return null;
  }

  const start = dayjs(fromDate || new Date());
  const maxDays = 14; // 最多查找两周

  for (let i = 1; i <= maxDays; i++) {
    const checkDate = start.add(i, 'day');
    if (isDeliveryDay(checkDate.toDate(), deliveryDays)) {
      return checkDate.toDate();
    }
  }

  return null;
}

/**
 * 获取两个日期之间的天数
 */
export function getDaysBetween(startDate: string | Date, endDate: string | Date): number {
  return dayjs(endDate).diff(dayjs(startDate), 'day');
}

/**
 * 判断日期是否在范围内
 */
export function isDateInRange(date: string | Date, startDate: string | Date, endDate: string | Date): boolean {
  return dayjs(date).isBetween(dayjs(startDate), dayjs(endDate), 'day', '[]');
}
