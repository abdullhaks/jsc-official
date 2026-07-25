import React from 'react';
import CrudPage from '../components/CrudPage';
import { Tag, Typography } from 'antd';
import { FilePdfOutlined, FileImageOutlined, VideoCameraOutlined, DownloadOutlined } from '@ant-design/icons';

const { Link } = Typography;

const DownloadsPage = () => {
  return (
    <CrudPage
      title="Downloads"
      endpoint="downloads"
      columns={[
        { key: 'title', label: 'Title' },
        {
          key: 'fileType',
          label: 'Type',
          render: (item) => {
            const iconMap = {
              pdf: <FilePdfOutlined style={{ color: '#ef4444' }} />,
              image: <FileImageOutlined style={{ color: '#3b82f6' }} />,
              video: <VideoCameraOutlined style={{ color: '#8b5cf6' }} />,
            };
            return (
              <Tag style={{ borderRadius: 12, fontWeight: 600, textTransform: 'uppercase', fontSize: 11 }}>
                {iconMap[item.fileType] || iconMap.pdf} {item.fileType || 'pdf'}
              </Tag>
            );
          },
        },
        { key: 'category', label: 'Category' },
        { key: 'description', label: 'Description' },
        {
          key: 'date',
          label: 'Date',
          render: (item) => (item.date ? new Date(item.date).toLocaleDateString() : '—'),
        },
        {
          key: 'downloadCount',
          label: 'Downloads',
          render: (item) => (
            <span style={{ fontWeight: 600, color: '#166534' }}>
              <DownloadOutlined style={{ marginRight: 4 }} />
              {item.downloadCount || 0}
            </span>
          ),
        },
        {
          key: 'file',
          label: 'Document',
          render: (item) =>
            item.fileUrl ? (
              <Link href={item.fileUrl} target="_blank" style={{ color: '#4f7c3f', fontSize: 12, fontWeight: 500 }}>
                📎 View / Download
              </Link>
            ) : (
              '—'
            ),
        },
      ]}
      formFields={[
        {
          key: 'fileType',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { label: 'PDF Document', value: 'pdf' },
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'file', label: 'Upload File (PDF / Image / Video)', type: 'file' },
      ]}
    />
  );
};

export default DownloadsPage;
