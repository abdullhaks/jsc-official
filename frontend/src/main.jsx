import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n';
import '@ant-design/v5-patch-for-react-19';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntApp, theme } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#4f7c3f',
          colorInfo: '#4f7c3f',
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
);
