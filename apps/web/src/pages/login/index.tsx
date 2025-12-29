import { authService } from '@/services/auth';
import { setCredentials, setUser } from '@/store/slices/authSlice';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import { LockOutlined, MobileOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, message, Space, Tabs } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './login.module.css';

const { TabPane } = Tabs;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'account' | 'mobile'>('account');
  const [rememberMe, setRememberMe] = useState(false);

  // 账号密码登录
  const handleAccountLogin = async (values: any) => {
    setLoading(true);
    try {
      const loginData: LoginRequest = {
        username: values.username,
        password: values.password,
        rememberMe: rememberMe,
      };

      const response: LoginResponse = await authService.login(loginData);
      
      // 保存Token和用户信息
      dispatch(setCredentials({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn,
      }));
      dispatch(setUser(response.user));

      // 存储到localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      message.success('登录成功');

      // 检查是否有多角色
      if (response.availableRoles && response.availableRoles.length > 1) {
        // 跳转到角色选择页面
        router.push('/role-select');
      } else {
        // 根据角色跳转到对应页面
        redirectByRole(response.user.role);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      message.error(error.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  // 手机验证码登录
  const handleMobileLogin = async (_values: any) => {
    message.info('手机验证码登录功能暂未开放');
  };

  // 根据角色跳转
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

  // 发送验证码
  const handleSendCode = () => {
    const phone = form.getFieldValue('phone');
    if (!phone) {
      message.error('请先输入手机号');
      return;
    }
    message.info('验证码发送功能暂未开放');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <Card className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1>供应链订货系统</h1>
            <p>Supply Chain Ordering System</p>
          </div>

          <Tabs 
            activeKey={loginType} 
            onChange={(key) => setLoginType(key as 'account' | 'mobile')}
            centered
          >
            <TabPane tab="账号密码登录" key="account">
              <Form
                form={form}
                name="accountLogin"
                onFinish={handleAccountLogin}
                autoComplete="off"
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入用户名"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item>
                  <div className={styles.loginOptions}>
                    <Checkbox 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                    >
                      记住我
                    </Checkbox>
                    <Link href="/forgot-password">
                      <a>忘记密码？</a>
                    </Link>
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    登 录
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="手机号登录" key="mobile">
              <Form
                form={form}
                name="mobileLogin"
                onFinish={handleMobileLogin}
                autoComplete="off"
                size="large"
              >
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                  ]}
                >
                  <Input
                    prefix={<MobileOutlined />}
                    placeholder="请输入手机号"
                    autoComplete="tel"
                  />
                </Form.Item>

                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: '请输入验证码' },
                    { len: 6, message: '验证码为6位数字' },
                  ]}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      prefix={<SafetyCertificateOutlined />}
                      placeholder="请输入验证码"
                      style={{ width: 'calc(100% - 120px)' }}
                    />
                    <Button 
                      onClick={handleSendCode}
                      style={{ width: '120px' }}
                    >
                      获取验证码
                    </Button>
                  </Space.Compact>
                </Form.Item>

                <Form.Item>
                  <div className={styles.loginOptions}>
                    <Checkbox 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                    >
                      记住我
                    </Checkbox>
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    登 录
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>

          <div className={styles.loginFooter}>
            <p>© 2024 供应链订货系统 版权所有</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
