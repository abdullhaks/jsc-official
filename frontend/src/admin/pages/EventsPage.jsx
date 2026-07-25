import React, { useState } from 'react';
import CrudPage from '../components/CrudPage';
import { Tag, Button, Modal, App as AntApp, Tooltip } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { api } from '../../api/axios';

const EventsPage = () => {
  const { message } = AntApp.useApp();
  const [deletingExpired, setDeletingExpired] = useState(false);

  // Helper to compute event status dynamically on the fly based on current date/time
  const computeEventStatus = (item) => {
    if (!item.date) return 'upcoming';
    const now = new Date();
    const eventDate = new Date(item.date);
    
    // Check if same day
    const isSameDay =
      eventDate.getFullYear() === now.getFullYear() &&
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getDate() === now.getDate();

    if (isSameDay) return 'ongoing';
    if (eventDate > now) return 'upcoming';
    return 'ended';
  };

  const handleDeleteExpired = (refreshCallback) => {
    Modal.confirm({
      title: 'Delete All Expired Events',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: 'Are you sure you want to delete all past events whose date has passed? This will also remove their cover images.',
      okText: 'Yes, Delete Expired',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setDeletingExpired(true);
        try {
          const res = await api.delete('/admin/events/expired');
          message.success(`🗑️ Deleted ${res.data?.deletedCount ?? 0} expired event(s).`);
          if (refreshCallback) refreshCallback();
        } catch (err) {
          const errMsg = err?.response?.data?.message || 'Failed to delete expired events.';
          message.error(`❌ ${errMsg}`);
        } finally {
          setDeletingExpired(false);
        }
      },
    });
  };

  return (
    <CrudPage
      title="Events"
      endpoint="events"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'venue', label: 'Venue' },
        {
          key: 'date',
          label: 'Date',
          render: (item) => (item.date ? new Date(item.date).toLocaleDateString() : '—'),
        },
        { key: 'time', label: 'Time' },
        {
          key: 'status',
          label: 'Status (Computed)',
          render: (item) => {
            const status = computeEventStatus(item);
            const colorMap = {
              upcoming: 'gold',
              ongoing: 'green',
              ended: 'red',
            };
            return (
              <Tag color={colorMap[status]} style={{ borderRadius: 20, fontWeight: 600, textTransform: 'uppercase', fontSize: 11 }}>
                {status}
              </Tag>
            );
          },
        },
        {
          key: 'image',
          label: 'Image',
          render: (item) =>
            item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} style={{ height: 36, width: 36, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
            ) : (
              '—'
            ),
        },
      ]}
      formFields={[
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'venue', label: 'Venue', type: 'text', required: true },
        { key: 'venueLocationUrl', label: 'Venue Location URL', type: 'text' },
        { key: 'date', label: 'Date', type: 'date', required: true },
        { key: 'time', label: 'Time', type: 'time' },
        { key: 'image', label: 'Event Image', type: 'file' },
      ]}
      extraHeaderButtons={(refreshCallback) => (
        <Tooltip title="Delete all events with past dates">
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={deletingExpired}
            onClick={() => handleDeleteExpired(refreshCallback)}
            style={{ borderRadius: 8, fontWeight: 500 }}
          >
            Delete Expired Events
          </Button>
        </Tooltip>
      )}
    />
  );
};

export default EventsPage;
