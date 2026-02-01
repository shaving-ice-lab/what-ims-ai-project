'use client';

/**
 * MaterialCard - 物料卡片组件
 * 图片展示、名称/规格/价格、加入购物车交互
 */

import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { App, Button, Card, Image, InputNumber, Space, Tag, Typography } from 'antd';
import React, { useState } from 'react';

const { Text, Paragraph } = Typography;

export interface MaterialCardData {
  /** 物料ID */
  id: number;
  /** 物料名称 */
  name: string;
  /** 物料编号 */
  materialNo?: string;
  /** 品牌 */
  brand?: string;
  /** 规格 */
  spec?: string;
  /** 单位 */
  unit?: string;
  /** 图片URL */
  imageUrl?: string;
  /** 价格 */
  price: number;
  /** 原价（用于显示划线价） */
  originalPrice?: number;
  /** 加价金额 */
  markupAmount?: number;
  /** 起订量 */
  minQuantity?: number;
  /** 步进数量 */
  stepQuantity?: number;
  /** 库存状态 */
  stockStatus?: 'in_stock' | 'out_of_stock';
  /** 供应商名称 */
  supplierName?: string;
  /** 供应商ID */
  supplierId?: number;
  /** 分类名称 */
  categoryName?: string;
  /** 是否推荐 */
  isRecommended?: boolean;
}

export interface MaterialCardProps {
  /** 物料数据 */
  material: MaterialCardData;
  /** 是否显示加价标识 */
  showMarkup?: boolean;
  /** 是否显示供应商信息 */
  showSupplier?: boolean;
  /** 是否显示加入购物车按钮 */
  showAddToCart?: boolean;
  /** 加入购物车回调 */
  onAddToCart?: (material: MaterialCardData, quantity: number) => void;
  /** 点击卡片回调 */
  onClick?: (material: MaterialCardData) => void;
  /** 卡片宽度 */
  width?: number | string;
  /** 是否加载中 */
  loading?: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  showMarkup = false,
  showSupplier = false,
  showAddToCart = true,
  onAddToCart,
  onClick,
  width = 240,
  loading = false,
}) => {
  const [quantity, setQuantity] = useState(material.minQuantity || 1);
  const [adding, setAdding] = useState(false);
  const { message } = App.useApp();

  const isOutOfStock = material.stockStatus === 'out_of_stock';
  const hasDiscount = material.originalPrice && material.originalPrice > material.price;

  // 格式化金额
  const formatMoney = (amount: number): string => {
    return `¥${amount.toFixed(2)}`;
  };

  // 处理数量变化
  const handleQuantityChange = (value: number | null) => {
    if (value === null) return;
    const step = material.stepQuantity || 1;
    const min = material.minQuantity || 1;
    // 确保数量符合步进和最小值要求
    const adjustedValue = Math.max(min, Math.ceil(value / step) * step);
    setQuantity(adjustedValue);
  };

  // 增加数量
  const handleIncrease = () => {
    const step = material.stepQuantity || 1;
    setQuantity((prev) => prev + step);
  };

  // 减少数量
  const handleDecrease = () => {
    const step = material.stepQuantity || 1;
    const min = material.minQuantity || 1;
    setQuantity((prev) => Math.max(min, prev - step));
  };

  // 加入购物车
  const handleAddToCart = async () => {
    if (isOutOfStock) {
      message.warning('该商品暂时缺货');
      return;
    }

    setAdding(true);
    try {
      await onAddToCart?.(material, quantity);
      message.success('已加入购物车');
    } catch (error) {
      message.error('加入购物车失败');
    } finally {
      setAdding(false);
    }
  };

  // 渲染价格区域
  const renderPrice = () => (
    <div style={{ marginTop: 8 }}>
      <Space align="baseline">
        <Text strong style={{ fontSize: 18, color: '#f5222d' }}>
          {formatMoney(material.price)}
        </Text>
        {material.unit && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            /{material.unit}
          </Text>
        )}
      </Space>
      {hasDiscount && (
        <Text delete type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
          {formatMoney(material.originalPrice!)}
        </Text>
      )}
      {showMarkup && material.markupAmount !== undefined && material.markupAmount > 0 && (
        <Tag color="orange" style={{ marginLeft: 8 }}>
          🔺+{formatMoney(material.markupAmount)}
        </Tag>
      )}
    </div>
  );

  // 渲染数量选择器
  const renderQuantitySelector = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
      <Button
        size="small"
        icon={<MinusOutlined />}
        onClick={handleDecrease}
        disabled={quantity <= (material.minQuantity || 1)}
      />
      <InputNumber
        size="small"
        min={material.minQuantity || 1}
        step={material.stepQuantity || 1}
        value={quantity}
        onChange={handleQuantityChange}
        style={{ width: 60, margin: '0 4px' }}
        controls={false}
      />
      <Button size="small" icon={<PlusOutlined />} onClick={handleIncrease} />
    </div>
  );

  const cardContent = (
    <Card
      loading={loading}
      hoverable={!!onClick}
      onClick={() => onClick?.(material)}
      style={{ width }}
      cover={
        <div style={{ position: 'relative' }}>
          <Image
            src={material.imageUrl || '/placeholder-image.png'}
            alt={material.name}
            height={180}
            style={{ objectFit: 'cover' }}
            preview={false}
            fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7ml6Dlm77niYc8L3RleHQ+PC9zdmc+"
          />
          {isOutOfStock && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Tag color="error" style={{ fontSize: 14, padding: '4px 12px' }}>
                暂时缺货
              </Tag>
            </div>
          )}
          {material.isRecommended && (
            <Tag
              color="red"
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
              }}
            >
              推荐
            </Tag>
          )}
        </div>
      }
    >
      {/* 物料名称 */}
      <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 4, fontWeight: 500 }}>
        {material.name}
      </Paragraph>

      {/* 品牌/规格 */}
      <Space size={4} wrap>
        {material.brand && <Tag color="blue">{material.brand}</Tag>}
        {material.spec && <Tag>{material.spec}</Tag>}
      </Space>

      {/* 供应商信息 */}
      {showSupplier && material.supplierName && (
        <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 12 }}>
          供应商：{material.supplierName}
        </Text>
      )}

      {/* 价格 */}
      {renderPrice()}

      {/* 起订量提示 */}
      {material.minQuantity && material.minQuantity > 1 && (
        <Text type="secondary" style={{ fontSize: 12 }}>
          起订量：{material.minQuantity}
          {material.unit}
        </Text>
      )}

      {/* 加入购物车区域 */}
      {showAddToCart && (
        <div
          style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}
          onClick={(e) => e.stopPropagation()}
        >
          {renderQuantitySelector()}
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            loading={adding}
            disabled={isOutOfStock}
            block
            style={{ marginTop: 8 }}
          >
            加入购物车
          </Button>
        </div>
      )}
    </Card>
  );

  return cardContent;
};

export default MaterialCard;
