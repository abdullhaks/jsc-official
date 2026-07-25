import React from 'react';
import CrudPage from '../components/CrudPage';
import { Tag } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

const MemoriesPage = () => {
  return (
    <CrudPage
      title="Memories"
      endpoint="memories"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        {
          key: 'date',
          label: 'Date',
          render: (item) => (item.date ? new Date(item.date).toLocaleDateString() : '—'),
        },
        { key: 'attendees', label: 'Attendees' },
        { key: 'location', label: 'Location' },
        {
          key: 'eventHighlights',
          label: 'Highlights',
          render: (item) =>
            item.eventHighlights && item.eventHighlights.length > 0 ? (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {item.eventHighlights.map((h, idx) => (
                  <Tag key={idx} color="green" style={{ borderRadius: 10, fontSize: 11 }}>
                    {h}
                  </Tag>
                ))}
              </div>
            ) : (
              '—'
            ),
        },
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
        { key: 'attendees', label: 'Attendees (Optional)', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'eventHighlights', label: 'Event Highlights (Up to 3 items)', type: 'array', maxItems: 3 },
        { key: 'image', label: 'Cover Image', type: 'file' },
      ]}
    />
  );
};

export default MemoriesPage;
