import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Form,
  Input,
  Button,
  App as AntApp,
  Typography,
  Divider,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await login({ username: values.username, password: values.password });
      message.success('Welcome back! Redirecting to dashboard...');
      navigate('/admin');
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || 'Invalid credentials. Please try again.';
      message.error(errMsg);
      form.setFieldValue('password', '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background Orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,124,63,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
        }} />
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          margin: '0 16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 20,
          padding: '40px 40px 36px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #4f7c3f 0%, #2d5a1b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(79,124,63,0.25)',
            }}
          >
            ☪️
          </div>
          <Title
            level={2}
            style={{
              color: '#0f172a',
              margin: 0,
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            JSC Admin Portal
          </Title>
          <Text style={{ color: '#4f7c3f', fontSize: 13, fontWeight: 600, letterSpacing: '0.03em' }}>
            Jamiyyathul Shubanul Coromandel
          </Text>
        </div>

        <Divider style={{ borderColor: '#f1f5f9', margin: '0 0 28px' }} />

        {/* Form */}
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="username"
            label={<Text style={{ color: '#334155', fontWeight: 600 }}>Username</Text>}
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#4f7c3f' }} />}
              placeholder="Enter username"
              style={{
                borderRadius: 10,
                borderColor: '#cbd5e1',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text style={{ color: '#334155', fontWeight: 600 }}>Password</Text>}
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#4f7c3f' }} />}
              placeholder="Enter password"
              style={{
                borderRadius: 10,
                borderColor: '#cbd5e1',
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 12, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              icon={<LoginOutlined />}
              style={{
                height: 48,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #4f7c3f 0%, #3a6b2c 100%)',
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(79,124,63,0.3)',
                letterSpacing: '0.03em',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        {/* Security note */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Text style={{ color: '#64748b', fontSize: 12 }}>
            <SafetyOutlined style={{ marginRight: 4 }} />
            Secured admin access only
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
