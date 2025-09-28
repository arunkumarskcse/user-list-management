import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Layout, Table, Avatar, Button, Input, Space, Card, Typography, Modal, Form, message, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, TableOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { getUsers } from '../api-action/UserActions';
import { RootState } from '../redux/reducers';

// Components
import HeaderComponent from './Header';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const { Content } = Layout;
const { Title } = Typography;

const UserList: React.FC = () => {

  const [view, setView] = useState<"table" | "card">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">('create');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();

  // mergedUsers from localStorage or API
  const storedMergedUsers = localStorage.getItem("mergedUsers");

  const [mergedUsers, setMergedUsers] = useState<User[]>(() => {
    return storedMergedUsers ? JSON.parse(storedMergedUsers) : [];
  });

  const apiUsers = useSelector((state: RootState) => state.UserReducer.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // whenever API users update and mergedUsers is empty, populate localStorage
  useEffect(() => {
    if (mergedUsers.length === 0 && apiUsers.length > 0) {
      setMergedUsers(apiUsers);
      localStorage.setItem("mergedUsers", JSON.stringify(apiUsers));
    }
  }, [apiUsers, mergedUsers]);

  useEffect(() => {
    localStorage.setItem("mergedUsers", JSON.stringify(mergedUsers));
  }, [mergedUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Modal handlers
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Create user
  const handleCreate = (values: any) => {
    const nextId =
      mergedUsers.length > 0
        ? Math.max(...mergedUsers.map((u) => u.id)) + 1
        : 1;

    const newUser: User = {
      id: nextId,
      ...values,
      avatar: values.profile_image,
    };

    setMergedUsers((prev) => [...prev, newUser]);

    messageApi.success("User created successfully!");
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleEditClick = (row: any) => {
    setCurrentUserId(row.id);
    form.setFieldsValue({
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      profile_image: row.avatar
    });
  }

  // Update user
  const handleUpdate = (values: any) => {
    if (!currentUserId) return;

    const updatedUser: User = {
      id: currentUserId,
      ...values,
      avatar: values.profile_image,
    };

    setMergedUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? updatedUser : u))
    );

    messageApi.success("User updated successfully!");
    setIsModalOpen(false);
    form.resetFields();
  };

  // Delete user
  const handleDelete = (id: number) => {
    setMergedUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      localStorage.setItem("mergedUsers", JSON.stringify(updated));
      return updated;
    });
    messageApi.success("User deleted successfully!");
  };

  // Search functionality
  const filteredUsers = mergedUsers.filter((user) =>
    user.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Users table data
  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "avatar",
      render: (text: string, record: any) => (
        <Space>
          <Avatar src={record.avatar} />
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Action",
      key: "action",
      render: (row: any) => (
        <Space>
          <Button type="primary" onClick={() => { setMode('edit'); showModal(); handleEditClick(row) }} size="middle" style={{ borderRadius: 3 }}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(row.id)} size="middle" style={{ borderRadius: 3 }}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // calculate which users to show
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = mergedUsers.slice(startIndex, endIndex);

  return (

    <Layout style={{ minHeight: "100vh" }} className="user-list-layout">

      {contextHolder}

      {/* Top Header */}
      <HeaderComponent />

      <Content style={{ padding: 44, background: "#f5f7fa" }}>

        <Card>

          <div style={{ padding: 20 }}>

            <Space
              style={{
                // marginBottom: 16,
                // width: "100%",
                // justifyContent: "space-between",
                marginBottom: 16,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >

              {/* <Title style={{ color: "#000", margin: 0 }} level={4}>
                Users
              </Title> */}
              <Title style={{ margin: 0 }} level={4}>Users</Title>

              <Space
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  justifyContent: "flex-start",
                }}
                className="user-actions">

                <Input
                  placeholder="input search text"
                  suffix={<SearchOutlined />}
                  style={{ width: 200, borderRadius: 2 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <Button type="primary" onClick={() => { showModal(); setMode('create'); }} style={{ borderRadius: 2 }}>Create User</Button>

              </Space>

            </Space>

            {/* View handle buttons */}
            <Button
              type="default"
              icon={<TableOutlined />}
              onClick={() => setView("table")}
              style={{
                borderRadius: 2,
                borderColor: view === "table" ? '#1677ff' : undefined,
                color: view === "table" ? '#1677ff' : undefined,
                backgroundColor: 'transparent',
              }}
            >
              Table
            </Button>

            <Button
              type={view === "card" ? "primary" : "default"}
              icon={<UnorderedListOutlined />}
              onClick={() => setView("card")}
              style={{
                borderRadius: 2,
                borderColor: view === "card" ? '#1677ff' : undefined,
                color: view === "card" ? '#1677ff' : undefined,
                backgroundColor: 'transparent',
              }}
            >
              Card
            </Button>

          </div>

          {/* User Table */}
          {view === "table" && (

            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredUsers.slice(startIndex, endIndex)}
              pagination={false}
              scroll={{ x: "max-content" }}
            />

          )}

          {/* User Card View */}
          {view === "card" && (

            <div className="user-grid">
              {(filteredUsers || []).map((user) => (
                <div
                  key={user.id}
                  style={{
                    position: "relative",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    background: "#fff",
                    padding: "26px",
                    textAlign: "center",
                    transition: "0.3s",
                  }}
                >
                  {/* Hover overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.4)",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0,
                      transition: "opacity 0.3s",
                      zIndex: 10
                    }}
                    className="overlay"
                  >
                    <Space>
                      <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        style={{
                          background: "#6c63ff", color: "#fff", width: 55,
                          height: 55,
                          fontSize: 30
                        }}
                        onClick={() => { setMode('edit'); showModal(); handleEditClick(user) }}
                      />
                      <Button
                        shape="circle"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        style={{
                          width: 55,
                          height: 55,
                          fontSize: 30
                        }}
                        onClick={() => handleDelete(user.id)}
                      />
                    </Space>
                  </div>

                  <Avatar
                    src={user.avatar}
                    size={100}
                    style={{ marginBottom: 16 }}
                  />
                  <Title level={4} style={{ margin: 0 }}>
                    {user.first_name} {user.last_name}
                  </Title>
                  <p style={{ color: "gray", margin: 0 }}>{user.email}</p>

                </div>

              ))}
            </div>
          )}
        </Card>

        {/* Pagination */}
        {(filteredUsers?.length) > 0 && (view === "table") && (
          <div style={{ display: "flex", justifyContent: "end", marginTop: "16px" }}>
            <Pagination
              current={currentPage}
              total={filteredUsers.length}
              pageSize={pageSize}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}

      </Content>

      {/* Create and Edit Modal */}
      <Modal
        title={mode === 'create' ? 'Create New User' : 'Edit User'}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onCancel={handleCancel}
        width={600}
        footer={null}
      >
        <Form
          form={form}
          name="user_form"
          onFinish={mode === "create" ? handleCreate : handleUpdate}
          layout="vertical"
        >

          {/* First name */}
          <Form.Item
            name="first_name"
            rules={[{ required: true, message: "Please enter first name!" }]}
            style={{ marginTop: "30px" }}
            label={<span style={{ fontSize: 14 }}>First Name</span>}
          >
            <Input
              placeholder="Please enter first name"
              size="large"
            />
          </Form.Item>

          {/* Last name */}
          <Form.Item
            name="last_name"
            rules={[{ required: true, message: "Please enter last name!" }]}
            style={{ marginTop: "30px" }}
            label={<span style={{ fontSize: 14 }}>Last Name</span>}
          >
            <Input
              placeholder="Please enter last name"
              size="large"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter email!" }]}
            style={{ marginTop: "30px" }}
            label={<span style={{ fontSize: 14 }}>Email</span>}
          >
            <Input
              placeholder="Please enter email"
              size="large"
            />
          </Form.Item>

          {/* Profile image */}
          <Form.Item
            name="profile_image"
            rules={[{ required: true, message: "Please enter profile image link!" }]}
            style={{ marginTop: "30px", marginBottom: 130 }}
            label={<span style={{ fontSize: 14 }}>Profile image link</span>}
          >
            <Input
              placeholder="Please enter profile image link"
              size="large"
            />
          </Form.Item>

          {/* Buttons */}
          <Form.Item style={{ marginTop: 30, textAlign: "right" }}>
            <Button
              style={{ marginRight: 10 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

        </Form>

      </Modal>

      <style>
        {`
          .overlay:hover {
            opacity: 1 !important;
          }
        `}
      </style>
    </Layout>
  );
};

export default UserList;