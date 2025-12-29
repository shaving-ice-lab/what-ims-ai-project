import MainLayout from '@/components/layouts/MainLayout';
import { RootState } from '@/store';
import { addItem } from '@/store/slices/cartSlice';
import {
    SearchOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    StarOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Col, Empty, Input, InputNumber, List, message, Modal, Row, Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './materials.module.css';

const { Search } = Input;

interface Material {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  imageUrl?: string;
  skus: MaterialSku[];
}

interface MaterialSku {
  id: number;
  materialId: number;
  materialName: string;
  brand: string;
  spec: string;
  unit: string;
  suppliers: SupplierPrice[];
}

interface SupplierPrice {
  supplierId: number;
  supplierName: string;
  price: number;
  minOrderAmount: number;
  minOrderQuantity: number;
  inStock: boolean;
  deliveryDays: string[];
}

interface Category {
  id: number;
  name: string;
  icon?: string;
  materialCount: number;
}

const StoreMaterials: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => (state.cart as any)?.items || []);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedSku, setSelectedSku] = useState<MaterialSku | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
  }, []);

  const fetchCategories = () => {
    // 模拟API调用
    const mockCategories: Category[] = [
      { id: 1, name: '蔬菜类', icon: '🥬', materialCount: 45 },
      { id: 2, name: '肉类', icon: '🥩', materialCount: 32 },
      { id: 3, name: '水产类', icon: '🐟', materialCount: 28 },
      { id: 4, name: '粮油类', icon: '🌾', materialCount: 36 },
      { id: 5, name: '调味品', icon: '🧂', materialCount: 52 },
      { id: 6, name: '饮料类', icon: '🥤', materialCount: 41 },
      { id: 7, name: '包材类', icon: '📦', materialCount: 23 },
    ];
    setCategories(mockCategories);
  };

  const fetchMaterials = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockMaterials: Material[] = [
        {
          id: 1,
          categoryId: 1,
          categoryName: '蔬菜类',
          name: '西红柿',
          imageUrl: 'https://via.placeholder.com/200',
          skus: [
            {
              id: 1,
              materialId: 1,
              materialName: '西红柿',
              brand: '绿源',
              spec: '500g/盒',
              unit: '盒',
              suppliers: [
                {
                  supplierId: 1,
                  supplierName: '优质生鲜供应',
                  price: 8.5,
                  minOrderAmount: 500,
                  minOrderQuantity: 10,
                  inStock: true,
                  deliveryDays: ['周一', '周三', '周五'],
                },
                {
                  supplierId: 2,
                  supplierName: '上海食品供应商',
                  price: 9.0,
                  minOrderAmount: 300,
                  minOrderQuantity: 5,
                  inStock: true,
                  deliveryDays: ['周二', '周四', '周六'],
                },
              ],
            },
            {
              id: 2,
              materialId: 1,
              materialName: '西红柿',
              brand: '农家',
              spec: '1kg/袋',
              unit: '袋',
              suppliers: [
                {
                  supplierId: 3,
                  supplierName: '新鲜蔬菜直供',
                  price: 15.5,
                  minOrderAmount: 200,
                  minOrderQuantity: 3,
                  inStock: true,
                  deliveryDays: ['每天'],
                },
              ],
            },
          ],
        },
        {
          id: 2,
          categoryId: 1,
          categoryName: '蔬菜类',
          name: '黄瓜',
          imageUrl: 'https://via.placeholder.com/200',
          skus: [
            {
              id: 3,
              materialId: 2,
              materialName: '黄瓜',
              brand: '绿源',
              spec: '500g/袋',
              unit: '袋',
              suppliers: [
                {
                  supplierId: 1,
                  supplierName: '优质生鲜供应',
                  price: 6.0,
                  minOrderAmount: 500,
                  minOrderQuantity: 10,
                  inStock: true,
                  deliveryDays: ['周一', '周三', '周五'],
                },
              ],
            },
          ],
        },
        {
          id: 3,
          categoryId: 2,
          categoryName: '肉类',
          name: '猪里脊肉',
          imageUrl: 'https://via.placeholder.com/200',
          skus: [
            {
              id: 4,
              materialId: 3,
              materialName: '猪里脊肉',
              brand: '双汇',
              spec: '500g/盒',
              unit: '盒',
              suppliers: [
                {
                  supplierId: 1,
                  supplierName: '优质生鲜供应',
                  price: 32.0,
                  minOrderAmount: 500,
                  minOrderQuantity: 5,
                  inStock: true,
                  deliveryDays: ['周一', '周三', '周五'],
                },
                {
                  supplierId: 2,
                  supplierName: '上海食品供应商',
                  price: 30.5,
                  minOrderAmount: 300,
                  minOrderQuantity: 3,
                  inStock: false,
                  deliveryDays: ['周二', '周四', '周六'],
                },
              ],
            },
          ],
        },
      ];
      setMaterials(mockMaterials);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    // 执行搜索逻辑
    fetchMaterials();
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    fetchMaterials();
  };

  const handleMaterialClick = (material: Material) => {
    setSelectedMaterial(material);
    setSelectedSku(material.skus[0] || null);
    setDetailModalVisible(true);
  };

  const handleSkuChange = (sku: MaterialSku) => {
    setSelectedSku(sku);
  };

  const handleQuantityChange = (key: string, value: number) => {
    setQuantities({ ...quantities, [key]: value });
  };

  const handleAddToCart = (supplier: SupplierPrice, sku: MaterialSku, material: Material) => {
    const key = `${supplier.supplierId}_${sku.id}`;
    const quantity = quantities[key] || supplier.minOrderQuantity;
    
    if (quantity < supplier.minOrderQuantity) {
      message.warning(`最少需要订购${supplier.minOrderQuantity}${sku.unit}`);
      return;
    }

    dispatch(addItem({
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      materialId: material.id,
      skuId: sku.id,
      name: material.name,
      brand: sku.brand,
      spec: sku.spec,
      unit: sku.unit,
      price: supplier.price,
      quantity: quantity,
      minOrderQuantity: supplier.minOrderQuantity,
      minOrderAmount: supplier.minOrderAmount,
      imageUrl: material.imageUrl,
    }));

    message.success('已加入购物车');
    setQuantities({ ...quantities, [key]: supplier.minOrderQuantity });
  };

  const getLowestPrice = (material: Material): number => {
    let lowestPrice = Infinity;
    material.skus.forEach(sku => {
      sku.suppliers.forEach(supplier => {
        if (supplier.price < lowestPrice && supplier.inStock) {
          lowestPrice = supplier.price;
        }
      });
    });
    return lowestPrice === Infinity ? 0 : lowestPrice;
  };

  const getSupplierCount = (material: Material): number => {
    const suppliers = new Set<number>();
    material.skus.forEach(sku => {
      sku.suppliers.forEach(supplier => {
        suppliers.add(supplier.supplierId);
      });
    });
    return suppliers.size;
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
  };

  // 过滤材料
  const filteredMaterials = materials.filter(material => {
    const matchCategory = !selectedCategory || material.categoryId === selectedCategory;
    const matchKeyword = !searchKeyword || 
      material.name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchKeyword;
  });

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* 搜索栏和购物车 */}
        <Card className={styles.searchCard}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={20} sm={22}>
              <Search
                placeholder="搜索物料名称或编号"
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                size="large"
              />
            </Col>
            <Col xs={4} sm={2}>
              <Badge count={getCartItemCount()} offset={[-2, 0]}>
                <Button 
                  type="primary" 
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  onClick={() => window.location.href = '/store/cart'}
                />
              </Badge>
            </Col>
          </Row>
        </Card>

        {/* 分类选择 */}
        <Card className={styles.categoryCard}>
          <div className={styles.categoryList}>
            <div 
              className={`${styles.categoryItem} ${!selectedCategory ? styles.active : ''}`}
              onClick={() => handleCategoryChange(null)}
            >
              <div className={styles.categoryIcon}>🏪</div>
              <div className={styles.categoryName}>全部</div>
            </div>
            {categories.map(category => (
              <div 
                key={category.id}
                className={`${styles.categoryItem} ${selectedCategory === category.id ? styles.active : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <div className={styles.categoryIcon}>{category.icon}</div>
                <div className={styles.categoryName}>{category.name}</div>
                <div className={styles.categoryCount}>{category.materialCount}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 物料列表 */}
        <Spin spinning={loading}>
          {filteredMaterials.length === 0 ? (
            <Card>
              <Empty description="暂无物料" />
            </Card>
          ) : (
            <Row gutter={[16, 16]}>
              {filteredMaterials.map(material => {
                const lowestPrice = getLowestPrice(material);
                const supplierCount = getSupplierCount(material);
                
                return (
                  <Col key={material.id} xs={24} sm={12} md={8} lg={6}>
                    <Card 
                      hoverable
                      className={styles.materialCard}
                      onClick={() => handleMaterialClick(material)}
                      cover={
                        <img 
                          alt={material.name} 
                          src={material.imageUrl || 'https://via.placeholder.com/200'} 
                          className={styles.materialImage}
                        />
                      }
                    >
                      <div className={styles.materialInfo}>
                        <h3 className={styles.materialName}>{material.name}</h3>
                        <div className={styles.materialMeta}>
                          <Tag color="blue">{material.categoryName}</Tag>
                          <Tag icon={<ShopOutlined />}>{supplierCount} 供应商</Tag>
                        </div>
                        <div className={styles.materialSpecs}>
                          {material.skus.slice(0, 2).map((sku) => (
                            <div key={sku.id} className={styles.specTag}>
                              {sku.brand} {sku.spec}
                            </div>
                          ))}
                          {material.skus.length > 2 && (
                            <div className={styles.specTag}>+{material.skus.length - 2}规格</div>
                          )}
                        </div>
                        <div className={styles.materialPrice}>
                          {lowestPrice > 0 && (
                            <>
                              <span className={styles.priceLabel}>¥</span>
                              <span className={styles.priceValue}>{lowestPrice.toFixed(2)}</span>
                              <span className={styles.priceUnit}>起</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Spin>

        {/* 物料详情弹窗 */}
        <Modal
          title={selectedMaterial?.name}
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={900}
        >
          {selectedMaterial && selectedSku && (
            <div className={styles.detailModal}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={10}>
                  <img 
                    src={selectedMaterial.imageUrl || 'https://via.placeholder.com/300'} 
                    alt={selectedMaterial.name}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Col>
                <Col xs={24} md={14}>
                  <h2>{selectedMaterial.name}</h2>
                  <Tag color="blue" style={{ marginBottom: 16 }}>{selectedMaterial.categoryName}</Tag>
                  
                  {/* SKU选择 */}
                  {selectedMaterial.skus.length > 1 && (
                    <>
                      <h4>选择规格</h4>
                      <div className={styles.skuList}>
                        {selectedMaterial.skus.map(sku => (
                          <div
                            key={sku.id}
                            className={`${styles.skuItem} ${selectedSku.id === sku.id ? styles.active : ''}`}
                            onClick={() => handleSkuChange(sku)}
                          >
                            <div>{sku.brand}</div>
                            <div>{sku.spec}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* 供应商报价列表 */}
                  <h4 style={{ marginTop: 24 }}>供应商报价</h4>
                  <List
                    dataSource={selectedSku.suppliers}
                    renderItem={supplier => {
                      const key = `${supplier.supplierId}_${selectedSku.id}`;
                      const quantity = quantities[key] || supplier.minOrderQuantity;
                      
                      return (
                        <List.Item className={styles.supplierItem}>
                          <div className={styles.supplierInfo}>
                            <div className={styles.supplierHeader}>
                              <span className={styles.supplierName}>{supplier.supplierName}</span>
                              {!supplier.inStock && <Tag color="red">缺货</Tag>}
                              {supplier.price === Math.min(...selectedSku.suppliers.map(s => s.price)) && (
                                <Tag color="green" icon={<StarOutlined />}>最低价</Tag>
                              )}
                            </div>
                            <div className={styles.supplierDetails}>
                              <div className={styles.priceInfo}>
                                <span className={styles.price}>¥{supplier.price.toFixed(2)}</span>
                                <span className={styles.unit}>/{selectedSku.unit}</span>
                              </div>
                              <div className={styles.orderInfo}>
                                <span>起送价: ¥{supplier.minOrderAmount}</span>
                                <span>起订量: {supplier.minOrderQuantity}{selectedSku.unit}</span>
                                <span>配送: {supplier.deliveryDays.join('、')}</span>
                              </div>
                            </div>
                            <div className={styles.supplierActions}>
                              <InputNumber
                                min={supplier.minOrderQuantity}
                                value={quantity}
                                onChange={(value) => handleQuantityChange(key, value || supplier.minOrderQuantity)}
                                disabled={!supplier.inStock}
                                addonAfter={selectedSku.unit}
                                style={{ width: 150 }}
                              />
                              <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={() => handleAddToCart(supplier, selectedSku, selectedMaterial)}
                                disabled={!supplier.inStock}
                              >
                                加入购物车
                              </Button>
                            </div>
                          </div>
                        </List.Item>
                      );
                    }}
                  />
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default StoreMaterials;
