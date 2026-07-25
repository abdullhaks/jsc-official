import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Tag,
  Space,
  Spin,
  App as AntApp,
  Button,
} from 'antd';
import {
  CalendarOutlined,
  FileTextOutlined,
  PictureOutlined,
  ReadOutlined,
  DownloadOutlined,
  BulbOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const statCards = [
  {
    title: 'Events',
    endpoint: '/admin/events',
    icon: <CalendarOutlined />,
    color: '#4f7c3f',
    path: '/admin/events',
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '#bbf7d0',
  },
  {
    title: 'Articles',
    endpoint: '/admin/articles',
    icon: <ReadOutlined />,
    color: '#2563eb',
    path: '/admin/articles',
    gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    border: '#bfdbfe',
  },
  {
    title: 'Memories',
    endpoint: '/admin/memories',
    icon: <PictureOutlined />,
    color: '#7c3aed',
    path: '/admin/memories',
    gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    border: '#ddd6fe',
  },
  {
    title: 'Publications',
    endpoint: '/admin/publications',
    icon: <FileTextOutlined />,
    color: '#d97706',
    path: '/admin/publications',
    gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    border: '#fde68a',
  },
  {
    title: 'Downloads',
    endpoint: '/admin/downloads',
    icon: <DownloadOutlined />,
    color: '#0891b2',
    path: '/admin/downloads',
    gradient: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
    border: '#a5f3fc',
  },
  {
    title: 'Latest Content',
    endpoint: '/admin/latest-content',
    icon: <BulbOutlined />,
    color: '#db2777',
    path: '/admin/latest-content',
    gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    border: '#fbcfe8',
  },
];

const DashboardOverview = () => {
  const [counts, setCounts] = useState({});
  const [loadingStats, setLoadingStats] = useState(true);
  const [serverStatus, setServerStatus] = useState('checking');
  const { message } = AntApp.useApp();

  const fetchCounts = async () => {
    setLoadingStats(true);
    const results = {};
    await Promise.allSettled(
      statCards.map(async (card) => {
        try {
          const res = await api.get(card.endpoint);
          const data = res.data;
          results[card.title] = Array.isArray(data)
            ? data.length
            : data?.total ?? data?.items?.length ?? 0;
        } catch {
          results[card.title] = '—';
        }
      })
    );
    setCounts(results);
    setLoadingStats(false);
  };

  const checkServerHealth = async () => {
    setServerStatus('checking');
    try {
      const baseURL =
        import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
      await axios.get(baseURL + '/');
      setServerStatus('online');
    } catch {
      setServerStatus('offline');
    }
  };

  useEffect(() => {
    fetchCounts();
    checkServerHealth();
  }, []);

  const handleRefresh = () => {
    message.info('Refreshing dashboard stats...');
    fetchCounts();
    checkServerHealth();
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%)',
          border: '1px solid #c8e6c9',
          borderRadius: 16,
          padding: '28px 32px',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            fontSize: 120,
            opacity: 0.08,
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          ☪️
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Title level={3} style={{ color: '#166534', margin: 0, fontWeight: 700 }}>
              🌙 Welcome to the JSC Dashboard
            </Title>
            <Paragraph style={{ color: '#475569', margin: '6px 0 0', fontSize: 14 }}>
              Manage all JSC content from one place. Use the sidebar to navigate sections.
            </Paragraph>
          </div>
          <Space wrap size={12}>
            <Tag
              icon={
                serverStatus === 'online' ? (
                  <CheckCircleFilled />
                ) : serverStatus === 'offline' ? (
                  <ExclamationCircleFilled />
                ) : (
                  <Spin size="small" />
                )
              }
              color={
                serverStatus === 'online'
                  ? 'success'
                  : serverStatus === 'offline'
                  ? 'error'
                  : 'default'
              }
              style={{ fontSize: 13, padding: '4px 14px', borderRadius: 20, fontWeight: 600 }}
            >
              {serverStatus === 'online'
                ? 'Server Online'
                : serverStatus === 'offline'
                ? 'Server Offline'
                : 'Checking...'}
            </Tag>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              size="small"
              style={{
                background: '#ffffff',
                border: '1px solid #a7f3d0',
                color: '#166534',
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              Refresh
            </Button>
          </Space>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <Row gutter={[16, 16]}>
        {statCards.map((card) => (
          <Col xs={24} sm={12} xl={8} key={card.title}>
            <Card
              hoverable
              style={{
                background: card.gradient,
                border: `1px solid ${card.border}`,
                borderRadius: 14,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              bodyStyle={{ padding: '20px 24px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 25px rgba(0,0,0,0.06)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    {card.title}
                  </Text>
                  <Statistic
                    value={loadingStats ? undefined : counts[card.title]}
                    loading={loadingStats}
                    valueStyle={{
                      color: card.color,
                      fontSize: 36,
                      fontWeight: 800,
                      lineHeight: 1.2,
                      marginTop: 4,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: '#ffffff',
                    border: `1px solid ${card.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: card.color,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  {card.icon}
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${card.border}` }}>
                <Link to={card.path} style={{ color: card.color, fontSize: 12, fontWeight: 600, letterSpacing: '0.03em' }}>
                  Manage {card.title} <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Card
        style={{
          marginTop: 24,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
        bodyStyle={{ padding: '20px 24px' }}
        title={
          <Text style={{ color: '#0f172a', fontWeight: 700 }}>⚡ Quick Actions</Text>
        }
      >
        <Space wrap size={12}>
          {statCards.map((card) => (
            <Link to={card.path} key={card.title}>
              <Button
                icon={card.icon}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${card.border}`,
                  color: card.color,
                  borderRadius: 8,
                  fontWeight: 600,
                }}
              >
                + Add {card.title.replace(/s$/, '')}
              </Button>
            </Link>
          ))}
        </Space>
      </Card>
    </div>
  );
};

export default DashboardOverview;
