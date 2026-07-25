import React from 'react';
import CrudPage from '../components/CrudPage';
import { Tag, Typography } from 'antd';
import { LinkOutlined, FileImageOutlined, StarFilled } from '@ant-design/icons';

const { Link } = Typography;

const PublicationsPage = () => {
  return (
    <CrudPage
      title="Publications"
      endpoint="publications"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price' },
        {
          key: 'featured',
          label: 'Featured',
          render: (item) => (
            <Tag color={item.featured ? 'gold' : 'default'} style={{ borderRadius: 10, fontSize: 11 }}>
              {item.featured ? '⭐ Featured' : 'Standard'}
            </Tag>
          ),
        },
        {
          key: 'rating',
          label: 'Rating',
          render: (item) => (
            item.rating ? (
              <span style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>
                <StarFilled style={{ marginRight: 4 }} />
                {item.rating}
              </span>
            ) : '—'
          ),
        },
        {
          key: 'purchaseLink',
          label: 'Purchase Link',
          render: (item) =>
            item.purchaseLink ? (
              <Link href={item.purchaseLink} target="_blank" style={{ color: '#4f7c3f', fontSize: 12 }}>
                <LinkOutlined /> Buy
              </Link>
            ) : (
              '—'
            ),
        },
        {
          key: 'coverImage',
          label: 'Cover',
          render: (item) =>
            item.coverImageUrl ? (
              <img src={item.coverImageUrl} alt={item.title} style={{ height: 36, width: 36, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f1f5f9', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 14 }}>
                <FileImageOutlined />
              </div>
            ),
        },
      ]}
      formFields={[
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'author', label: 'Author', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'price', label: 'Price (e.g. $15.00 or Free)', type: 'text' },
        { key: 'featured', label: 'Featured Publication', type: 'switch' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'tags', label: 'Tags (Up to 3)', type: 'array', maxItems: 3 },
        { key: 'rating', label: 'Rating (0 - 5)', type: 'number' },
        { key: 'purchaseLink', label: 'Purchase Link', type: 'text' },
        { key: 'image', label: 'Cover Image', type: 'file' },
      ]}
    />
  );
};

export default PublicationsPage;
