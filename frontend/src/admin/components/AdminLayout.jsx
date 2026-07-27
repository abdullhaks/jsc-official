import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Breadcrumb,
  App as AntApp,
  Typography,
  Space,
  Tooltip,
  Badge,
  Modal,
} from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PictureOutlined,
  DownloadOutlined,
  ReadOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  BellOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const navItems = [
  { key: '/admin', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/admin/events', label: 'Events', icon: <CalendarOutlined /> },
  { key: '/admin/latest-content', label: 'Latest Content', icon: <FileTextOutlined /> },
  { key: '/admin/memories', label: 'Memories', icon: <PictureOutlined /> },
  { key: '/admin/publications', label: 'Publications', icon: <ReadOutlined /> },
  { key: '/admin/downloads', label: 'Downloads', icon: <DownloadOutlined /> },
  { key: '/admin/articles', label: 'Articles', icon: <FileTextOutlined /> },
];

const breadcrumbNameMap = {
  '/admin': 'Dashboard',
  '/admin/events': 'Events',
  '/admin/latest-content': 'Latest Content',
  '/admin/memories': 'Memories',
  '/admin/publications': 'Publications',
  '/admin/downloads': 'Downloads',
  '/admin/articles': 'Articles',
};

const AdminLayout = () => {
  const { logout, admin } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const performLogout = async () => {
    try {
      await logout();
      message.success('Logged out successfully');
      navigate('/admin/login');
    } catch {
      message.error('Logout failed. Please try again.');
    }
  };

  const handleLogoutClick = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: 'Are you sure you want to log out of the admin panel?',
      okText: 'Logout',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: performLogout,
    });
  };

  const handleNavClick = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <span style={{ fontWeight: 500, color: '#334155' }}>{admin?.username || 'Admin'}</span>,
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
      label: <span style={{ color: '#ff4d4f', fontWeight: 500 }}>Sign Out</span>,
      onClick: handleLogoutClick,
    },
  ];

  const selectedKey =
    navItems
      .slice()
      .reverse()
      .find((item) => location.pathname === item.key || location.pathname.startsWith(item.key + '/'))?.key ||
    '/admin';

  const currentBreadcrumb = breadcrumbNameMap[location.pathname] || 'Admin';

  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link to={item.key} onClick={handleNavClick}>
        {item.label}
      </Link>
    ),
  }));

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={240}
        collapsedWidth={isMobile ? 0 : 72}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 100,
          boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
          transition: 'all 0.25s cubic-bezier(0.2, 0, 0, 1)',
          overflow: 'hidden',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            padding: collapsed ? '20px 16px' : '24px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'padding 0.25s',
            background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f7c3f, #3a6b2c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(79,124,63,0.25)',
            }}
          >
            ☪️
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <Text
                strong
                style={{
                  color: '#1e293b',
                  fontSize: 16,
                  display: 'block',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}
              >
                JSC Admin
              </Text>
              <Text style={{ color: '#4f7c3f', fontSize: 11, fontWeight: 500 }}>Control Panel</Text>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: 12,
            flex: 1,
          }}
          theme="light"
        />

        {/* Bottom Collapse Toggle Button */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'flex-end',
          }}
        >
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                cursor: 'pointer',
                color: '#4f7c3f',
                fontSize: 18,
                padding: '6px 10px',
                borderRadius: 8,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f0fdf4')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </Tooltip>
        </div>
      </Sider>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <Layout
        style={{
          marginLeft: isMobile ? (collapsed ? 0 : 240) : collapsed ? 72 : 240,
          transition: 'margin-left 0.25s cubic-bezier(0.2, 0, 0, 1)',
          background: '#f8fafc',
          minHeight: '100vh',
        }}
      >
        {/* Top Header */}
        <Header
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid #e2e8f0',
            padding: isMobile ? '0 16px' : '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            height: 64,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {/* Header left controls: Toggle & Breadcrumb */}
          <Space align="center" size={12}>
            <Tooltip title={collapsed ? 'Expand menu' : 'Collapse menu'}>
              <div
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  cursor: 'pointer',
                  color: '#4f7c3f',
                  fontSize: 20,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px',
                  borderRadius: 6,
                  background: '#f0fdf4',
                }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
            </Tooltip>
            <Breadcrumb
              items={[
                { title: <span style={{ color: '#4f7c3f', fontWeight: 500 }}>JSC</span> },
                { title: <span style={{ color: '#0f172a', fontWeight: 600 }}>{currentBreadcrumb}</span> },
              ]}
            />
          </Space>

          {/* Right controls */}
          <Space size={isMobile ? 10 : 18}>
            <Tooltip title="Notifications">
              <Badge count={0} showZero={false}>
                <BellOutlined style={{ fontSize: 18, color: '#64748b', cursor: 'pointer' }} />
              </Badge>
            </Tooltip>
            <Tooltip title="Settings">
              <SettingOutlined style={{ fontSize: 18, color: '#64748b', cursor: 'pointer' }} />
            </Tooltip>

            {/* User Avatar Dropdown */}
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
              overlayStyle={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              }}
            >
              <Space
                style={{ cursor: 'pointer', userSelect: 'none', padding: '4px 8px', borderRadius: 8 }}
                className="hover:bg-gray-100 transition-colors"
              >
                <Avatar
                  size={36}
                  style={{
                    background: 'linear-gradient(135deg, #4f7c3f, #3a6b2c)',
                    fontSize: 14,
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(79,124,63,0.3)',
                  }}
                >
                  {admin?.username?.[0]?.toUpperCase() || 'A'}
                </Avatar>
                {!isMobile && !collapsed && (
                  <Text style={{ color: '#1e293b', fontSize: 14, fontWeight: 600 }}>
                    {admin?.username || 'Admin'}
                  </Text>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Page Content */}
        <Content
          style={{
            margin: isMobile ? '12px' : '24px',
            minHeight: 'calc(100vh - 64px - 48px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      {/* Light theme sidebar styles */}
      <style>{`
        .ant-menu-light .ant-menu-item-selected {
          background: #f0fdf4 !important;
          color: #4f7c3f !important;
          border-left: 3px solid #4f7c3f;
          font-weight: 600 !important;
        }
        .ant-menu-light .ant-menu-item:hover {
          background: #f8fafc !important;
          color: #4f7c3f !important;
        }
        .ant-menu-light .ant-menu-item {
          border-radius: 8px !important;
          margin: 2px 8px !important;
          width: calc(100% - 16px) !important;
          color: #475569 !important;
          transition: all 0.2s !important;
        }
        .ant-menu-light .ant-menu-item a {
          color: inherit !important;
        }
        .ant-layout-sider-trigger {
          display: none !important;
        }
      `}</style>
    </Layout>
  );
};

export default AdminLayout;
