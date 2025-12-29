'use client';

/**
 * PriceDisplay - 价格显示组件
 * 显示原价/现价、加价金额高亮、划线价
 */

import { CaretUpOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import Decimal from 'decimal.js';
import React from 'react';

const { Text } = Typography;

export interface PriceDisplayProps {
  /** 当前价格 */
  price: number | string;
  /** 原价（用于显示划线价） */
  originalPrice?: number | string;
  /** 加价金额 */
  markupAmount?: number | string;
  /** 是否显示加价标识 */
  showMarkupIcon?: boolean;
  /** 价格单位 */
  unit?: string;
  /** 尺寸 */
  size?: 'small' | 'default' | 'large';
  /** 是否显示货币符号 */
  showCurrency?: boolean;
  /** 货币符号 */
  currency?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  markupAmount,
  showMarkupIcon = true,
  unit,
  size = 'default',
  showCurrency = true,
  currency = '¥',
}) => {
  const formatPrice = (value: number | string) => {
    const num = new Decimal(value).toFixed(2);
    return showCurrency ? `${currency}${num}` : num;
  };

  const hasMarkup = markupAmount && new Decimal(markupAmount).greaterThan(0);
  const hasOriginalPrice =
    originalPrice && new Decimal(originalPrice).greaterThan(new Decimal(price));

  const fontSizeMap = {
    small: 12,
    default: 14,
    large: 18,
  };

  const fontSize = fontSizeMap[size];

  return (
    <Space size={4} align="baseline">
      {/* 当前价格 */}
      <Text
        strong
        style={{
          fontSize: fontSize + 2,
          color: '#ff4d4f',
        }}
      >
        {formatPrice(price)}
      </Text>

      {/* 单位 */}
      {unit && (
        <Text type="secondary" style={{ fontSize: fontSize - 2 }}>
          /{unit}
        </Text>
      )}

      {/* 加价标识 */}
      {hasMarkup && showMarkupIcon && (
        <Text
          style={{
            fontSize: fontSize - 2,
            color: '#52c41a',
          }}
        >
          <CaretUpOutlined />
          {formatPrice(markupAmount)}
        </Text>
      )}

      {/* 划线价（原价） */}
      {hasOriginalPrice && (
        <Text delete type="secondary" style={{ fontSize: fontSize - 2 }}>
          {formatPrice(originalPrice)}
        </Text>
      )}
    </Space>
  );
};

export default PriceDisplay;
