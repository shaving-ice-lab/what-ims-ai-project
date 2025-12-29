import React from 'react';

import { Input, InputProps } from 'antd';

export interface SInputProps extends InputProps {
  /** 是否去除首尾空格 */
  trim?: boolean;
}

export const SInput: React.FC<SInputProps> = ({ trim = true, onChange, onBlur, ...restProps }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (trim && e.target.value) {
      e.target.value = e.target.value.trim();
    }
    onBlur?.(e);
  };

  return <Input {...restProps} onChange={handleChange} onBlur={handleBlur} />;
};

// 导出Password和TextArea
export const SInputPassword = Input.Password;
export const STextArea = Input.TextArea;

export default SInput;
