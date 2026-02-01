import { authService } from '@/services/auth';
import { setCredentials, setUser } from '@/store/slices/authSlice';
import {
    HomeOutlined,
    ShopOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, message } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './role-select.module.css';

interface RoleOption {
  role: string;
  roleId?: number;
  name: string;
  description?: string;
}

const RoleSelectPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    loadUserRoles();
  }, []);

  const loadUserRoles = async () => {
    try {
      const userRoles = await authService.getUserRoles();
      setRoles(userRoles);
      
      // 如果只有一个角色，自动选择并跳转
      if (userRoles.length === 1) {
        handleRoleSelect(userRoles[0]);
      }
    } catch (error) {
      console.error('Failed to load user roles:', error);
      message.error('获取角色信息失败');
      // 如果获取失败，返回登录页
      router.push('/login');
    }
  };

  const handleRoleSelect = async (role: RoleOption) => {
    setLoading(true);
    setSelectedRole(role.role);
    
    try {
      const response = await authService.selectRole({
        role: role.role,
        roleId: role.roleId,
      });

      // 更新Token和用户信息
      dispatch(setCredentials({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn,
      }));
      dispatch(setUser(response.user));

      // 更新localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      message.success('角色选择成功');

      // 根据角色跳转
      redirectByRole(role.role);
    } catch (error: any) {
      console.error('Failed to select role:', error);
      message.error(error.message || '角色选择失败');
      setSelectedRole(null);
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role: string) => {
    switch (role) {
      case 'admin':
      case 'sub_admin':
        router.push('/admin/dashboard');
        break;
      case 'supplier':
        router.push('/supplier/dashboard');
        break;
      case 'store':
        router.push('/store/dashboard');
        break;
      default:
        router.push('/');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'sub_admin':
        return <UserOutlined style={{ fontSize: 48 }} />;
      case 'supplier':
        return <TeamOutlined style={{ fontSize: 48 }} />;
      case 'store':
        return <ShopOutlined style={{ fontSize: 48 }} />;
      default:
        return <HomeOutlined style={{ fontSize: 48 }} />;
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'admin':
        return '超级管理员';
      case 'sub_admin':
        return '子管理员';
      case 'supplier':
        return '供应商';
      case 'store':
        return '门店';
      default:
        return role;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>选择角色</h1>
          <p>您的账号关联了多个角色，请选择要使用的角色</p>
        </div>

        <Row gutter={[24, 24]} justify="center">
          {roles.map((role) => (
            <Col xs={24} sm={12} md={8} key={`${role.role}-${role.roleId}`}>
              <Card 
                className={`${styles.roleCard} ${selectedRole === role.role ? styles.selected : ''}`}
                hoverable
                onClick={() => !loading && handleRoleSelect(role)}
              >
                <div className={styles.roleCardContent}>
                  <div className={styles.roleIcon}>
                    {getRoleIcon(role.role)}
                  </div>
                  <h3>{getRoleTitle(role.role)}</h3>
                  <p className={styles.roleName}>{role.name}</p>
                  {role.description && (
                    <p className={styles.roleDescription}>{role.description}</p>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className={styles.footer}>
          <Space>
            <Button 
              onClick={() => {
                authService.logout();
                router.push('/login');
              }}
            >
              返回登录
            </Button>
            {loading && <span>正在进入系统...</span>}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectPage;
