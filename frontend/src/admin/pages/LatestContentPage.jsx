import React from 'react';
import CrudPage from '../components/CrudPage';
import { Tag } from 'antd';
import { YoutubeOutlined, InstagramOutlined, PlaySquareOutlined, FileImageOutlined } from '@ant-design/icons';

const LatestContentPage = () => {
  return (
    <CrudPage
      title="Latest Content"
      endpoint="latest-content"
      columns={[
        { key: 'title', label: 'Title' },
        {
          key: 'type',
          label: 'Type',
          render: (item) => {
            const iconMap = {
              youtube: <YoutubeOutlined style={{ color: '#ef4444' }} />,
              instagram: <InstagramOutlined style={{ color: '#ec4899' }} />,
              other: <PlaySquareOutlined style={{ color: '#3b82f6' }} />,
            };
            return (
              <Tag style={{ borderRadius: 12, fontWeight: 600, textTransform: 'capitalize', fontSize: 11 }}>
                {iconMap[item.type] || iconMap.other} {item.type || 'youtube'}
              </Tag>
            );
          },
        },
        { key: 'description', label: 'Description' },
        {
          key: 'date',
          label: 'Date',
          render: (item) => (item.date ? new Date(item.date).toLocaleDateString() : '—'),
        },
        { key: 'views', label: 'Views', render: (item) => (item.views !== undefined ? item.views : '—') },
        {
          key: 'image',
          label: 'Cover Image',
          render: (item) =>
            item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} style={{ height: 36, width: 36, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f1f5f9', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 14 }}>
                <FileImageOutlined />
              </div>
            ),
        },
      ]}
      formFields={[
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'views', label: 'Views (Optional - e.g. 1.2M, 500K, 2000)', type: 'text' },
        {
          key: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Other', value: 'other' },
          ],
        },
        { key: 'contentUrl', label: 'Content URL', type: 'text', required: true },
        { key: 'image', label: 'Cover Image', type: 'file' },
      ]}
    />
  );
};

export default LatestContentPage;
