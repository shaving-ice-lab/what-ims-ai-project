'use client';

import { loginSuccess } from '@/store/slices/authSlice';
import { http } from '@/utils/request';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './login.module.css';

const { Title } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const res = await http.post('/auth/login', values);

      // 保存登录信息
      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          availableRoles: res.data.availableRoles,
        })
      );

      // 保存到localStorage
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);

      message.success('登录成功');

      // 根据角色跳转
      if (res.data.availableRoles && res.data.availableRoles.length > 1) {
        // 多角色用户，跳转到角色选择页
        router.push('/select-role');
      } else {
        // 单角色用户，直接跳转到对应首页
        const role = res.data.user.role;
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
      }
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <Title level={2}>供应链订货系统</Title>
            <p className={styles.subtitle}>IMS - Inventory Management System</p>
          </div>

          <Form form={form} name="login" onFinish={onFinish} autoComplete="off" size="large">
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.footer}>
            <p>© 2024 供应链订货系统. All rights reserved.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
