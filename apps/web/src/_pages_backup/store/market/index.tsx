import MainLayout from '@/components/layouts/MainLayout';
import { addItem } from '@/store/slices/cartSlice';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DollarOutlined,
    PercentageOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
    SwapOutlined,
    TrophyOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Checkbox, Col, Empty, Input, InputNumber, message, Modal, Row, Select, Space, Spin, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './market.module.css';

const { Search } = Input;
const { Option } = Select;

interface MarketProduct {
  id: number;
  materialId: number;
  skuId: number;
  name: string;
  brand: string;
  spec: string;
  unit: string;
  categoryId: number;
  categoryName: string;
  imageUrl?: string;
  supplierPrices: SupplierPrice[];
}

interface SupplierPrice {
  supplierId: number;
  supplierName: string;
  displayName: string;
  price: number;
  originalPrice: number;
  markup: number;
  minOrderAmount: number;
  minOrderQuantity: number;
  deliveryDays: string[];
  inStock: boolean;
  isLowest: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface CompareItem {
  productId: number;
  supplierIds: number[];
}

const StoreMarket: React.FC = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(null);
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCategories();
    fetchMarketProducts();
  }, []);

  const fetchCategories = () => {
    // 模拟API调用
    const mockCategories: Category[] = [
      { id: 1, name: '蔬菜类' },
      { id: 2, name: '肉类' },
      { id: 3, name: '水产类' },
      { id: 4, name: '粮油类' },
      { id: 5, name: '调味品' },
    ];
    setCategories(mockCategories);
  };

  const fetchMarketProducts = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockProducts: MarketProduct[] = [
        {
          id: 1,
          materialId: 1,
          skuId: 1,
          name: '西红柿',
          brand: '绿源',
          spec: '500g/盒',
          unit: '盒',
          categoryId: 1,
          categoryName: '蔬菜类',
          imageUrl: 'https://via.placeholder.com/100',
          supplierPrices: [
            {
              supplierId: 1,
              supplierName: '北京生鲜供应商',
              displayName: '优质生鲜供应',
              price: 8.7,
              originalPrice: 8.5,
              markup: 0.2,
              minOrderAmount: 500,
              minOrderQuantity: 10,
              deliveryDays: ['周一', '周三', '周五'],
              inStock: true,
              isLowest: true,
            },
            {
              supplierId: 2,
              supplierName: '上海食品供应商',
              displayName: '上海食品供应商',
              price: 9.3,
              originalPrice: 9.0,
              markup: 0.3,
              minOrderAmount: 300,
              minOrderQuantity: 5,
              deliveryDays: ['周二', '周四', '周六'],
              inStock: true,
              isLowest: false,
            },
            {
              supplierId: 3,
              supplierName: '天津蔬菜供应商',
              displayName: '新鲜蔬菜直供',
              price: 9.8,
              originalPrice: 9.5,
              markup: 0.3,
              minOrderAmount: 200,
              minOrderQuantity: 3,
              deliveryDays: ['每天'],
              inStock: false,
              isLowest: false,
            },
          ],
        },
        {
          id: 2,
          materialId: 2,
          skuId: 3,
          name: '黄瓜',
          brand: '绿源',
          spec: '500g/袋',
          unit: '袋',
          categoryId: 1,
          categoryName: '蔬菜类',
          imageUrl: 'https://via.placeholder.com/100',
          supplierPrices: [
            {
              supplierId: 1,
              supplierName: '北京生鲜供应商',
              displayName: '优质生鲜供应',
              price: 6.2,
              originalPrice: 6.0,
              markup: 0.2,
              minOrderAmount: 500,
              minOrderQuantity: 10,
              deliveryDays: ['周一', '周三', '周五'],
              inStock: true,
              isLowest: false,
            },
            {
              supplierId: 4,
              supplierName: '河北农产品供应商',
              displayName: '河北农产品直供',
              price: 5.8,
              originalPrice: 5.6,
              markup: 0.2,
              minOrderAmount: 400,
              minOrderQuantity: 8,
              deliveryDays: ['周一至周五'],
              inStock: true,
              isLowest: true,
            },
          ],
        },
        {
          id: 3,
          materialId: 3,
          skuId: 4,
          name: '猪里脊肉',
          brand: '双汇',
          spec: '500g/盒',
          unit: '盒',
          categoryId: 2,
          categoryName: '肉类',
          imageUrl: 'https://via.placeholder.com/100',
          supplierPrices: [
            {
              supplierId: 1,
              supplierName: '北京生鲜供应商',
              displayName: '优质生鲜供应',
              price: 32.5,
              originalPrice: 32.0,
              markup: 0.5,
              minOrderAmount: 500,
              minOrderQuantity: 5,
              deliveryDays: ['周一', '周三', '周五'],
              inStock: true,
              isLowest: false,
            },
            {
              supplierId: 2,
              supplierName: '上海食品供应商',
              displayName: '上海食品供应商',
              price: 31.0,
              originalPrice: 30.5,
              markup: 0.5,
              minOrderAmount: 300,
              minOrderQuantity: 3,
              deliveryDays: ['周二', '周四', '周六'],
              inStock: true,
              isLowest: true,
            },
          ],
        },
      ];
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    fetchMarketProducts();
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    fetchMarketProducts();
  };

  const getPriceRange = (product: MarketProduct) => {
    const prices = product.supplierPrices
      .filter(sp => sp.inStock)
      .map(sp => sp.price);
    if (prices.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const getPriceDiffRate = (product: MarketProduct) => {
    const range = getPriceRange(product);
    if (range.min === 0) return 0;
    return ((range.max - range.min) / range.min * 100).toFixed(1);
  };

  const handleAddToCart = (supplier: SupplierPrice, product: MarketProduct) => {
    const key = `${supplier.supplierId}_${product.skuId}`;
    const quantity = quantities[key] || supplier.minOrderQuantity;
    
    dispatch(addItem({
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      materialId: product.materialId,
      skuId: product.skuId,
      name: product.name,
      brand: product.brand,
      spec: product.spec,
      unit: product.unit,
      price: supplier.price,
      quantity: quantity,
      minOrderQuantity: supplier.minOrderQuantity,
      minOrderAmount: supplier.minOrderAmount,
      imageUrl: product.imageUrl,
      subtotal: quantity * supplier.price,
    }));
    
    message.success('已加入购物车');
  };

  const handleQuantityChange = (key: string, value: number) => {
    setQuantities({ ...quantities, [key]: value });
  };

  const handleCompare = (product: MarketProduct) => {
    setSelectedProduct(product);
    setCompareModalVisible(true);
  };

  const handleSupplierSelect = (productId: number, supplierId: number, checked: boolean) => {
    const existingItem = compareItems.find(item => item.productId === productId);
    
    if (existingItem) {
      if (checked) {
        if (existingItem.supplierIds.length >= 3) {
          message.warning('最多选择3个供应商进行对比');
          return;
        }
        existingItem.supplierIds.push(supplierId);
      } else {
        existingItem.supplierIds = existingItem.supplierIds.filter(id => id !== supplierId);
      }
      setCompareItems([...compareItems]);
    } else {
      if (checked) {
        setCompareItems([...compareItems, { productId, supplierIds: [supplierId] }]);
      }
    }
  };

  // 过滤产品
  const filteredProducts = products.filter(product => {
    const matchCategory = !selectedCategory || product.categoryId === selectedCategory;
    const matchKeyword = !searchKeyword || 
      product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchKeyword;
  });

  const columns = [
    {
      title: '供应商',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text: string, record: SupplierPrice) => (
        <div>
          <div>{text}</div>
          {record.isLowest && (
            <Tag color="green" icon={<TrophyOutlined />}>最低价</Tag>
          )}
        </div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: SupplierPrice) => (
        <div>
          <div className={styles.priceValue}>¥{price.toFixed(2)}</div>
          {record.markup > 0 && (
            <div className={styles.priceMarkup}>
              含加价 ¥{record.markup.toFixed(2)}
            </div>
          )}
        </div>
      ),
      sorter: (a: SupplierPrice, b: SupplierPrice) => a.price - b.price,
      defaultSortOrder: 'ascend' as const,
    },
    {
      title: '起送价',
      dataIndex: 'minOrderAmount',
      key: 'minOrderAmount',
      render: (amount: number) => `¥${amount}`,
    },
    {
      title: '起订量',
      dataIndex: 'minOrderQuantity',
      key: 'minOrderQuantity',
      render: (qty: number, record: SupplierPrice) => 
        `${qty}${filteredProducts.find(p => p.supplierPrices.includes(record))?.unit || ''}`,
    },
    {
      title: '配送时间',
      dataIndex: 'deliveryDays',
      key: 'deliveryDays',
      render: (days: string[]) => days.join('、'),
    },
    {
      title: '库存',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (inStock: boolean) => (
        inStock 
          ? <Tag color="green" icon={<CheckCircleOutlined />}>有货</Tag>
          : <Tag color="red" icon={<CloseCircleOutlined />}>缺货</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_text: any, record: SupplierPrice) => {
        const product = filteredProducts.find(p => p.supplierPrices.includes(record));
        if (!product) return null;
        
        const key = `${record.supplierId}_${product.skuId}`;
        const quantity = quantities[key] || record.minOrderQuantity;
        
        return (
          <Space>
            <InputNumber
              min={record.minOrderQuantity}
              value={quantity}
              onChange={(value) => handleQuantityChange(key, value || record.minOrderQuantity)}
              disabled={!record.inStock}
              size="small"
              style={{ width: 80 }}
            />
            <Button
              type="primary"
              size="small"
              icon={<ShoppingCartOutlined />}
              onClick={() => handleAddToCart(record, product)}
              disabled={!record.inStock}
            >
              加购
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* 搜索栏 */}
        <Card className={styles.searchCard}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Search
                placeholder="搜索产品名称或品牌"
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                size="large"
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                placeholder="选择分类"
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{ width: '100%' }}
                size="large"
                allowClear
              >
                <Option value={null}>全部分类</Option>
                {categories.map(cat => (
                  <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <div className={styles.searchTip}>
                <DollarOutlined /> 实时比价，找到最优惠的供应商
              </div>
            </Col>
          </Row>
        </Card>

        {/* 产品列表 */}
        <Spin spinning={loading}>
          {filteredProducts.length === 0 ? (
            <Card>
              <Empty description="暂无产品价格信息" />
            </Card>
          ) : (
            filteredProducts.map(product => {
            const priceRange = getPriceRange(product);
            const priceDiffRate = getPriceDiffRate(product);
            const supplierCount = product.supplierPrices.filter(sp => sp.inStock).length;
            
            return (
              <Card key={product.id} className={styles.productCard}>
                <div className={styles.productHeader}>
                  <div className={styles.productInfo}>
                    <img 
                      src={product.imageUrl || 'https://via.placeholder.com/60'} 
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <div className={styles.productDetails}>
                      <h3>{product.name}</h3>
                      <Space>
                        <Tag>{product.categoryName}</Tag>
                        <span>{product.brand} | {product.spec}</span>
                      </Space>
                    </div>
                  </div>
                  <div className={styles.priceInfo}>
                    <div className={styles.priceRange}>
                      <span className={styles.priceLabel}>价格区间：</span>
                      <span className={styles.priceValue}>
                        ¥{priceRange.min.toFixed(2)} - ¥{priceRange.max.toFixed(2)}
                      </span>
                      {priceDiffRate !== '0.0' && (
                        <Tag color={parseFloat(priceDiffRate as string) > 15 ? 'red' : 'orange'}>
                          <PercentageOutlined /> 差价 {priceDiffRate}%
                        </Tag>
                      )}
                    </div>
                    <div className={styles.supplierCount}>
                      {supplierCount} 个供应商有货
                    </div>
                  </div>
                  <Button
                    icon={<SwapOutlined />}
                    onClick={() => handleCompare(product)}
                  >
                    快速对比
                  </Button>
                </div>
                
                <Table
                  dataSource={product.supplierPrices}
                  columns={columns}
                  rowKey="supplierId"
                  pagination={false}
                  size="small"
                  className={styles.priceTable}
                />
              </Card>
            );
          })
        )}

        {/* 快速对比模态框 */}
        <Modal
          title={`${selectedProduct?.name} - 供应商对比`}
          visible={compareModalVisible}
          onCancel={() => setCompareModalVisible(false)}
          footer={null}
          width={900}
        >
          {selectedProduct && (
            <div className={styles.compareModal}>
              <Alert
                message="选择2-3个供应商进行详细对比"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              
              <div className={styles.compareList}>
                {selectedProduct.supplierPrices.map(supplier => {
                  const compareItem = compareItems.find(item => item.productId === selectedProduct.id);
                  const isSelected = compareItem?.supplierIds.includes(supplier.supplierId);
                  
                  return (
                    <div key={supplier.supplierId} className={styles.compareItem}>
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => handleSupplierSelect(selectedProduct.id, supplier.supplierId, e.target.checked)}
                      />
                      <div className={styles.compareContent}>
                        <div className={styles.compareName}>{supplier.displayName}</div>
                        <div className={styles.compareDetails}>
                          <div>单价：¥{supplier.price.toFixed(2)}</div>
                          <div>起送价：¥{supplier.minOrderAmount}</div>
                          <div>配送：{supplier.deliveryDays.join('、')}</div>
                          <div>库存：{supplier.inStock ? '有货' : '缺货'}</div>
                        </div>
                      </div>
                      {supplier.isLowest && (
                        <Tag color="green">最低价</Tag>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {(compareItems.find(item => item.productId === selectedProduct.id)?.supplierIds.length || 0) >= 2 && (
                <Button
                  type="primary"
                  style={{ marginTop: 16 }}
                  onClick={() => message.info('对比功能开发中')}
                >
                  查看详细对比
                </Button>
              )}
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default StoreMarket;
