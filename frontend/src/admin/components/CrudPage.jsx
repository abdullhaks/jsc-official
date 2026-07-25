import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Popconfirm,
  Space,
  Typography,
  App as AntApp,
  Tag,
  Tooltip,
  Empty,
  Spin,
  Switch,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

/**
 * Generic Light Mode CRUD page component with Saved File Previews in Edit Modal.
 */
const CrudPage = ({ title, endpoint, columns, formFields, extraHeaderButtons }) => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileMap, setFileMap] = useState({});
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/${endpoint}`);
      setData(res.data?.items || res.data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load data.';
      message.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Open / Close Modal ───────────────────────────────────────────────────
  const handleOpenModal = (item = null) => {
    setFileMap({});
    if (item) {
      setEditingItem(item);
      // Process initial form values (formatting dates or array values if needed)
      const formattedValues = { ...item };
      if (item.date) {
        formattedValues.date = new Date(item.date).toISOString().split('T')[0];
      }
      form.setFieldsValue(formattedValues);
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
    setFileMap({});
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }

    setSubmitting(true);
    try {
      const values = form.getFieldsValue();
      const payload = new FormData();

      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          if (Array.isArray(val)) {
            val.forEach((item, index) => {
              payload.append(`${key}[${index}]`, item);
            });
          } else if (typeof val === 'object' && !(val instanceof File)) {
            payload.append(key, JSON.stringify(val));
          } else {
            payload.append(key, val);
          }
        }
      });

      Object.entries(fileMap).forEach(([key, file]) => {
        if (file) payload.append(key, file);
      });

      if (editingItem?._id) {
        await api.patch(`/admin/${endpoint}/${editingItem._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success(`✅ ${title.replace(/s$/, '')} updated successfully!`);
      } else {
        await api.post(`/admin/${endpoint}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success(`✅ ${title.replace(/s$/, '')} created successfully!`);
      }

      await fetchData();
      handleCloseModal();
    } catch (err) {
      const errMsg = err?.response?.data?.message;
      const display = Array.isArray(errMsg)
        ? errMsg.join(', ')
        : errMsg || 'Something went wrong. Please try again.';
      message.error(`❌ ${display}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/${endpoint}/${id}`);
      message.success(`🗑️ ${title.replace(/s$/, '')} deleted.`);
      await fetchData();
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Failed to delete item.';
      message.error(`❌ ${errMsg}`);
    }
  };

  // ── Table Column Definitions ─────────────────────────────────────────────
  const tableColumns = [
    ...columns.map((col) => ({
      title: col.label,
      dataIndex: col.key,
      key: col.key,
      ellipsis: true,
      render: col.render
        ? (_, record) => col.render(record)
        : (val) => (
            <Text style={{ color: '#334155', fontSize: 13 }}>
              {String(val ?? '—').length > 60 ? String(val).slice(0, 57) + '...' : val ?? '—'}
            </Text>
          ),
    })),
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      width: 120,
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
              style={{ color: '#4f7c3f' }}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title={`Delete ${title.replace(/s$/, '')}`}
            description="Are you sure you want to delete this item? This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Helper to resolve saved preview URL from editingItem
  const getSavedPreviewUrl = (fieldKey) => {
    if (!editingItem) return null;
    if (fieldKey === 'image' && editingItem.imageUrl) return editingItem.imageUrl;
    if (fieldKey === 'coverImage' && editingItem.coverImageUrl) return editingItem.coverImageUrl;
    if (fieldKey === 'file' && editingItem.fileUrl) return editingItem.fileUrl;
    if (editingItem[fieldKey] && typeof editingItem[fieldKey] === 'string' && editingItem[fieldKey].startsWith('http')) {
      return editingItem[fieldKey];
    }
    return null;
  };

  // ── Render Form Field ────────────────────────────────────────────────────
  const renderFormField = (field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <TextArea
            rows={4}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            style={{ borderRadius: 8, borderColor: '#cbd5e1' }}
          />
        );
      case 'select':
        return (
          <Select
            placeholder={`Select ${field.label.toLowerCase()}`}
            style={{ width: '100%' }}
          >
            {field.options?.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      case 'switch':
        return <Switch checkedChildren="Yes" unCheckedChildren="No" />;
      case 'number':
        return <InputNumber style={{ width: '100%', borderRadius: 8 }} placeholder={`Enter ${field.label.toLowerCase()}`} />;
      case 'file':
        const savedUrl = getSavedPreviewUrl(field.key);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {editingItem && savedUrl && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                {savedUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || field.key.toLowerCase().includes('image') ? (
                  <img
                    src={savedUrl}
                    alt="Current file preview"
                    style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid #86efac' }}
                  />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 6, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', fontSize: 20 }}>
                    <FileTextOutlined />
                  </div>
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <Text strong style={{ fontSize: 12, color: '#166534', display: 'block' }}>Saved File Attached</Text>
                  <Text style={{ fontSize: 11, color: '#15803d' }}>Choose a new file below only to replace it</Text>
                </div>
                <a href={savedUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', fontWeight: 600, fontSize: 12 }}>
                  <EyeOutlined /> View
                </a>
              </div>
            )}
            <Upload
              beforeUpload={(file) => {
                setFileMap((prev) => ({ ...prev, [field.key]: file }));
                return false;
              }}
              maxCount={1}
              accept="image/*,audio/*,video/*,application/pdf"
            >
              <Button icon={<UploadOutlined />} style={{ borderColor: '#cbd5e1', color: fileMap[field.key] ? '#166534' : '#475569', borderRadius: 8 }}>
                {fileMap[field.key] ? '✅ New file selected' : editingItem && savedUrl ? 'Replace File' : 'Choose File'}
              </Button>
            </Upload>
          </div>
        );
      case 'date':
        return (
          <Input
            type="date"
            style={{ borderRadius: 8, borderColor: '#cbd5e1' }}
          />
        );
      case 'time':
        return (
          <Input
            type="time"
            style={{ borderRadius: 8, borderColor: '#cbd5e1' }}
          />
        );
      case 'array':
        return (
          <Form.List name={field.key}>
            {(fields, { add, remove }) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {fields.map((f, index) => (
                  <div key={f.key} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Form.Item
                      {...f}
                      noStyle
                    >
                      <Input placeholder={`Item #${index + 1}`} style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(f.name)} />
                  </div>
                ))}
                {fields.length < (field.maxItems || 3) && (
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} style={{ borderRadius: 8, width: '100%' }}>
                    Add {field.label} item (max {field.maxItems || 3})
                  </Button>
                )}
              </div>
            )}
          </Form.List>
        );
      default:
        return (
          <Input
            type={field.type || 'text'}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            style={{ borderRadius: 8, borderColor: '#cbd5e1' }}
          />
        );
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={4} style={{ color: '#0f172a', margin: 0, fontWeight: 700 }}>{title}</Title>
          <Text style={{ color: '#64748b', fontSize: 13 }}>
            {loading ? 'Loading...' : `${data.length} item${data.length !== 1 ? 's' : ''} total`}
          </Text>
        </div>
        <Space wrap size={12}>
          {extraHeaderButtons && extraHeaderButtons(fetchData)}
          <Tooltip title="Refresh data">
            <Button
              icon={<ReloadOutlined spin={loading} />}
              onClick={fetchData}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#4f7c3f',
                borderRadius: 8,
              }}
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            style={{
              background: 'linear-gradient(135deg, #4f7c3f, #3a6b2c)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(79,124,63,0.25)',
            }}
          >
            Add {title.replace(/s$/, '')}
          </Button>
        </Space>
      </div>

      {/* Table */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <Table
          columns={tableColumns}
          dataSource={data}
          rowKey="_id"
          loading={{
            spinning: loading,
            indicator: <Spin size="large" />,
          }}
          locale={{
            emptyText: (
              <Empty
                description={<Text style={{ color: '#64748b' }}>No {title.toLowerCase()} found</Text>}
                style={{ padding: '40px 0' }}
              />
            ),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => (
              <Text style={{ color: '#64748b', fontSize: 13 }}>Total: {total} items</Text>
            ),
            style: { padding: '12px 20px', borderTop: '1px solid #f1f5f9' },
          }}
          scroll={{ x: 'max-content' }}
          style={{ background: 'transparent' }}
          rowClassName={() => 'crud-table-row'}
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #4f7c3f, #3a6b2c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              {editingItem ? <EditOutlined style={{ color: '#fff' }} /> : <PlusOutlined style={{ color: '#fff' }} />}
            </div>
            <span style={{ color: '#0f172a', fontWeight: 700, fontSize: 17 }}>
              {editingItem ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={640}
        okButtonProps={{
          style: {
            background: 'linear-gradient(135deg, #4f7c3f, #3a6b2c)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
        }}
        cancelButtonProps={{
          style: { borderColor: '#cbd5e1', color: '#64748b', borderRadius: 8 },
        }}
        styles={{
          content: {
            background: '#ffffff',
            borderRadius: 16,
            padding: 0,
            border: '1px solid #e2e8f0',
          },
          header: {
            background: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
            padding: '20px 24px 16px',
            borderRadius: '16px 16px 0 0',
          },
          body: { padding: '24px', background: '#ffffff' },
          footer: {
            background: '#ffffff',
            borderTop: '1px solid #f1f5f9',
            padding: '16px 24px',
            borderRadius: '0 0 16px 16px',
          },
          mask: { backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.45)' },
        }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          style={{ gap: 4 }}
        >
          {formFields.map((field) => (
            <Form.Item
              key={field.key}
              name={field.type === 'file' ? undefined : field.key}
              valuePropName={field.type === 'switch' ? 'checked' : 'value'}
              label={
                <Text style={{ color: '#334155', fontWeight: 600, fontSize: 13 }}>
                  {field.label}
                  {field.required && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
                </Text>
              }
              rules={
                field.required && field.type !== 'file'
                  ? [{ required: true, message: `${field.label} is required` }]
                  : []
              }
              style={{ marginBottom: 18 }}
            >
              {renderFormField(field)}
            </Form.Item>
          ))}
        </Form>
      </Modal>

      {/* Light theme table styles */}
      <style>{`
        .crud-table-row {
          background: #ffffff !important;
          transition: background 0.15s !important;
        }
        .crud-table-row:hover > td {
          background: #f0fdf4 !important;
        }
        .ant-table-thead > tr > th {
          background: #f8fafc !important;
          color: #64748b !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.08em !important;
          border-bottom: 1px solid #e2e8f0 !important;
          font-weight: 700 !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9 !important;
        }
        .ant-upload-list {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CrudPage;
