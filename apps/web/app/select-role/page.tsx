'use client';

import React from 'react';
import { Card, Row, Col, Button, Typography, message } from 'antd';
import { UserOutlined, ShopOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectRole } from '@/store/slices/userSlice';
import { RootState } from '@/store';
import { http } from '@/utils/request';
import styles from './select-role.module.css';

const { Title, Text } = Typography;

const roleIcons: Record<string, React.ReactNode> = {
  admin: <SettingOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
  sub_admin: <SettingOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
  supplier: <ShopOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
  store: <HomeOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
};

const roleNames: Record<string, string> = {
  admin: '主管理员',
  sub_admin: '子管理员',
  supplier: '供应商',
  store: '门店',
};

export default function SelectRolePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { availableRoles } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!availableRoles || availableRoles.length <= 1) {
      router.push('/');
    }
  }, [availableRoles, router]);

  const handleSelectRole = async (role: string, roleId?: number) => {
    setLoading(true);
    try {
      const res = await http.post('/auth/select-role', { role, roleId });
      
      dispatch(selectRole({
        role: role as any,
        roleId,
        token: res.data.token,
      }));
      
      localStorage.setItem('token', res.data.token);
      
      message.success('角色切换成功');
      
      // 根据角色跳转到对应页面
      switch (role) {
        case 'admin':
        case 'sub_admin':
          router.push('/admin');
          break;
        case 'supplier':
          router.push('/supplier');
          break;
        case 'store':
          router.push('/store');
          break;
        default:
          router.push('/');
      }
    } catch (error: any) {
      message.error(error.message || '角色切换失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Title level={2}>选择角色</Title>
          <Text type="secondary">您有多个角色可以使用，请选择一个角色进入系统</Text>
        </div>

        <Row gutter={[24, 24]} justify="center">
          {availableRoles?.map((role) => (
            <Col key={`${role.role}-${role.roleId}`} xs={24} sm={12} md={8}>
              <Card
                hoverable
                className={styles.roleCard}
                onClick={() => !loading && handleSelectRole(role.role, role.roleId)}
              >
                <div className={styles.roleContent}>
                  {roleIcons[role.role]}
                  <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
                    {roleNames[role.role]}
                  </Title>
                  <Text>{role.name}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className={styles.footer}>
          <Button onClick={() => {
            localStorage.clear();
            router.push('/login');
          }}>
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );
}
