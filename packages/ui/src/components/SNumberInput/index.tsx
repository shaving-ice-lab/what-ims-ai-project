import React from 'react';

import { InputNumber, InputNumberProps } from 'antd';

export interface SNumberInputProps extends InputNumberProps {
  /** 是否显示千分位分隔符 */
  showThousandSeparator?: boolean;
}

export const SNumberInput: React.FC<SNumberInputProps> = ({
  showThousandSeparator = false,
  precision = 2,
  min = 0,
  ...restProps
}) => {
  const formatter = showThousandSeparator
    ? (value: number | string | undefined) =>
        value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
    : undefined;

  const parser = showThousandSeparator
    ? (value: string | undefined) => (value ? value.replace(/,/g, '') : '')
    : undefined;

  return (
    <InputNumber
      precision={precision}
      min={min}
      formatter={formatter}
      parser={parser}
      {...restProps}
    />
  );
};

export default SNumberInput;
