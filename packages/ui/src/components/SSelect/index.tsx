import React from 'react';

import { Select, SelectProps } from 'antd';

export interface SSelectProps extends SelectProps {
  /** 是否显示搜索框，默认true */
  showSearch?: boolean;
}

export const SSelect: React.FC<SSelectProps> = ({
  showSearch = true,
  allowClear = true,
  placeholder = '请选择',
  optionFilterProp = 'label',
  ...restProps
}) => {
  return (
    <Select
      showSearch={showSearch}
      allowClear={allowClear}
      placeholder={placeholder}
      optionFilterProp={optionFilterProp}
      {...restProps}
    />
  );
};

export default SSelect;
