import React from 'react';

import { DatePicker, DatePickerProps } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

export type SDatePickerProps = DatePickerProps;
export type SRangePickerProps = RangePickerProps;

export const SDatePicker: React.FC<SDatePickerProps> = ({
  format = 'YYYY-MM-DD',
  placeholder = '请选择日期',
  ...restProps
}) => {
  return <DatePicker format={format} placeholder={placeholder} {...restProps} />;
};

export const SRangePicker: React.FC<SRangePickerProps> = ({
  format = 'YYYY-MM-DD',
  ...restProps
}) => {
  return <DatePicker.RangePicker format={format} {...restProps} />;
};

export default SDatePicker;
