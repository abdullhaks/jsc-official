import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Popconfirm,
  Space,
  Typography,
  App as AntApp,
  Tooltip,
  Avatar,
  Empty,
  Spin,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ReloadOutlined,
  UserOutlined,
  FileImageOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ArticlesPage = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState({ coverImage: null, inlineImage1: null, inlineImage2: null });
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/articles');
      setData(res.data?.items || res.data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load articles.';
      message.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    setFiles({ coverImage: null, inlineImage1: null, inlineImage2: null });
    if (item) {
      setEditingItem(item);
      form.setFieldsValue({
        title: item.title,
        content: item.content,
        authorName: item.author?.name,
        authorBio: item.author?.bio,
      });
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
    setFiles({ coverImage: null, inlineImage1: null, inlineImage2: null });
  };

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
      payload.append('title', values.title || '');
      payload.append('content', values.content || '');
      payload.append('author[name]', values.authorName || '');
      if (values.authorBio) payload.append('author[bio]', values.authorBio);
      if (files.coverImage) payload.append('coverImage', files.coverImage);
      if (files.inlineImage1) payload.append('inlineImage1', files.inlineImage1);
      if (files.inlineImage2) payload.append('inlineImage2', files.inlineImage2);

      if (editingItem?._id) {
        await api.patch(`/admin/articles/${editingItem._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('✅ Article updated successfully!');
      } else {
        await api.post('/admin/articles', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('✅ Article created successfully!');
      }

      await fetchData();
      handleCloseModal();
    } catch (err) {
      const errMsg = err?.response?.data?.message;
      const display = Array.isArray(errMsg)
        ? errMsg.join(', ')
        : errMsg || 'Something went wrong.';
      message.error(`❌ ${display}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/articles/${id}`);
      message.success('🗑️ Article deleted.');
      await fetchData();
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Failed to delete article.';
      message.error(`❌ ${errMsg}`);
    }
  };

  const fileUploadProps = (key) => ({
    beforeUpload: (file) => {
      setFiles((prev) => ({ ...prev, [key]: file }));
      return false;
    },
    maxCount: 1,
    accept: 'image/*',
  });

  const getSavedImageUrl = (key) => {
    if (!editingItem) return null;
    if (key === 'coverImage' && editingItem.coverImageUrl) return editingItem.coverImageUrl;
    if (key === 'inlineImage1') {
      const img = editingItem.inlineImages?.find(i => i.position === 1);
      return img?.url || null;
    }
    if (key === 'inlineImage2') {
      const img = editingItem.inlineImages?.find(i => i.position === 2);
      return img?.url || null;
    }
    return null;
  };

  const tableColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (val) => (
        <Text style={{ color: '#0f172a', fontWeight: 600 }}>
          {val?.length > 50 ? val.slice(0, 47) + '...' : val}
        </Text>
      ),
    },
    {
      title: 'Author',
      key: 'author',
      width: 180,
      render: (_, record) => (
        <Space size={8}>
          <Avatar
            size={28}
            icon={<UserOutlined />}
            style={{ background: '#4f7c3f', fontSize: 12 }}
          />
          <Text style={{ color: '#475569', fontSize: 13 }}>
            {record.author?.name || '—'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Cover',
      key: 'cover',
      width: 80,
      render: (_, record) =>
        record.coverImageUrl ? (
          <img
            src={record.coverImageUrl}
            alt={record.title}
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: '#f1f5f9',
              border: '1px dashed #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
            }}
          >
            <FileImageOutlined />
          </div>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      width: 110,
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
            title="Delete Article"
            description="Are you sure? This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
          >
            <Tooltip title="Delete">
              <Button type="text" icon={<DeleteOutlined />} danger size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={4} style={{ color: '#0f172a', margin: 0, fontWeight: 700 }}>Articles</Title>
          <Text style={{ color: '#64748b', fontSize: 13 }}>
            {loading ? 'Loading...' : `${data.length} article${data.length !== 1 ? 's' : ''} total`}
          </Text>
        </div>
        <Space>
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined spin={loading} />}
              onClick={fetchData}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#4f7c3f', borderRadius: 8 }}
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            style={{ background: 'linear-gradient(135deg, #4f7c3f, #3a6b2c)', border: 'none', borderRadius: 8, fontWeight: 600, boxShadow: '0 2px 8px rgba(79,124,63,0.25)' }}
          >
            Add Article
          </Button>
        </Space>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <Table
          columns={tableColumns}
          dataSource={data}
          rowKey="_id"
          loading={{ spinning: loading, indicator: <Spin size="large" /> }}
          locale={{
            emptyText: (
              <Empty description={<Text style={{ color: '#64748b' }}>No articles found</Text>} style={{ padding: '40px 0' }} />
            ),
          }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => <Text style={{ color: '#64748b', fontSize: 13 }}>Total: {total}</Text>, style: { padding: '12px 20px', borderTop: '1px solid #f1f5f9' } }}
          scroll={{ x: 'max-content' }}
          style={{ background: 'transparent' }}
          rowClassName={() => 'crud-table-row'}
        />
      </div>

      {/* Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #4f7c3f, #3a6b2c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {editingItem ? <EditOutlined style={{ color: '#fff' }} /> : <PlusOutlined style={{ color: '#fff' }} />}
            </div>
            <span style={{ color: '#0f172a', fontWeight: 700, fontSize: 17 }}>
              {editingItem ? 'Edit Article' : 'Add Article'}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={740}
        okButtonProps={{ style: { background: 'linear-gradient(135deg, #4f7c3f, #3a6b2c)', border: 'none', borderRadius: 8, fontWeight: 600 } }}
        cancelButtonProps={{ style: { borderColor: '#cbd5e1', color: '#64748b', borderRadius: 8 } }}
        styles={{
          content: { background: '#ffffff', borderRadius: 16, padding: 0, border: '1px solid #e2e8f0' },
          header: { background: '#ffffff', borderBottom: '1px solid #f1f5f9', padding: '20px 24px 16px', borderRadius: '16px 16px 0 0' },
          body: { padding: '24px', background: '#ffffff' },
          footer: { background: '#ffffff', borderTop: '1px solid #f1f5f9', padding: '16px 24px', borderRadius: '0 0 16px 16px' },
          mask: { backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.45)' },
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          {/* Title */}
          <Form.Item
            name="title"
            label={<Text style={{ color: '#334155', fontWeight: 600, fontSize: 13 }}>Title <span style={{ color: '#ff4d4f' }}>*</span></Text>}
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="Article title" style={{ borderRadius: 8, borderColor: '#cbd5e1' }} />
          </Form.Item>

          {/* Content */}
          <Form.Item
            name="content"
            label={<Text style={{ color: '#334155', fontWeight: 600, fontSize: 13 }}>Content <span style={{ color: '#ff4d4f' }}>*</span></Text>}
            rules={[{ required: true, message: 'Content is required' }]}
          >
            <TextArea rows={6} placeholder="Article content..." style={{ borderRadius: 8, borderColor: '#cbd5e1' }} />
          </Form.Item>

          {/* Author fields */}
          <Divider style={{ borderColor: '#f1f5f9', margin: '4px 0 16px' }}>
            <Text style={{ color: '#4f7c3f', fontSize: 12, fontWeight: 600 }}>Author Info</Text>
          </Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="authorName"
                label={<Text style={{ color: '#334155', fontWeight: 600, fontSize: 13 }}>Author Name <span style={{ color: '#ff4d4f' }}>*</span></Text>}
                rules={[{ required: true, message: 'Author name is required' }]}
              >
                <Input prefix={<UserOutlined style={{ color: '#4f7c3f' }} />} placeholder="Author name" style={{ borderRadius: 8, borderColor: '#cbd5e1' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="authorBio"
                label={<Text style={{ color: '#334155', fontWeight: 600, fontSize: 13 }}>Author Bio</Text>}
              >
                <Input placeholder="Short bio" style={{ borderRadius: 8, borderColor: '#cbd5e1' }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Images */}
          <Divider style={{ borderColor: '#f1f5f9', margin: '4px 0 16px' }}>
            <Text style={{ color: '#4f7c3f', fontSize: 12, fontWeight: 600 }}>Images</Text>
          </Divider>
          <Row gutter={16}>
            {[
              { key: 'coverImage', label: 'Cover Image' },
              { key: 'inlineImage1', label: 'Inline Image 1' },
              { key: 'inlineImage2', label: 'Inline Image 2' },
            ].map(({ key, label }) => {
              const savedUrl = getSavedImageUrl(key);
              return (
                <Col span={8} key={key}>
                  <Form.Item label={<Text style={{ color: '#334155', fontWeight: 600, fontSize: 13 }}>{label}</Text>}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {editingItem && savedUrl && (
                        <div style={{ padding: '6px 8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img src={savedUrl} alt={label} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <Text style={{ fontSize: 11, color: '#166534', fontWeight: 600, display: 'block' }}>Saved Image</Text>
                          </div>
                          <a href={savedUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', fontSize: 11 }}>
                            <EyeOutlined />
                          </a>
                        </div>
                      )}
                      <Upload {...fileUploadProps(key)}>
                        <Button
                          icon={<UploadOutlined />}
                          style={{
                            borderColor: files[key] ? '#4f7c3f' : '#cbd5e1',
                            color: files[key] ? '#166534' : '#475569',
                            background: files[key] ? '#f0fdf4' : '#ffffff',
                            borderRadius: 8,
                            width: '100%',
                          }}
                        >
                          {files[key] ? '✅ Selected' : savedUrl ? 'Replace' : 'Upload'}
                        </Button>
                      </Upload>
                    </div>
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Form>
      </Modal>

      {/* Light theme table styles */}
      <style>{`
        .crud-table-row { background: #ffffff !important; transition: background 0.15s !important; }
        .crud-table-row:hover > td { background: #f0fdf4 !important; }
        .ant-table-thead > tr > th {
          background: #f8fafc !important;
          color: #64748b !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.08em !important;
          border-bottom: 1px solid #e2e8f0 !important;
          font-weight: 700 !important;
        }
        .ant-table-tbody > tr > td { border-bottom: 1px solid #f1f5f9 !important; }
        .ant-upload-list { display: none; }
      `}</style>
    </div>
  );
};

export default ArticlesPage;
